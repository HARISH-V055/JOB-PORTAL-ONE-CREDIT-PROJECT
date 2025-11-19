import express from 'express';
import { upload, cloudinary } from '../config/cloudinary.js';
import { protect } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for profile pictures
const profileUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
    }
  },
});

// @desc    Upload resume file
// @route   POST /api/v1/upload/resume
// @access  Private
router.post('/resume', protect, upload.single('resume'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        public_id: req.file.filename,
        url: req.file.path,
        filename: req.file.originalname,
        format: req.file.format,
        size: req.file.size,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message,
    });
  }
});

// @desc    Delete resume file
// @route   DELETE /api/v1/upload/resume/:publicId
// @access  Private
router.delete('/resume/:publicId', protect, async (req, res) => {
  try {
    const { cloudinary } = await import('../config/cloudinary.js');
    
    await cloudinary.uploader.destroy(req.params.publicId, {
      resource_type: 'raw',
    });

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message,
    });
  }
});

// @desc    Upload profile picture
// @route   POST /api/v1/upload/profile-picture
// @access  Private
router.post('/profile-picture', protect, profileUpload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'job-portal/profile-pictures',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Update user avatar
    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(req.user.id, {
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading profile picture',
      error: error.message,
    });
  }
});

// @desc    Delete profile picture
// @route   DELETE /api/v1/upload/profile-picture
// @access  Private
router.delete('/profile-picture', protect, async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.user.id);

    if (user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // Reset to default avatar
    await User.findByIdAndUpdate(req.user.id, {
      avatar: {
        public_id: '',
        url: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting profile picture',
      error: error.message,
    });
  }
});

export default router;
