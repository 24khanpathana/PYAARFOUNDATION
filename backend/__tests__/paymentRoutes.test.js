const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

const testKey = 'payment-callback-test-key';
process.env.ORANGE_PG_KEY = testKey;
process.env.FRONTEND_URL = 'https://pyaar.example';
process.env.ORANGE_PG_MERCHANT_ID = 'merchant-test';
process.env.ORANGE_PG_AGGREGATOR_ID = 'aggregator-test';
process.env.ORANGE_PG_CALLBACK_URL = 'https://pyaar.example/api/payments/callback';

const axios = require('axios');
const router = require('../routes/paymentRoutes');
const initiateHandler = router.stack.find((layer) => layer.route?.path === '/initiate').route.stack[0].handle;
const callbackHandler = router.stack.find((layer) => layer.route?.path === '/callback').route.stack[0].handle;

const signCallback = (parameters) => {
    const hashText = Object.keys(parameters)
        .filter((name) => name.toLowerCase() !== 'securehash')
        .sort()
        .map((name) => parameters[name])
        .filter((value) => value !== null && value !== undefined && value !== '')
        .join('');

    return crypto.createHmac('sha256', testKey).update(hashText, 'ascii').digest('hex');
};

const invokeCallback = (method, body = {}, query = {}) => {
    let redirectedUrl;
    callbackHandler({ method, body, query }, {
        redirect(url) {
            redirectedUrl = new URL(url);
        },
    });
    return redirectedUrl;
};

test('callback reports success only for a valid gateway signature', () => {
    const response = {
        paymentID: 'PAY-42',
        responseCode: '0000',
        amount: '100.00',
        merchantTxnNo: 'TXN-42',
    };
    response.secureHash = signCallback(response);

    const callbackUrl = invokeCallback('POST', response);

    assert.equal(callbackUrl.searchParams.get('payment'), 'success');
    assert.equal(callbackUrl.searchParams.get('merchantTxnNo'), 'TXN-42');
    assert.equal(callbackUrl.searchParams.get('paymentID'), 'PAY-42');
});

test('callback rejects a response changed after signing', () => {
    const response = {
        amount: '100.00',
        merchantTxnNo: 'TXN-42',
        responseCode: '0000',
    };
    response.secureHash = signCallback(response);
    response.responseCode = '000';

    const callbackUrl = invokeCallback('POST', response);

    assert.equal(callbackUrl.searchParams.get('payment'), 'failed');
    assert.equal(callbackUrl.searchParams.has('merchantTxnNo'), false);
});

test('callback does not trust success fields passed through a GET query', () => {
    const response = {
        amount: '100.00',
        merchantTxnNo: 'TXN-42',
        responseCode: '0000',
    };
    response.secureHash = signCallback(response);

    const callbackUrl = invokeCallback('GET', {}, response);

    assert.equal(callbackUrl.searchParams.get('payment'), 'failed');
    assert.equal(callbackUrl.searchParams.has('merchantTxnNo'), false);
});

test('initiate sends the page 68 sorted-parameter secure hash', async () => {
    const originalPost = axios.post;
    let sentPayload;
    let sentOptions;
    axios.post = async (_url, payload, options) => {
        sentPayload = payload;
        sentOptions = options;
        return {
            data: {
                responseCode: 'R1000',
                redirectURI: 'https://gateway.example/redirect',
                tranCtx: 'test-context',
            },
        };
    };

    const response = {
        statusCode: 200,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        },
    };

    try {
        await initiateHandler({ body: { amount: '100', name: 'Manish' } }, response);
    } finally {
        axios.post = originalPost;
    }

    const hashText = Object.keys(sentPayload)
        .filter((name) => name.toLowerCase() !== 'securehash')
        .sort()
        .map((name) => sentPayload[name])
        .filter((value) => value !== null && value !== undefined && value !== '')
        .join('');
    const expectedHash = crypto.createHmac('sha256', testKey).update(hashText, 'ascii').digest('hex');

    assert.equal(sentPayload.secureHash, expectedHash);
    assert.equal(sentOptions.headers.securehash, undefined);
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.redirectUrl, 'https://gateway.example/redirect?tranCtx=test-context');
});