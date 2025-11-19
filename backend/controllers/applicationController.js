import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Conversation from '../models/Conversation.js';
import ErrorResponse from '../utils/errorResponse.js';
import sendEmail from '../utils/sendEmail.js';
import { applicationConfirmationEmail, applicationStatusEmail } from '../utils/emailTemplates.js';

// @desc    Submit job application
// @route   POST /api/v1/applications
// @access  Private (Job Seeker only)
export const createApplication = async (req, res, next) => {
  try {
    const { job, resume, coverLetter, resumeFile } = req.body;

    // Check if job exists
    const jobExists = await Job.findById(job);
    if (!jobExists) {
      return next(new ErrorResponse('Job not found', 404));
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return next(new ErrorResponse('You have already applied for this job', 400));
    }

    // Create application
    const applicationData = {
      job,
      applicant: req.user.id,
      resume: resume || resumeFile?.url || '',
      coverLetter,
    };

    // Add resume file data if uploaded
    if (resumeFile) {
      applicationData.resumeFile = {
        public_id: resumeFile.public_id,
        url: resumeFile.url,
        filename: resumeFile.filename,
        format: resumeFile.format,
        uploadedAt: new Date(),
      };
    }

    const application = await Application.create(applicationData);

    // Populate job and employer details for email
    await application.populate('job');
    await application.populate({
      path: 'job',
      populate: { path: 'employer', select: 'name' }
    });

    // Send confirmation email
    sendEmail({
      email: req.user.email,
      subject: 'Application Submitted Successfully! ✅',
      html: applicationConfirmationEmail(
        req.user.name,
        application.job.title,
        application.job.employer.name
      ),
    }).catch(err => console.error('Application email failed:', err.message));

    // Create conversation for messaging
    try {
      await Conversation.create({
        participants: [req.user.id, application.job.employer],
        application: application._id,
        unreadCount: {},
      });
    } catch (convErr) {
      console.error('Failed to create conversation:', convErr.message);
      // Don't fail the application if conversation creation fails
    }

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all applications (for admin)
// @route   GET /api/v1/applications/all
// @access  Private (Admin only)
export const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('applicant', 'name email avatar')
      .populate('job', 'title location')
      .sort('-appliedAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all applications (for employer)
// @route   GET /api/v1/applications
// @access  Private (Employer only)
export const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title')
      .populate('applicant', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get applications for a specific job (Employer only)
// @route   GET /api/v1/applications/job/:jobId
// @access  Private (Employer/Admin only)
export const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return next(new ErrorResponse('Job not found', 404));
    }

    // Make sure user is job owner or admin
    if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to view these applications', 401));
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in user's applications
// @route   GET /api/v1/applications/my-applications
// @access  Private (Job Seeker only)
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: 'job',
        select: 'title location salary jobType employer',
        populate: {
          path: 'employer',
          select: 'name',
        },
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single application
// @route   GET /api/v1/applications/:id
// @access  Private
export const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title location salary jobType employer')
      .populate('applicant', 'name email avatar');

    if (!application) {
      return next(new ErrorResponse('Application not found', 404));
    }

    // Make sure user is application owner, job owner, or admin
    const job = await Job.findById(application.job._id);
    if (
      application.applicant._id.toString() !== req.user.id &&
      job.employer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(new ErrorResponse('Not authorized to view this application', 401));
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application status
// @route   PUT /api/v1/applications/:id
// @access  Private (Employer/Admin only)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    let application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return next(new ErrorResponse('Application not found', 404));
    }

    const job = await Job.findById(application.job._id);

    // Make sure user is job owner or admin
    if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this application', 401));
    }

    application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      {
        new: true,
        runValidators: true,
      }
    );

    // Populate for email
    await application.populate('applicant', 'name email');
    await application.populate({
      path: 'job',
      select: 'title',
      populate: { path: 'employer', select: 'name' }
    });

    // Send status update email
    sendEmail({
      email: application.applicant.email,
      subject: `Application Status Update: ${application.job.title}`,
      html: applicationStatusEmail(
        application.applicant.name,
        application.job.title,
        req.body.status,
        application.job.employer.name
      ),
    }).catch(err => console.error('Status update email failed:', err.message));

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete application
// @route   DELETE /api/v1/applications/:id
// @access  Private
export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return next(new ErrorResponse('Application not found', 404));
    }

    // Make sure user is application owner or admin
    if (application.applicant.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this application', 401));
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
