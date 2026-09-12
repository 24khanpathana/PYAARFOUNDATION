const express = require('express');
const router = express.Router();
const FormSubmission = require('../models/FormSubmission');
const notifyAdmin = require('../utils/notifyAdmin');

router.post('/submit', async (req, res) => {
    try {
        const { formId, formTitle, data } = req.body;
        
        // Validate required fields
        if (!formTitle || !data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: 'Form title and data are required' });
        }

        // Save form submission to database
        const submission = new FormSubmission({ formId, formTitle, data });
        const savedSubmission = await submission.save();
        console.log(`✓ Form submission saved: ${savedSubmission._id}`);

        // Build professional HTML email with form data
        let fieldsHtml = '';
        for (const [key, value] of Object.entries(data)) {
            fieldsHtml += `
                <tr>
                    <td style="padding: 12px; border: 1px solid #e0e0e0; background: #f5f5f5; font-weight: bold; color: #333;">
                        ${key}
                    </td>
                    <td style="padding: 12px; border: 1px solid #e0e0e0; color: #555;">
                        ${value || 'N/A'}
                    </td>
                </tr>
            `;
        }

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
                <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #8b5a3c; padding-bottom: 20px;">
                        <h1 style="color: #8b5a3c; margin: 0; font-size: 28px;">🐾 Pyaar Foundation</h1>
                        <p style="color: #666; margin: 8px 0 0 0; font-size: 14px;">New Form Submission</p>
                    </div>

                    <!-- Form Title -->
                    <div style="background: #f0e6d2; padding: 15px; border-radius: 6px; margin-bottom: 25px; border-left: 4px solid #8b5a3c;">
                        <h2 style="color: #8b5a3c; margin: 0; font-size: 20px;">📋 ${formTitle}</h2>
                        <p style="color: #666; margin: 8px 0 0 0; font-size: 13px;">Submitted on ${new Date().toLocaleString()}</p>
                    </div>

                    <!-- Form Data Table -->
                    <div style="margin-bottom: 25px;">
                        <table style="width: 100%; border-collapse: collapse; background: white;">
                            <tbody>
                                ${fieldsHtml}
                            </tbody>
                        </table>
                    </div>

                    <!-- Submission Details -->
                    <div style="background: #e8f4f8; padding: 15px; border-radius: 6px; border-left: 4px solid #0088cc; margin-bottom: 25px;">
                        <p style="margin: 0; color: #0066aa; font-size: 13px;">
                            <strong>Submission ID:</strong> ${savedSubmission._id}
                        </p>
                        <p style="margin: 8px 0 0 0; color: #0066aa; font-size: 13px;">
                            <strong>Date:</strong> ${new Date().toLocaleString()}
                        </p>
                    </div>

                    <!-- Action Note -->
                    <div style="background: #fff9f0; padding: 15px; border-radius: 6px; border-left: 4px solid #ff9800;">
                        <p style="color: #ff6f00; margin: 0; font-size: 13px;">
                            ⚠️ <strong>Action Required:</strong> Please review this submission and respond to the user within 24 hours.
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                        <p style="color: #999; font-size: 12px; margin: 0;">
                            © 2024 Pyaar Foundation. All rights reserved.<br>
                            This is an automated email. Please do not reply directly.
                        </p>
                    </div>
                </div>
            </div>
        `;

        // Send email to admin
        const emailSent = await notifyAdmin({ 
            subject: `📋 New Form Submission: ${formTitle}`, 
            htmlContent 
        });

        console.log(`✓ Email notification sent: ${emailSent}`);

        res.status(201).json({ 
            message: 'Form submitted successfully! Admin has been notified.', 
            emailSent,
            submissionId: savedSubmission._id
        });
    } catch (error) {
        console.error('Form submission error:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

module.exports = router;
