import express from 'express';
import { handleChatbotMessage } from '../controllers/chatbotController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Handle chatbot message
// @route   POST /api/v1/chatbot/message
// @access  Public (but better experience when logged in)
router.post('/message', handleChatbotMessage);

export default router;
