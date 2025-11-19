import express from 'express';
import {
  getJobSeekerAnalytics,
  getEmployerAnalytics,
  getAdminAnalytics,
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/jobseeker', protect, authorize('jobseeker'), getJobSeekerAnalytics);
router.get('/employer', protect, authorize('employer'), getEmployerAnalytics);
router.get('/admin', protect, authorize('admin'), getAdminAnalytics);

export default router;
