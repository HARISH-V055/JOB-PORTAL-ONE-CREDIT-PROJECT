import express from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getJobs).post(protect, authorize('employer', 'admin'), createJob);

router.route('/my-jobs').get(protect, authorize('employer', 'admin'), getMyJobs);

router
  .route('/:id')
  .get(getJob)
  .put(protect, authorize('employer', 'admin'), updateJob)
  .delete(protect, authorize('employer', 'admin'), deleteJob);

export default router;
