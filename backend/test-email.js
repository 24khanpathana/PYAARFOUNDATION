const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('🔍 Pyaar Foundation - Email Sending Diagnostic Tool\n');
console.log('=' .repeat(60) + '\n');

// Test 1: Check environment variables
console.log('📋 Test 1: Checking Environment Variables\n');
const requiredEnvs = ['BREVO_API_KEY', 'ADMIN_EMAIL', 'ADMIN_ID'];
const envStatus = {};

requiredEnvs.forEach(env => {
    const value = process.env[env];
    if (value) {
        const masked = env.includes('KEY') ? value.substring(0, 20) + '...' : value;
        console.log(`  ✓ ${env}: ${masked}`);
        envStatus[env] = true;
    } else {
        console.log(`  ❌ ${env}: NOT SET`);
        envStatus[env] = false;
    }
});

console.log('\n' + '=' .repeat(60) + '\n');

// Test 2: Test Brevo API connectivity
console.log('📧 Test 2: Testing Brevo API Connectivity\n');

const testEmail = async () => {
    try {
        if (!envStatus.BREVO_API_KEY) {
            console.log('  ❌ BREVO_API_KEY not found. Cannot test email sending.');
            return;
        }

        const testData = {
            sender: {
                name: 'Pyaar Foundation (Test)',
                email: process.env.ADMIN_EMAIL || 'workpyaar@gmail.com',
            },
            to: [{ email: process.env.ADMIN_EMAIL || 'workpyaar@gmail.com' }],
            subject: '🐾 TEST: Pyaar Foundation Email System',
            htmlContent: `
                <div style="font-family: Arial; max-width: 600px; padding: 20px;">
                    <h2 style="color: #8b5a3c;">✓ Email System Test Successful!</h2>
                    <p>This is a test email to verify that the Pyaar Foundation email system is working correctly.</p>
                    <hr>
                    <p><strong>Test Details:</strong></p>
                    <ul>
                        <li>API Key: ${process.env.BREVO_API_KEY.substring(0, 20)}...</li>
                        <li>Recipient: ${process.env.ADMIN_EMAIL || 'workpyaar@gmail.com'}</li>
                        <li>Timestamp: ${new Date().toLocaleString()}</li>
                    </ul>
                    <hr>
                    <p style="color: #999; font-size: 12px;">This is an automated test email.</p>
                </div>
            `,
        };

        console.log('  Sending test email...\n');

        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            testData,
            {
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.BREVO_API_KEY,
                    'content-type': 'application/json'
                }
            }
        );

        console.log('  ✓ Email sent successfully!');
        console.log(`  Message ID: ${response.data.messageId}\n`);
        console.log('  📍 Check your email inbox (including spam folder)');
        console.log('  📧 Email should arrive within 1-5 minutes\n');

    } catch (error) {
        console.log('  ❌ Error sending test email:\n');
        
        if (error.response) {
            console.log(`  Status: ${error.response.status}`);
            console.log(`  Error: ${JSON.stringify(error.response.data, null, 2)}\n`);
        } else {
            console.log(`  Error: ${error.message}\n`);
        }

        console.log('  🔧 Troubleshooting tips:');
        console.log('    - Verify BREVO_API_KEY is correct');
        console.log('    - Check if sender email is verified in Brevo');
        console.log('    - Ensure recipient email is valid');
        console.log('    - Check Brevo account status (not suspended)\n');
    }
};

testEmail();

console.log('=' .repeat(60) + '\n');
console.log('💡 Next Steps:\n');
console.log('  1. Check your email inbox and spam folder');
console.log('  2. If test email is received, form emails should work');
console.log('  3. If test email is NOT received:');
console.log('     - Verify BREVO_API_KEY in .env');
console.log('     - Check Brevo dashboard for account issues');
console.log('     - Verify sender email is verified in Brevo\n');
