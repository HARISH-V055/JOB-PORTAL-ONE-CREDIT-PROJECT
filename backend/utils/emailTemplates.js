// Welcome Email Template
export const welcomeEmail = (userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to JobPortal! 🎉</h1>
        </div>
        <div class="content">
          <h2>Hi ${userName}!</h2>
          <p>Thank you for joining JobPortal. We're excited to have you on board!</p>
          <p>With JobPortal, you can:</p>
          <ul>
            <li>Browse thousands of job opportunities</li>
            <li>Apply for jobs with one click</li>
            <li>Track your application status</li>
            <li>Get personalized job recommendations</li>
          </ul>
          <a href="http://localhost:3000/jobs" class="button">Browse Jobs Now</a>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The JobPortal Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Application Confirmation Email
export const applicationConfirmationEmail = (userName, jobTitle, companyName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #15803d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .job-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e; }
        .button { display: inline-block; padding: 12px 30px; background: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Submitted! ✅</h1>
        </div>
        <div class="content">
          <h2>Hi ${userName}!</h2>
          <p>Your application has been successfully submitted.</p>
          <div class="job-details">
            <h3>📋 Application Details</h3>
            <p><strong>Position:</strong> ${jobTitle}</p>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Status:</strong> Pending Review</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>The employer will review your application and update you on the next steps.</p>
          <a href="http://localhost:3000/dashboard" class="button">View Dashboard</a>
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>The employer will review your application</li>
            <li>You'll receive email updates on status changes</li>
            <li>Track your application in your dashboard</li>
          </ul>
          <p>Good luck! 🍀</p>
          <p>Best regards,<br>The JobPortal Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Application Status Update Email
export const applicationStatusEmail = (userName, jobTitle, status, companyName) => {
  const statusColors = {
    reviewing: '#3b82f6',
    shortlisted: '#8b5cf6',
    interviewing: '#f59e0b',
    selected: '#22c55e',
    rejected: '#ef4444',
  };

  const statusMessages = {
    reviewing: 'Your application is now being reviewed by the employer.',
    shortlisted: 'Congratulations! You have been shortlisted for this position.',
    interviewing: 'Great news! The employer wants to interview you.',
    selected: '🎉 Congratulations! You have been selected for this position!',
    rejected: 'Unfortunately, your application was not successful this time.',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${statusColors[status] || '#0ea5e9'}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .status-badge { display: inline-block; padding: 8px 16px; background: ${statusColors[status] || '#0ea5e9'}; color: white; border-radius: 20px; font-weight: bold; text-transform: uppercase; font-size: 12px; }
        .job-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: ${statusColors[status] || '#0ea5e9'}; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Status Update</h1>
        </div>
        <div class="content">
          <h2>Hi ${userName}!</h2>
          <p>There's an update on your job application.</p>
          <div class="job-details">
            <h3>📋 Application Details</h3>
            <p><strong>Position:</strong> ${jobTitle}</p>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>New Status:</strong> <span class="status-badge">${status}</span></p>
            <p><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p><strong>${statusMessages[status] || 'Your application status has been updated.'}</strong></p>
          ${status === 'selected' ? '<p>The employer will contact you soon with further details. Congratulations on your new opportunity!</p>' : ''}
          ${status === 'interviewing' ? '<p>Please check your email for interview details or contact the employer directly.</p>' : ''}
          ${status === 'rejected' ? '<p>Don\'t be discouraged! Keep applying and you\'ll find the right opportunity.</p>' : ''}
          <a href="http://localhost:3000/dashboard" class="button">View Dashboard</a>
          <p>Best regards,<br>The JobPortal Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// New Job Alert Email
export const newJobAlertEmail = (userName, jobs) => {
  const jobListHTML = jobs.map(job => `
    <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #0ea5e9;">
      <h4 style="margin: 0 0 10px 0;">${job.title}</h4>
      <p style="margin: 5px 0; color: #666;">📍 ${job.location} | 💰 $${job.salary.toLocaleString()}</p>
      <p style="margin: 5px 0; color: #666;">🏢 ${job.company}</p>
      <a href="http://localhost:3000/jobs/${job._id}" style="color: #0ea5e9; text-decoration: none;">View Details →</a>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Jobs Matching Your Profile! 🎯</h1>
        </div>
        <div class="content">
          <h2>Hi ${userName}!</h2>
          <p>We found ${jobs.length} new job${jobs.length > 1 ? 's' : ''} that match your profile:</p>
          ${jobListHTML}
          <a href="http://localhost:3000/jobs" class="button">View All Jobs</a>
          <p>Best regards,<br>The JobPortal Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} JobPortal. All rights reserved.</p>
          <p><a href="http://localhost:3000/profile" style="color: #666;">Manage email preferences</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};
