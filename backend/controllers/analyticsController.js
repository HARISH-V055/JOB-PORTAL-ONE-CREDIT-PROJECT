import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

// @desc    Get job seeker analytics
// @route   GET /api/v1/analytics/jobseeker
// @access  Private (Job Seeker)
export const getJobSeekerAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Total applications
    const totalApplications = await Application.countDocuments({ applicant: userId });

    // Applications by status
    const applicationsByStatus = await Application.aggregate([
      { $match: { applicant: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Applications over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const applicationsOverTime = await Application.aggregate([
      {
        $match: {
          applicant: userId,
          appliedAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$appliedAt' },
            month: { $month: '$appliedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Recent applications
    const recentApplications = await Application.find({ applicant: userId })
      .populate('job', 'title company location')
      .sort('-appliedAt')
      .limit(5);

    // Success rate
    const selectedCount = await Application.countDocuments({
      applicant: userId,
      status: 'selected',
    });
    const successRate = totalApplications > 0 ? (selectedCount / totalApplications) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        applicationsByStatus,
        applicationsOverTime,
        recentApplications,
        successRate: successRate.toFixed(1),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get employer analytics
// @route   GET /api/v1/analytics/employer
// @access  Private (Employer)
export const getEmployerAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Total jobs posted
    const totalJobs = await Job.countDocuments({ employer: userId });

    // Active jobs
    const activeJobs = await Job.countDocuments({ employer: userId, status: 'active' });

    // Total applications received
    const jobs = await Job.find({ employer: userId }).select('_id');
    const jobIds = jobs.map((job) => job._id);

    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    // Applications by status
    const applicationsByStatus = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Applications over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const applicationsOverTime = await Application.aggregate([
      {
        $match: {
          job: { $in: jobIds },
          appliedAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$appliedAt' },
            month: { $month: '$appliedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Top performing jobs (most applications)
    const topJobs = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$job', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: '_id',
          as: 'jobDetails',
        },
      },
      { $unwind: '$jobDetails' },
      {
        $project: {
          title: '$jobDetails.title',
          location: '$jobDetails.location',
          applications: '$count',
        },
      },
    ]);

    // Jobs by category
    const jobsByCategory = await Job.aggregate([
      { $match: { employer: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        totalApplications,
        applicationsByStatus,
        applicationsOverTime,
        topJobs,
        jobsByCategory,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get admin analytics
// @route   GET /api/v1/analytics/admin
// @access  Private (Admin)
export const getAdminAnalytics = async (req, res, next) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();
    const jobSeekers = await User.countDocuments({ role: 'jobseeker' });
    const employers = await User.countDocuments({ role: 'employer' });
    const admins = await User.countDocuments({ role: 'admin' });

    // Total jobs
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });

    // Total applications
    const totalApplications = await Application.countDocuments();

    // Users over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const usersOverTime = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Jobs over time
    const jobsOverTime = await Job.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Applications over time
    const applicationsOverTime = await Application.aggregate([
      { $match: { appliedAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$appliedAt' },
            month: { $month: '$appliedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Jobs by category
    const jobsByCategory = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Jobs by type
    const jobsByType = await Job.aggregate([
      { $group: { _id: '$jobType', count: { $sum: 1 } } },
    ]);

    // Applications by status
    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Recent activities
    const recentUsers = await User.find().sort('-createdAt').limit(5).select('name email role createdAt');
    const recentJobs = await Job.find().sort('-createdAt').limit(5).populate('employer', 'name').select('title location createdAt');
    const recentApplications = await Application.find()
      .sort('-appliedAt')
      .limit(5)
      .populate('applicant', 'name')
      .populate('job', 'title');

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          jobSeekers,
          employers,
          admins,
          totalJobs,
          activeJobs,
          totalApplications,
        },
        usersOverTime,
        jobsOverTime,
        applicationsOverTime,
        jobsByCategory,
        jobsByType,
        applicationsByStatus,
        recentActivities: {
          users: recentUsers,
          jobs: recentJobs,
          applications: recentApplications,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
