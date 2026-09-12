const express = require('express');
const router = express.Router();
const DynamicContent = require('../models/DynamicContent');
const { protect } = require('../middleware/authMiddleware');

const donationPages = ['Donation Schema', 'Donation Schemes'];

const normalizeContentPayload = (body) => {
    const payload = { ...body };

    if (!payload.date) {
        delete payload.date;
    }

    if (!donationPages.includes(payload.page)) {
        payload.amount = '';
    }

    if (payload.page !== 'Gallery') {
        payload.detailsLink = '';
    } else {
        payload.detailsLink = String(payload.detailsLink || '').trim();
    }

    if (payload.page === 'Service' && payload.customForm?.fields?.length) {
        payload.customForm = {
            title: payload.customForm.title || payload.title,
            fields: payload.customForm.fields
                .map(field => {
                    if (typeof field === 'string') {
                        return { name: field.trim(), type: 'text' };
                    }

                    return {
                        name: String(field.name || '').trim(),
                        type: field.type || 'text',
                    };
                })
                .filter(field => field.name),
        };

        if (payload.customForm.fields.length === 0) {
            delete payload.customForm;
        }
    } else {
        delete payload.customForm;
    }

    return payload;
};

router.post('/', protect, async (req, res) => {
    try {
        const newContent = new DynamicContent(normalizeContentPayload(req.body));
        await newContent.save();
        res.status(201).json(newContent);
    } catch (error) {
        res.status(error.name === 'ValidationError' ? 400 : 500).json({ message: error.message || 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const content = await DynamicContent.find().sort({ createdAt: -1 });
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const updated = await DynamicContent.findByIdAndUpdate(req.params.id, normalizeContentPayload(req.body), { new: true, runValidators: true });
        res.json(updated);
    } catch (error) {
        res.status(error.name === 'ValidationError' ? 400 : 500).json({ message: error.message || 'Server error' });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        await DynamicContent.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
