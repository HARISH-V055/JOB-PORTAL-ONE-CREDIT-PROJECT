# Email Notifications Setup Guide

## 📧 Email Feature Overview

Your Job Portal now sends automated emails for:
- ✅ Welcome email on user registration
- ✅ Application confirmation when job seeker applies
- ✅ Status update notifications when employer changes application status

## 🔧 Setup Instructions

### Option 1: Using Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "JobPortal"
   - Copy the 16-character password

3. **Update your `.env` file:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_FROM=JobPortal <noreply@jobportal.com>
   ```

### Option 2: Using Mailtrap (Best for Development)

Mailtrap catches all emails in a test inbox - perfect for development!

1. **Sign up** at https://mailtrap.io (free)
2. **Get SMTP credentials** from your inbox
3. **Update `.env`:**
   ```env
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your-mailtrap-username
   EMAIL_PASSWORD=your-mailtrap-password
   EMAIL_FROM=JobPortal <noreply@jobportal.com>
   ```

### Option 3: Using SendGrid (Production Ready)

1. **Sign up** at https://sendgrid.com (free tier: 100 emails/day)
2. **Create API Key**
3. **Update `.env`:**
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your-sendgrid-api-key
   EMAIL_FROM=JobPortal <noreply@yourdomain.com>
   ```

## 🧪 Testing Email Notifications

### Test 1: Welcome Email
1. Register a new user at http://localhost:3000/register
2. Check your email inbox (or Mailtrap)
3. You should receive a welcome email

### Test 2: Application Confirmation
1. Login as a job seeker
2. Apply for any job
3. Check email for application confirmation

### Test 3: Status Update Email
1. Login as an employer
2. Go to dashboard and view applications
3. Change application status (e.g., to "shortlisted")
4. The job seeker will receive a status update email

## 📝 Email Templates

All email templates are in `backend/utils/emailTemplates.js`:
- `welcomeEmail(userName)` - Welcome email
- `applicationConfirmationEmail(userName, jobTitle, companyName)` - Application confirmation
- `applicationStatusEmail(userName, jobTitle, status, companyName)` - Status update
- `newJobAlertEmail(userName, jobs)` - Job alerts (for future use)

## 🎨 Customizing Email Templates

Edit `backend/utils/emailTemplates.js` to customize:
- Email design (HTML/CSS)
- Email content
- Colors and branding
- Links and buttons

## 🚨 Troubleshooting

### Emails not sending?

1. **Check `.env` configuration**
   - Ensure all EMAIL_* variables are set
   - No extra spaces or quotes

2. **Check console logs**
   - Look for "✅ Email sent" or "❌ Email sending failed"
   - Error messages will show what went wrong

3. **Gmail issues?**
   - Make sure 2FA is enabled
   - Use App Password, not regular password
   - Check "Less secure app access" is OFF (use App Password instead)

4. **Test SMTP connection:**
   ```bash
   node -e "require('./utils/sendEmail.js').default({email:'test@test.com',subject:'Test',html:'<p>Test</p>'})"
   ```

### Common Errors

**"Invalid login"**
- Wrong email or password
- For Gmail, use App Password

**"Connection timeout"**
- Wrong host or port
- Firewall blocking SMTP

**"Email not received"**
- Check spam folder
- Verify email address is correct
- For Gmail, check "All Mail" folder

## 🔒 Security Best Practices

1. **Never commit `.env` file** to Git
2. **Use App Passwords** for Gmail (never regular password)
3. **Use environment variables** for all sensitive data
4. **For production**, use a professional email service (SendGrid, AWS SES)
5. **Implement rate limiting** to prevent email spam

## 📊 Email Analytics (Future Enhancement)

Consider adding:
- Email open tracking
- Click tracking
- Bounce handling
- Unsubscribe functionality

## 🎯 Next Steps

1. Set up email configuration in `.env`
2. Test all three email types
3. Customize email templates with your branding
4. Consider adding more email notifications:
   - Password reset emails
   - Interview invitation emails
   - Job expiry reminders
   - Weekly job digest

## 📚 Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Mailtrap](https://mailtrap.io)
- [SendGrid](https://sendgrid.com)

---

**Email notifications are now live!** 🎉

Configure your `.env` file and start testing!
