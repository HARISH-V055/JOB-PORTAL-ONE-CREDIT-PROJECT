import express from 'express';
import {
  createApplication,
  getApplications,
  getAllApplications,
  getMyApplications,
  getJobApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';
const router = express.Router();

router.route('/all').get(protect, authorize('admin'), getAllApplications);

router
  .route('/')
  .post(protect, authorize('jobseeker'), createApplication)
  .get(protect, getApplications);

router.route('/my-applications').get(protect, authorize('jobseeker'), getMyApplications);

router.route('/job/:jobId').get(protect, authorize('employer', 'admin'), getJobApplications);

router
  .route('/:id')
  .get(protect, getApplication)
  .put(protect, authorize('employer', 'admin'), updateApplicationStatus)
  .delete(protect, deleteApplication);

export default router;
