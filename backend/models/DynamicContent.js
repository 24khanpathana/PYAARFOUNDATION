const mongoose = require('mongoose');

const CustomFormFieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, default: 'text' },
}, { _id: false });

const isHttpUrl = (value) => {
    if (!value) return true;

    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

const DynamicContentSchema = new mongoose.Schema({
    page: { 
        type: String, 
        required: true, 
        enum:['Home', 'About', 'Volunteer', 'Team', 'Event', 'Service', 'Contact', 'Gallery', 'Donation Schema', 'Donation Schemes'] 
    },
    title: { type: String, required: true },
    description: { type: String },
    amount: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    detailsLink: {
        type: String,
        default: '',
        trim: true,
        validate: {
            validator: isHttpUrl,
            message: 'Details link must be a valid HTTP or HTTPS URL',
        },
    },
    date: { type: Date }, 
    role: { type: String },
    customForm: {
        title: String,
        fields: [CustomFormFieldSchema]
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DynamicContent', DynamicContentSchema);
