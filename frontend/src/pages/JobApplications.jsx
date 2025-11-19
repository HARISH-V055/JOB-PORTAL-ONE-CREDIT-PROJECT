import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const JobApplications = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [id]);

  const fetchApplications = async () => {
    try {
      const response = await api.get(`/applications/job/${id}`);
      setApplications(response.data.data || []);
      
      // Get job title
      if (response.data.data && response.data.data.length > 0) {
        const jobResponse = await api.get(`/jobs/${id}`);
        setJobTitle(jobResponse.data.data.title);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };


  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 mb-4 inline-flex items-center">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          Applications for {jobTitle}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {applications.length} {applications.length === 1 ? 'application' : 'applications'} received
        </p>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No applications yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Applications will appear here once candidates apply
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Candidate Info */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-4">
                      <span className="text-primary-600 dark:text-primary-400 text-xl font-bold">
                        {application.applicant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {application.applicant.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {application.applicant.email}
                      </p>
                      {application.applicant.phone && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          📞 {application.applicant.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Applied On</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {new Date(application.appliedAt).toLocaleDateString('en-IN', {
                          dateStyle: 'medium',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  {application.coverLetter && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cover Letter:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="ml-4 flex flex-col gap-2">
                  {application.resumeFile ? (
                    <a
                      href={application.resumeFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-sm px-4 py-2 text-center whitespace-nowrap"
                    >
                      📄 View Resume
                    </a>
                  ) : application.resume ? (
                    <a
                      href={typeof application.resume === 'string' ? application.resume : application.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-sm px-4 py-2 text-center whitespace-nowrap"
                    >
                      📄 View Resume
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;
