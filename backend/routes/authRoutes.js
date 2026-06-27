const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const router = express.Router();

const ensureDatabaseReady = (res) => {
    if (mongoose.connection.readyState === 1) {
        return true;
    }

    res.status(503).json({
        message: 'Database is not connected yet. Please start the backend and try again in a moment.',
    });
    return false;
};

// @route   POST /api/auth/login
// @desc    Authenticate admin and get token
// @access  Public
router.post('/login', async (req, res) => {
    const adminId = (req.body.adminId || req.body.email || '').trim();
    const { password } = req.body;

    try {
        if (!ensureDatabaseReady(res)) return;

        const admin = await Admin.findOne({ adminId });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password || '', admin.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            id: admin.id,
            adminId: admin.adminId
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '8h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
    const identifier = (req.body.email || req.body.adminId || '').trim();
    const isProduction = process.env.NODE_ENV === 'production';

    try {
        if (!ensureDatabaseReady(res)) return;

        const admin = await Admin.findOne({ adminId: identifier }) || await Admin.findOne({
            adminId: { $regex: `^${escapeRegExp(identifier)}$`, $options: 'i' },
        });

        if (!admin) {
            // Send success response even if not found to prevent email enumeration
            return res.status(isProduction ? 200 : 404).json({
                message: isProduction
                    ? 'If that email exists, a reset link will be sent.'
                    : `No admin account was found for "${identifier}". Use the exact admin email from ADMIN_ID.`,
            });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // Hash token for saving in database
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire for 15 minutes
        const resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        admin.resetPasswordToken = resetPasswordToken;
        admin.resetPasswordExpires = resetPasswordExpires;
        await admin.save();

        const requestOrigin = req.get('origin');
        const frontendUrl = (requestOrigin || process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
        const resetUrl = `${frontendUrl}/admin/reset-password?token=${resetToken}`;
        const successResponse = {
            message: 'Reset link generated. Use the link below to create a new password.',
            resetUrl,
        };

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please click on the following link to reset your password:</p>
            <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
            <p>This link is valid for 15 minutes.</p>
        `;

        try {
            if (!process.env.BREVO_API_KEY) {
                console.log('Password reset link:', resetUrl);
                return res.status(200).json(successResponse);
            }

            await sendEmail({
                to: admin.adminId,
                subject: 'Password Reset Request',
                htmlContent: message,
            });

            res.status(200).json(successResponse);
        } catch (error) {
            console.error('Email sending failed error:', error);

            // Keep the reset token in place so the admin can still use it if the email provider fails.
            res.status(200).json(successResponse);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using token
// @access  Public
router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Reset token and new password are required' });
    }

    if (!ensureDatabaseReady(res)) return;

    // Recreate hash from token to find in DB
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    try {
        const admin = await Admin.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);

        // Clear reset properties
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;

        await admin.save();

        res.status(200).json({ message: 'Password reset successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
