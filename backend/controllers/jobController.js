import Job from '../models/Job.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    let query = {};

    // Search by title or description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filter by location
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }

    // Filter by job type
    if (req.query.jobType) {
      query.jobType = req.query.jobType;
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by experience
    if (req.query.experience) {
      query.experience = req.query.experience;
    }

    const jobs = await Job.find(query)
      .populate('employer', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
// @access  Public
export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email');

    if (!job) {
      return next(new ErrorResponse('Job not found', 404));
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new job
// @route   POST /api/v1/jobs
// @access  Private (Employer only)
export const createJob = async (req, res, next) => {
  try {
    // Add employer to req.body
    req.body.employer = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update job
// @route   PUT /api/v1/jobs/:id
// @access  Private (Employer only)
export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return next(new ErrorResponse('Job not found', 404));
    }

    // Make sure user is job owner
    if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this job', 401));
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private (Employer only)
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new ErrorResponse('Job not found', 404));
    }

    // Make sure user is job owner
    if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this job', 401));
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get jobs posted by logged in employer
// @route   GET /api/v1/jobs/my-jobs
// @access  Private (Employer only)
export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};
