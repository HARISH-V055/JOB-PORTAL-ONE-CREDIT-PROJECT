import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter job title'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please enter job description'],
    },
    salary: {
      type: Number,
      required: [true, 'Please enter expected salary for this job'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    jobType: {
      type: String,
      required: [true, 'Please select job type'],
      enum: {
        values: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Freelance'],
        message: 'Please select correct job type',
      },
    },
    category: {
      type: String,
      required: [true, 'Please select job category'],
      enum: {
        values: [
          'Information Technology',
          'Healthcare',
          'Finance',
          'Education',
          'Marketing',
          'Sales',
          'Design',
          'Engineering',
          'Other',
        ],
        message: 'Please select correct job category',
      },
    },
    deadline: {
      type: Date,
      required: [true, 'Please add a deadline for this job'],
    },
    experience: {
      type: String,
      required: [true, 'Please add experience level'],
      enum: {
        values: ['No Experience', '1 Year', '2 Years', '3 Years+', '5 Years+', '10 Years+'],
        message: 'Please select correct experience level',
      },
    },
    skills: {
      type: [String],
      required: [true, 'Please add skills required'],
    },
    employer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'filled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Set status to 'inactive' if deadline has passed
jobSchema.pre('save', function (next) {
  if (this.deadline < Date.now()) {
    this.status = 'inactive';
  }
  next();
});

export default mongoose.model('Job', jobSchema);
