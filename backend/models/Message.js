import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
    },
    messageType: {
      type: String,
      enum: ['text', 'file', 'interview'],
      default: 'text',
    },
    fileUrl: {
      type: String,
    },
    fileName: {
      type: String,
    },
    interviewDetails: {
      date: Date,
      time: String,
      location: String,
      meetingLink: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for faster queries
messageSchema.index({ conversation: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
