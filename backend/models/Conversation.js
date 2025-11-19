import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    application: {
      type: mongoose.Schema.ObjectId,
      ref: 'Application',
    },
    lastMessage: {
      type: mongoose.Schema.ObjectId,
      ref: 'Message',
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// Index for faster queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ application: 1 });

export default mongoose.model('Conversation', conversationSchema);
