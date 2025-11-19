import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, authorize('admin'), getUsers);

router.route('/update-password').put(protect, updatePassword);

router
  .route('/:id')
  .get(protect, authorize('admin'), getUser)
  .put(protect, updateUser)
  .delete(protect, authorize('admin'), deleteUser);

export default router;
