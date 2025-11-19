import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  interviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    default: 60,
  },
  type: {
    type: String,
    enum: ['phone', 'video', 'in-person', 'technical', 'hr', 'final'],
    default: 'video',
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'rescheduled', 'no-show'],
    default: 'scheduled',
  },
  meetingLink: {
    type: String,
  },
  roomId: {
    type: String,
    unique: true,
    sparse: true,
  },
  agoraToken: {
    type: String,
  },
  notes: {
    type: String,
  },
  agenda: {
    type: String,
  },
  // Recording details
  recording: {
    enabled: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
    },
    duration: {
      type: Number, // in seconds
    },
  },
  // Feedback
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    technicalSkills: {
      type: Number,
      min: 1,
      max: 5,
    },
    communication: {
      type: Number,
      min: 1,
      max: 5,
    },
    problemSolving: {
      type: Number,
      min: 1,
      max: 5,
    },
    cultureFit: {
      type: Number,
      min: 1,
      max: 5,
    },
    comments: {
      type: String,
    },
    recommendation: {
      type: String,
      enum: ['strongly-recommend', 'recommend', 'neutral', 'not-recommend', 'strongly-not-recommend'],
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    submittedAt: {
      type: Date,
    },
  },
  // Reminders
  reminders: {
    candidate: {
      sent: {
        type: Boolean,
        default: false,
      },
      sentAt: {
        type: Date,
      },
    },
    interviewer: {
      sent: {
        type: Boolean,
        default: false,
      },
      sentAt: {
        type: Date,
      },
    },
  },
  // Participants who joined
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    joinedAt: {
      type: Date,
    },
    leftAt: {
      type: Date,
    },
  }],
  // Rescheduling history
  rescheduleHistory: [{
    oldDate: {
      type: Date,
    },
    newDate: {
      type: Date,
    },
    reason: {
      type: String,
    },
    rescheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rescheduledAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Index for efficient queries
interviewSchema.index({ candidate: 1, scheduledDate: 1 });
interviewSchema.index({ interviewer: 1, scheduledDate: 1 });
interviewSchema.index({ roomId: 1 });
interviewSchema.index({ status: 1, scheduledDate: 1 });

// Generate unique room ID
interviewSchema.pre('save', function(next) {
  if (!this.roomId && this.type === 'video') {
    this.roomId = `interview_${this._id}_${Date.now()}`;
  }
  next();
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
