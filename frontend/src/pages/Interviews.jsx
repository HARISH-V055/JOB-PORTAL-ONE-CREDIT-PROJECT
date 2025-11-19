import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const Interviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInterviews();
  }, [filter]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter === 'upcoming') {
        params.upcoming = 'true';
      } else if (filter === 'completed') {
        params.status = 'completed';
      }

      const response = await api.get('/interviews', { params });
      setInterviews(response.data.data || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      rescheduled: 'bg-yellow-100 text-yellow-800',
      'no-show': 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const canJoinInterview = (interview) => {
    // TEST MODE: Allow joining anytime for testing
    // Remove this in production
    const TEST_MODE = true;
    
    if (TEST_MODE) {
      return interview.status === 'scheduled' || interview.status === 'in-progress';
    }
    
    // Production mode: Only allow joining 1 hour before
    const now = new Date();
    const interviewDate = new Date(interview.scheduledDate);
    const timeDiff = interviewDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    return (
      (interview.status === 'scheduled' || interview.status === 'in-progress') &&
      hoursDiff <= 1 &&
      hoursDiff >= -2
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🎥 My Interviews
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {user?.role === 'employer' 
            ? 'Manage and conduct interviews with candidates'
            : 'View your scheduled interviews and join video calls'}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
          }`}
        >
          All Interviews
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'upcoming'
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'completed'
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Interviews List */}
      {interviews.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No interviews</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filter === 'upcoming' ? 'No upcoming interviews scheduled' : 'No interviews found'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {interviews.map((interview) => (
            <div
              key={interview._id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Job Title */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {interview.job.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {interview.job.company}
                  </p>

                  {/* Interview Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        📅 Date & Time
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {new Date(interview.scheduledDate).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ⏱️ Duration
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {interview.duration} minutes
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.role === 'employer' ? '👤 Candidate' : '👤 Interviewer'}
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {user?.role === 'employer'
                          ? interview.candidate.name
                          : interview.interviewer.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        📋 Type
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium capitalize">
                        {interview.type}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      interview.status
                    )}`}
                  >
                    {interview.status.replace('-', ' ').toUpperCase()}
                  </span>

                  {/* Feedback (if completed) */}
                  {interview.feedback && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Interview Feedback
                      </p>
                      <div className="flex items-center gap-4 mb-2">
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Rating:</span>
                          <span className="ml-2 text-yellow-500">
                            {'⭐'.repeat(interview.feedback.rating)}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Recommendation:
                          </span>
                          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {interview.feedback.recommendation?.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                      {interview.feedback.comments && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {interview.feedback.comments}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="ml-4 flex flex-col gap-2">
                  {canJoinInterview(interview) && (
                    <Link
                      to={`/interview-room/${interview._id}`}
                      onClick={() => console.log('Join Interview clicked! Navigating to:', `/interview-room/${interview._id}`)}
                      className="btn-primary text-sm px-4 py-2 text-center whitespace-nowrap"
                    >
                      🎥 Join Interview
                    </Link>
                  )}
                  
                  <Link
                    to={`/interviews/${interview._id}`}
                    className="btn-outline text-sm px-4 py-2 text-center whitespace-nowrap"
                  >
                    View Details
                  </Link>

                  {user?.role === 'employer' && interview.status === 'completed' && !interview.feedback && (
                    <Link
                      to={`/interviews/${interview._id}/feedback`}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg text-center whitespace-nowrap"
                    >
                      Submit Feedback
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Interviews;
