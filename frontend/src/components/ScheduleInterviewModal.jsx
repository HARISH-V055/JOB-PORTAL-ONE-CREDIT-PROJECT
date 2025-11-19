import React, { useState } from 'react';
import api from '../utils/api';

const ScheduleInterviewModal = ({
  applicationId,
  jobTitle,
  candidateName,
  onClose,
  onScheduled,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    scheduledDate: '',
    duration: 60,
    type: 'video',
    agenda: '',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/interviews', {
        applicationId,
        ...formData,
      });

      alert('Interview scheduled successfully! Candidate will receive an email notification.');
      onScheduled();
      onClose();
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert(error.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 16);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                🎥 Schedule Interview
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {jobTitle} - {candidateName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📅 Date & Time *
            </label>
            <input
              type="datetime-local"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              min={getMinDate()}
              required
              className="input-field"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select when the interview should take place
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ⏱️ Duration (minutes) *
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes (1 hour)</option>
              <option value={90}>90 minutes (1.5 hours)</option>
              <option value={120}>120 minutes (2 hours)</option>
            </select>
          </div>

          {/* Interview Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📋 Interview Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="video">🎥 Video Interview</option>
              <option value="phone">📞 Phone Interview</option>
              <option value="technical">💻 Technical Interview</option>
              <option value="hr">👥 HR Interview</option>
              <option value="final">🎯 Final Round</option>
              <option value="in-person">🏢 In-Person</option>
            </select>
          </div>

          {/* Agenda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📝 Agenda
            </label>
            <textarea
              name="agenda"
              value={formData.agenda}
              onChange={handleChange}
              rows={3}
              placeholder="What will be discussed in this interview?"
              className="input-field"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              e.g., "Technical skills assessment, React coding challenge, Q&A"
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📌 Notes (Internal)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Any internal notes or preparation needed?"
              className="input-field"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              These notes are only visible to you
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">What happens next:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Candidate receives email notification</li>
                  <li>Interview appears in both calendars</li>
                  <li>Video link available 1 hour before</li>
                  <li>Both parties can join from Interviews page</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading}
            >
              {loading ? 'Scheduling...' : '🎥 Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
