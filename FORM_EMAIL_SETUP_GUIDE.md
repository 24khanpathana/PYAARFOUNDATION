# Form Submission Email Notification Setup Guide

## Overview
This guide explains how to set up and configure email notifications for form submissions from the Service page of the Pyaar Foundation website.

## System Architecture

### How It Works
1. **User fills and submits a form** on the Service page (e.g., custom form, volunteer application, feedback, complaints)
2. **Form data is sent to backend** via `/api/forms/submit` endpoint
3. **Backend stores the submission** in MongoDB database
4. **Admin notification email is automatically sent** to configured admin email addresses
5. **Confirmation message is shown** to the user on the frontend

### Email Flow Diagram
```
User fills form on Service page
           ↓
Frontend sends POST request to /api/forms/submit
           ↓
Backend validates form data
           ↓
Saves to FormSubmission collection in MongoDB
           ↓
Generates formatted HTML email
           ↓
Fetches admin email addresses from:
  - Environment variables (ADMIN_EMAIL, ADMIN_ID)
  - Database Settings collection (otpEmails)
           ↓
Sends email via Brevo SMTP API
           ↓
Returns success response to frontend
```

---

## Configuration Requirements

### 1. Environment Variables (.env)
The backend/.env file must contain the following variables:

```
# Email Configuration
ADMIN_EMAIL=workpyaar@gmail.com
ADMIN_ID=workpyaar@gmail.com
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email Sender Details (Optional)
MAIL_SENDER_EMAIL=workpyaar@gmail.com
MAIL_SENDER_NAME=Pyaar Foundation

# Other required configs
MONGO_URI=mongodb+srv://...
JWT_SECRET=yoursecretjwtkeygoeshere
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 2. Brevo Email Service Setup
The system uses **Brevo** (formerly Sendinblue) for sending emails.

**Steps to configure Brevo:**

1. **Create a Brevo Account**
   - Visit https://www.brevo.com/
   - Sign up for a free account

2. **Get API Key**
   - Log in to your Brevo dashboard
   - Go to Settings → SMTP & API
   - Create API Key (v3)
   - Copy the API key and add to .env as `BREVO_API_KEY`

3. **Verify Sender Email**
   - In Brevo dashboard, go to Senders & Sending
   - Add sender email (should match ADMIN_EMAIL or MAIL_SENDER_EMAIL)
   - Verify the email by clicking confirmation link

4. **Check Email Limits**
   - Free tier typically allows 300 emails/day
   - If you need higher limits, upgrade your plan

---

## Admin Email Configuration Methods

### Method 1: Environment Variables (Default)
```env
ADMIN_EMAIL=workpyaar@gmail.com
ADMIN_ID=workpyaar@gmail.com
```
- Set in backend/.env file
- Used automatically when app starts
- Cannot be changed without restarting backend

### Method 2: Settings Collection (Dynamic)
Admins can add/remove OTP emails through the admin panel settings:

1. Log in to Admin Panel
2. Click on **Settings** tab (if available)
3. Under "OTP Email Settings"
   - Add email: Enter email and click "Add Email"
   - Remove email: Click remove button next to email
4. These emails will also receive form notifications

### Method 3: Combined (Recommended)
Use both methods for redundancy:
- Primary admin email via environment variables
- Additional emails via Settings in admin panel

---

## Testing Form Submissions

### Step 1: Ensure Backend is Running
```bash
cd backend
npm install  # If not already installed
npm start
```
Expected output:
```
✓ MongoDB connected successfully.
Server running on port 5000
```

### Step 2: Access Service Page
1. Open frontend in browser: http://localhost:3000
2. Navigate to **Service** page
3. Scroll to "Take Action" section
4. You'll see multiple forms available

### Step 3: Submit a Test Form
1. Fill out any form (e.g., "Volunteer Application", custom form)
2. Click Submit
3. Watch for success message: "Form submitted successfully! Admin has been notified via email."

### Step 4: Check Email
1. Check the admin email inbox (workpyaar@gmail.com by default)
2. Look for email with subject like "📋 New Form Submission: [Form Name]"
3. Email should contain formatted table with all submitted data

---

## Troubleshooting Guide

### Issue 1: Email Not Being Sent

**Symptoms:**
- Form shows "submitted successfully" but no email arrives
- Check backend console

**Possible Causes & Solutions:**

**a) Missing or Invalid Brevo API Key**
- Check .env file has BREVO_API_KEY
- Verify API key is correct (starts with `xkeysib-`)
- Regenerate key in Brevo dashboard if necessary
- Restart backend after updating

**b) Sender Email Not Verified in Brevo**
- Log in to Brevo dashboard
- Go to Senders & Sending
- Check if MAIL_SENDER_EMAIL is verified
- Verify email if not already done

**c) Admin Email Not Configured**
- Check .env has ADMIN_EMAIL or ADMIN_ID
- Verify email format is correct (should contain @)
- Restart backend after changes

**d) Database Connection Issue**
- Verify MONGO_URI is correct
- Check MongoDB connection is active
- Look for "MongoDB connected" message in console

### Issue 2: Wrong Admin Email Receiving Notifications

**Solution:**
1. Update ADMIN_EMAIL in .env file
2. Restart backend server
3. Or add correct email via Settings tab in admin panel

### Issue 3: Emails Going to Spam

**Possible Causes:**
- Sender email not verified in Brevo
- Brevo account has poor reputation
- Email content flagged as spam

**Solutions:**
- Verify sender email in Brevo
- Check Brevo dashboard for blacklist status
- Use different sender email if reputation is poor

### Issue 4: Too Many Emails / Rate Limiting

**Symptoms:**
- Getting "rate limit" errors in console
- Not all form submissions generate emails

**Solutions:**
- Upgrade Brevo plan if on free tier (300 emails/day limit)
- Check Brevo dashboard for daily limit
- Wait for rate limit window to reset

---

## Email Content Structure

### Email Template
Every form submission email includes:

1. **Header**
   - Pyaar Foundation branding
   - "New Form Submission" label

2. **Form Title Section**
   - Form name with icon (📋)
   - Submission timestamp

3. **Form Data Table**
   - Field names in left column
   - Submitted values in right column
   - Professional styling

4. **Submission Details Box**
   - Submission ID (database record ID)
   - Timestamp of submission

5. **Action Required Notice**
   - Alert that admin should respond within 24 hours
   - Warning color highlighting

6. **Footer**
   - Copyright and disclaimer
   - Note that it's automated email

### Email Example
```
TO: workpyaar@gmail.com
SUBJECT: 📋 New Form Submission: Volunteer Application
FROM: Pyaar Foundation <workpyaar@gmail.com>

---

[Header with Pyaar Foundation logo]

FORM: Volunteer Application
Submitted on: 02/07/2024, 3:45 PM

| Field       | Value                    |
|-------------|--------------------------|
| Name        | John Doe                 |
| Email       | john@example.com         |
| Mobile      | 9876543210              |
| Skills      | Veterinary care, Design  |

Submission ID: 64b9c3d8e9f7a2b1c0d5e4f3
Date: 02/07/2024, 3:45 PM

⚠️ Action Required: Please review this submission and respond to the user within 24 hours.
```

---

## Monitoring & Debugging

### Check Backend Console Logs
When forms are submitted, you should see logs like:

```
📧 Preparing to send admin notification: 📋 New Form Submission: Volunteer Application
✓ Found 0 OTP emails in settings
✓ Admin recipients: workpyaar@gmail.com
📨 Sending email to: workpyaar@gmail.com
✓ Form submission saved: 64b9c3d8e9f7a2b1c0d5e4f3
✓ Email notification sent: true
```

### Check Database
View stored form submissions in MongoDB:

```
Collection: formsubmissions
Fields:
  - formId: Reference to the DynamicContent form
  - formTitle: Name of the form
  - data: Map of field names and values
  - submittedAt: Timestamp of submission
```

### Email Log in Brevo
1. Log in to Brevo dashboard
2. Go to Reports → Email Activity
3. Search for recent emails
4. Check delivery status (Sent, Bounce, Opened, etc.)

---

## Best Practices

### 1. Regular Monitoring
- Check admin email regularly for form submissions
- Respond to submissions within 24 hours
- Use email responses to improve services

### 2. Email Backup
- Periodically export form submissions from admin panel
- Create backups of important submissions
- Store in secure location

### 3. Add Multiple Admin Emails
- Configure backup admin email via Settings
- Ensures no submissions are missed if primary email is down
- Different team members can handle different forms

### 4. Test After Updates
- After updating environment variables
- After changing admin email configuration
- After Brevo API key changes
- Always test with a form submission

### 5. Monitor Email Quota
- Check Brevo dashboard monthly
- Track email sending volume
- Upgrade plan if approaching limits

---

## Admin Panel Form Management

### View Form Submissions
1. Admin Panel → Adoption Animals tab
2. Scroll down to see "Form Submissions" or similar section
3. View all submitted forms and responses

### Add Custom Forms
1. Admin Panel → Content Manager tab
2. Select "Service" page
3. Add content with custom form fields
4. When service page form is filled, email is sent

### Configure Admin Emails
1. Admin Panel → Settings tab
2. OTP Email Settings section
3. Add/remove email addresses for notifications

---

## API Endpoints

### Form Submission Endpoint
```
POST /api/forms/submit

Request Body:
{
  "formId": "64b9c3d8e9f7a2b1c0d5e4f3",
  "formTitle": "Volunteer Application",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "skills": "Veterinary care"
  }
}

Response:
{
  "message": "Form submitted successfully! Admin has been notified.",
  "emailSent": true,
  "submissionId": "64b9c3d8e9f7a2b1c0d5e4f3"
}
```

---

## Quick Troubleshooting Checklist

- [ ] Is backend running? (Check "Server running on port 5000" message)
- [ ] Is BREVO_API_KEY set in .env?
- [ ] Is ADMIN_EMAIL set in .env?
- [ ] Is sender email verified in Brevo dashboard?
- [ ] Is MongoDB connected? (Check "MongoDB connected successfully")
- [ ] Are there any error messages in backend console?
- [ ] Check Brevo email activity for delivery status
- [ ] Try submitting a test form
- [ ] Check admin email inbox (including spam folder)
- [ ] Restart backend if any .env changes were made

---

## Support & Further Help

If form emails are still not working:

1. **Collect Debug Information:**
   - Screenshot of backend console logs
   - Form submission request/response from browser DevTools
   - Brevo email activity status
   - .env configuration (without sensitive keys)

2. **Check System Administrator:**
   - Verify backend is running correctly
   - Verify database connection
   - Verify Brevo API key validity

3. **Test Alternative Email:**
   - Update ADMIN_EMAIL to a different email
   - Restart backend
   - Submit test form
   - Check if email is received

---

## Recent Improvements (v1.1)

✓ Enhanced email HTML formatting with professional design
✓ Added detailed logging for debugging
✓ Improved error messages in frontend
✓ Added success confirmation message with email mention
✓ Added submission ID tracking
✓ Enhanced admin recipient detection logic
✓ Better fallback email handling

---

**Last Updated:** July 2024
**Version:** 1.1
