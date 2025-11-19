import express from 'express';
import {
  scheduleInterview,
  getInterviews,
  getInterview,
  getVideoToken,
  submitFeedback,
  rescheduleInterview,
  cancelInterview,
} from '../controllers/interviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Schedule interview (employer only)
router.post('/', authorize('employer', 'admin'), scheduleInterview);

// Get all interviews for logged-in user
router.get('/', getInterviews);

// Get single interview
router.get('/:id', getInterview);

// Get video call token
router.get('/:id/token', getVideoToken);

// Submit feedback (interviewer only)
router.post('/:id/feedback', submitFeedback);

// Reschedule interview
router.put('/:id/reschedule', rescheduleInterview);

// Cancel interview
router.delete('/:id', cancelInterview);

export default router;
