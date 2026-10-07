const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const router = express.Router();

const gatewayConfig = {
    merchantId: process.env.ORANGE_PG_MERCHANT_ID,
    aggregatorId: process.env.ORANGE_PG_AGGREGATOR_ID,
    key: process.env.ORANGE_PG_KEY,
    initiateUrl: process.env.ORANGE_PG_INITIATE_URL || 'https://pgpayuat.icicibank.com/tsp/pg/api/v2/initiateSale',
    callbackUrl: process.env.ORANGE_PG_CALLBACK_URL,
    frontendUrl: (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, ''),
};

const createSecureHash = (payload) => {
    const hashText = Object.keys(payload)
        .filter((name) => name.toLowerCase() !== 'securehash')
        .sort()
        .map((name) => payload[name])
        .filter((value) => value !== null && value !== undefined && value !== '')
        .join('');

    return crypto.createHmac('sha256', gatewayConfig.key).update(hashText, 'ascii').digest('hex');
};

const hasValidCallbackSecureHash = (parameters) => {
    if (!gatewayConfig.key || !parameters || typeof parameters !== 'object') return false;

    const secureHash = Object.entries(parameters)
        .find(([name]) => name.toLowerCase() === 'securehash')?.[1];
    if (typeof secureHash !== 'string' || !/^[a-f\d]{64}$/i.test(secureHash)) return false;

    const expected = Buffer.from(createSecureHash(parameters), 'hex');
    const received = Buffer.from(secureHash, 'hex');
    return crypto.timingSafeEqual(expected, received);
};

const createTransactionNumber = () => `DON${Date.now()}${crypto.randomInt(100, 999)}`;

router.post('/initiate', async (req, res) => {
    try {
        const { amount, name } = req.body;
        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount < 1 || numericAmount > 10000000) {
            return res.status(400).json({ message: 'Enter a valid donation amount between ₹1 and ₹1,00,00,000.' });
        }

        if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
            return res.status(400).json({ message: 'Enter your name.' });
        }

        if (!gatewayConfig.merchantId || !gatewayConfig.aggregatorId || !gatewayConfig.key || !gatewayConfig.callbackUrl) {
            return res.status(503).json({ message: 'Payment gateway is not configured on the server.' });
        }

        const merchantTxnNo = createTransactionNumber();
        const payload = {
            merchantId: gatewayConfig.merchantId,
            aggregatorID: gatewayConfig.aggregatorId,
            merchantTxnNo,
            amount: numericAmount.toFixed(2),
            currencyCode: '356',
            payType: '0',
            customerEmailID: process.env.ORANGE_PG_DEFAULT_EMAIL || 'donor@pyaarfoundation.org',
            transactionType: 'SALE',
            returnURL: gatewayConfig.callbackUrl,
            txnDate: new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14),
            customerMobileNo: process.env.ORANGE_PG_DEFAULT_MOBILE || '9999999999',
            customerName: name.trim(),
            addlParam1: process.env.ORANGE_PG_ADDL_PARAM1 || 'PYAAR',
            addlParam2: process.env.ORANGE_PG_ADDL_PARAM2 || 'DONATION',
        };
        payload.secureHash = createSecureHash(payload);

        const { data } = await axios.post(gatewayConfig.initiateUrl, payload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000,
        });

        if (!data || data.responseCode !== 'R1000' || !data.redirectURI || !data.tranCtx) {
            console.error('Orange PG initiation rejected:', data);
            return res.status(502).json({
                message: data?.responseDescription || 'The payment gateway could not start the payment.',
            });
        }

        const redirectUrl = new URL(data.redirectURI);
        redirectUrl.searchParams.set('tranCtx', data.tranCtx);

        return res.json({ redirectUrl: redirectUrl.toString(), merchantTxnNo });
    } catch (error) {
        console.error('Payment initiation error:', error.response?.data || error.message);
        return res.status(502).json({ message: 'Unable to connect to the payment gateway. Please try again.' });
    }
});

router.all('/callback', (req, res) => {
    const result = req.method === 'POST' && req.body && typeof req.body === 'object' ? req.body : {};
    const hasValidHash = hasValidCallbackSecureHash(result);
    const status = hasValidHash && (result.responseCode === '0000' || result.responseCode === '000') ? 'success' : 'failed';
    const callbackUrl = new URL(`${gatewayConfig.frontendUrl}/donate`);
    callbackUrl.searchParams.set('payment', status);
    if (hasValidHash && result.merchantTxnNo) callbackUrl.searchParams.set('merchantTxnNo', result.merchantTxnNo);
    if (hasValidHash && result.paymentID) callbackUrl.searchParams.set('paymentID', result.paymentID);

    return res.redirect(callbackUrl.toString());
});

module.exports = router;