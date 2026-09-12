const sendEmail = require('./sendEmail');
const Setting = require('../models/Setting');

const cleanEmail = (value) => (value || '').trim().replace(/^['"]|['"]$/g, '');

const splitEmails = (value) => cleanEmail(value)
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);

const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

const getAdminRecipients = async () => {
    let settings = null;
    let settingsEmails = [];
    
    try {
        settings = await Setting.findOne().lean();
        if (settings?.otpEmails && Array.isArray(settings.otpEmails)) {
            settingsEmails = settings.otpEmails;
            console.log(`✓ Found ${settingsEmails.length} OTP emails in settings`);
        }
    } catch (error) {
        console.error('⚠ Could not load admin email settings:', error.message);
    }

    // Collect admin emails from environment and settings
    const envAdminEmails = splitEmails(process.env.ADMIN_EMAIL || '');
    const envAdminId = splitEmails(process.env.ADMIN_ID || '');
    const recipients = [
        ...envAdminEmails,
        ...envAdminId,
        ...settingsEmails.flatMap(splitEmails),
    ]
        .filter(isEmail)
        .filter((email, index, self) => self.indexOf(email) === index); // Remove duplicates

    console.log(`✓ Admin recipients: ${recipients.join(', ')}`);
    return recipients;
};

const notifyAdmin = async ({ subject, htmlContent }) => {
    try {
        console.log(`📧 Preparing to send admin notification: ${subject}`);
        
        const recipients = await getAdminRecipients();

        if (recipients.length === 0) {
            console.warn('⚠ No admin recipients found. Using fallback email.');
        }

        const finalRecipients = recipients.length > 0 ? recipients : ['amaanp2710@gmail.com'];
        
        console.log(`📨 Sending email to: ${finalRecipients.join(', ')}`);
        
        await sendEmail({
            to: finalRecipients,
            subject,
            htmlContent,
        });
        
        console.log('✓ Admin notification email sent successfully');
        return true;
    } catch (error) {
        console.error('❌ Admin notification email failed:', error.message);
        return false;
    }
};

module.exports = notifyAdmin;
