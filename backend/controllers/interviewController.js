import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole } = pkg;

// Agora credentials (you'll need to sign up at agora.io)
const AGORA_APP_ID = process.env.AGORA_APP_ID || 'your_agora_app_id';
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || 'your_agora_certificate';

// Generate Agora token for video call
const generateAgoraToken = (channelName, uid) => {
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600; // 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      AGORA_APP_ID,
      AGORA_APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );
    return token;
  } catch (error) {
    console.error('Error generating Agora token:', error);
    return null;
  }
};

// @desc    Schedule a new interview
// @route   POST /api/v1/interviews
// @access  Private (Employer only)
export const scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      scheduledDate,
      duration,
      type,
      notes,
      agenda,
    } = req.body;

    // Get application details
    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('applicant');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user is the employer
    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to schedule interview for this application',
      });
    }

    // Create interview
    const interview = await Interview.create({
      application: applicationId,
      job: application.job._id,
      candidate: application.applicant._id,
      interviewer: req.user.id,
      scheduledDate,
      duration: duration || 60,
      type: type || 'video',
      notes,
      agenda,
    });

    // Populate interview details
    await interview.populate([
      { path: 'candidate', select: 'name email' },
      { path: 'interviewer', select: 'name email' },
      { path: 'job', select: 'title company' },
    ]);

    // Send email notifications
    const interviewDate = new Date(scheduledDate).toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    });

    // Email to candidate
    await sendEmail({
      email: interview.candidate.email,
      subject: `Interview Scheduled - ${interview.job.title}`,
      message: `
        <h2>Interview Scheduled!</h2>
        <p>Dear ${interview.candidate.name},</p>
        <p>Your interview has been scheduled for the position of <strong>${interview.job.title}</strong>.</p>
        <h3>Interview Details:</h3>
        <ul>
          <li><strong>Date & Time:</strong> ${interviewDate}</li>
          <li><strong>Duration:</strong> ${interview.duration} minutes</li>
          <li><strong>Type:</strong> ${interview.type}</li>
          ${interview.agenda ? `<li><strong>Agenda:</strong> ${interview.agenda}</li>` : ''}
        </ul>
        <p>You will receive a meeting link before the interview.</p>
        <p>Good luck!</p>
      `,
    });

    res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error('Schedule interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling interview',
      error: error.message,
    });
  }
};

// @desc    Get all interviews (for logged-in user)
// @route   GET /api/v1/interviews
// @access  Private
export const getInterviews = async (req, res) => {
  try {
    const { status, type, upcoming } = req.query;

    let query = {};

    // Filter by user role
    if (req.user.role === 'jobseeker') {
      query.candidate = req.user.id;
    } else if (req.user.role === 'employer') {
      query.interviewer = req.user.id;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter upcoming interviews
    if (upcoming === 'true') {
      query.scheduledDate = { $gte: new Date() };
      query.status = { $in: ['scheduled', 'in-progress'] };
    }

    const interviews = await Interview.find(query)
      .populate('candidate', 'name email avatar')
      .populate('interviewer', 'name email avatar')
      .populate('job', 'title company location')
      .populate('application', 'status')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interviews',
      error: error.message,
    });
  }
};

// @desc    Get single interview
// @route   GET /api/v1/interviews/:id
// @access  Private
export const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidate', 'name email avatar phone')
      .populate('interviewer', 'name email avatar phone')
      .populate('job', 'title company location description')
      .populate('application', 'status resume coverLetter');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check authorization
    const isCandidate = interview.candidate._id.toString() === req.user.id;
    const isInterviewer = interview.interviewer._id.toString() === req.user.id;

    if (!isCandidate && !isInterviewer && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this interview',
      });
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interview',
      error: error.message,
    });
  }
};

// @desc    Generate video call token
// @route   GET /api/v1/interviews/:id/token
// @access  Private
export const getVideoToken = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check authorization
    const isCandidate = interview.candidate.toString() === req.user.id;
    const isInterviewer = interview.interviewer.toString() === req.user.id;

    if (!isCandidate && !isInterviewer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to join this interview',
      });
    }

    // Check if interview is scheduled for today or in progress
    const now = new Date();
    const interviewDate = new Date(interview.scheduledDate);
    const timeDiff = interviewDate - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff > 1 && interview.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Interview can only be joined 1 hour before scheduled time',
      });
    }

    // Generate Agora token
    const uid = Math.floor(Math.random() * 100000);
    const token = generateAgoraToken(interview.roomId, uid);

    if (!token) {
      return res.status(500).json({
        success: false,
        message: 'Error generating video token',
      });
    }

    // Update interview status
    if (interview.status === 'scheduled') {
      interview.status = 'in-progress';
      await interview.save();
    }

    // Track participant
    interview.participants.push({
      user: req.user.id,
      joinedAt: new Date(),
    });
    await interview.save();

    res.status(200).json({
      success: true,
      data: {
        token,
        appId: AGORA_APP_ID,
        channelName: interview.roomId,
        uid,
      },
    });
  } catch (error) {
    console.error('Get video token error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating video token',
      error: error.message,
    });
  }
};

// @desc    Submit interview feedback
// @route   POST /api/v1/interviews/:id/feedback
// @access  Private (Interviewer only)
export const submitFeedback = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check if user is the interviewer
    if (interview.interviewer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the interviewer can submit feedback',
      });
    }

    const {
      rating,
      technicalSkills,
      communication,
      problemSolving,
      cultureFit,
      comments,
      recommendation,
    } = req.body;

    interview.feedback = {
      rating,
      technicalSkills,
      communication,
      problemSolving,
      cultureFit,
      comments,
      recommendation,
      submittedBy: req.user.id,
      submittedAt: new Date(),
    };

    interview.status = 'completed';
    await interview.save();

    // Update application status based on recommendation
    const application = await Application.findById(interview.application);
    if (recommendation === 'strongly-recommend' || recommendation === 'recommend') {
      application.status = 'shortlisted';
    } else if (recommendation === 'strongly-not-recommend' || recommendation === 'not-recommend') {
      application.status = 'rejected';
    }
    await application.save();

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message,
    });
  }
};

// @desc    Reschedule interview
// @route   PUT /api/v1/interviews/:id/reschedule
// @access  Private
export const rescheduleInterview = async (req, res) => {
  try {
    const { newDate, reason } = req.body;

    const interview = await Interview.findById(req.params.id)
      .populate('candidate', 'name email')
      .populate('interviewer', 'name email')
      .populate('job', 'title');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check authorization
    const isCandidate = interview.candidate._id.toString() === req.user.id;
    const isInterviewer = interview.interviewer._id.toString() === req.user.id;

    if (!isCandidate && !isInterviewer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reschedule this interview',
      });
    }

    // Add to reschedule history
    interview.rescheduleHistory.push({
      oldDate: interview.scheduledDate,
      newDate,
      reason,
      rescheduledBy: req.user.id,
    });

    interview.scheduledDate = newDate;
    interview.status = 'rescheduled';
    await interview.save();

    // Send notifications
    const newDateFormatted = new Date(newDate).toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    });

    const emailRecipient = isCandidate ? interview.interviewer.email : interview.candidate.email;
    const emailName = isCandidate ? interview.interviewer.name : interview.candidate.name;

    await sendEmail({
      email: emailRecipient,
      subject: `Interview Rescheduled - ${interview.job.title}`,
      message: `
        <h2>Interview Rescheduled</h2>
        <p>Dear ${emailName},</p>
        <p>The interview for <strong>${interview.job.title}</strong> has been rescheduled.</p>
        <p><strong>New Date & Time:</strong> ${newDateFormatted}</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>Please confirm your availability.</p>
      `,
    });

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error('Reschedule interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rescheduling interview',
      error: error.message,
    });
  }
};

// @desc    Cancel interview
// @route   DELETE /api/v1/interviews/:id
// @access  Private
export const cancelInterview = async (req, res) => {
  try {
    const { reason } = req.body;

    const interview = await Interview.findById(req.params.id)
      .populate('candidate', 'name email')
      .populate('interviewer', 'name email')
      .populate('job', 'title');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check authorization
    const isInterviewer = interview.interviewer._id.toString() === req.user.id;

    if (!isInterviewer && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this interview',
      });
    }

    interview.status = 'cancelled';
    interview.notes = `${interview.notes || ''}\nCancelled: ${reason || 'No reason provided'}`;
    await interview.save();

    // Send notification to candidate
    await sendEmail({
      email: interview.candidate.email,
      subject: `Interview Cancelled - ${interview.job.title}`,
      message: `
        <h2>Interview Cancelled</h2>
        <p>Dear ${interview.candidate.name},</p>
        <p>Unfortunately, the interview for <strong>${interview.job.title}</strong> has been cancelled.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>We apologize for any inconvenience.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: 'Interview cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling interview',
      error: error.message,
    });
  }
};
