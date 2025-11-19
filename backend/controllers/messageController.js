import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import Application from '../models/Application.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get or create conversation
// @route   POST /api/v1/messages/conversation
// @access  Private
export const getOrCreateConversation = async (req, res, next) => {
  try {
    const { applicationId } = req.body;

    // Get application
    const application = await Application.findById(applicationId)
      .populate('job', 'employer')
      .populate('applicant', '_id');

    if (!application) {
      return next(new ErrorResponse('Application not found', 404));
    }

    // Check if user is part of this application
    const isApplicant = application.applicant._id.toString() === req.user.id;
    const isEmployer = application.job.employer.toString() === req.user.id;

    if (!isApplicant && !isEmployer) {
      return next(new ErrorResponse('Not authorized to access this conversation', 403));
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({
      application: applicationId,
    })
      .populate('participants', 'name email avatar')
      .populate('lastMessage');

    // Create new conversation if doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [application.applicant._id, application.job.employer],
        application: applicationId,
        unreadCount: {},
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email avatar')
        .populate('lastMessage');
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's conversations
// @route   GET /api/v1/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate('participants', 'name email avatar')
      .populate('lastMessage')
      .populate({
        path: 'application',
        populate: {
          path: 'job',
          select: 'title',
        },
      })
      .sort('-updatedAt');

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/v1/messages/conversation/:conversationId
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return next(new ErrorResponse('Conversation not found', 404));
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id
    );

    if (!isParticipant) {
      return next(new ErrorResponse('Not authorized to access this conversation', 403));
    }

    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name email avatar')
      .sort('createdAt');

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        sender: { $ne: req.user.id },
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    // Reset unread count for this user
    conversation.unreadCount.set(req.user.id, 0);
    await conversation.save();

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Send a message
// @route   POST /api/v1/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content, messageType, fileUrl, fileName, interviewDetails } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return next(new ErrorResponse('Conversation not found', 404));
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id
    );

    if (!isParticipant) {
      return next(new ErrorResponse('Not authorized to send messages in this conversation', 403));
    }

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      content,
      messageType: messageType || 'text',
      fileUrl,
      fileName,
      interviewDetails,
    });

    // Update conversation
    conversation.lastMessage = message._id;
    
    // Increment unread count for other participants
    conversation.participants.forEach((participantId) => {
      if (participantId.toString() !== req.user.id) {
        const currentCount = conversation.unreadCount.get(participantId.toString()) || 0;
        conversation.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    await conversation.save();

    // Populate sender info
    await message.populate('sender', 'name email avatar');

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a message
// @route   DELETE /api/v1/messages/:id
// @access  Private
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return next(new ErrorResponse('Message not found', 404));
    }

    // Check if user is sender
    if (message.sender.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this message', 403));
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted',
    });
  } catch (err) {
    next(err);
  }
};
