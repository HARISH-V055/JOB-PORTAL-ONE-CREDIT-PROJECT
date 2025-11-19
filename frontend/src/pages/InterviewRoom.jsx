import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import AgoraRTC from 'agora-rtc-sdk-ng';

const InterviewRoom = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState(new Map());
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  const clientRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    fetchInterview();
    return () => {
      leaveCall();
    };
  }, [id]);

  const fetchInterview = async () => {
    try {
      const response = await api.get(`/interviews/${id}`);
      setInterview(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interview:', error);
      alert('Failed to load interview details');
      navigate('/interviews');
    }
  };

  const joinCall = async () => {
    try {
      console.log('Attempting to join call for interview:', id);
      
      // Get video token from backend
      const tokenResponse = await api.get(`/interviews/${id}/token`);
      console.log('Token response:', tokenResponse.data);
      
      const { token, appId, channelName, uid } = tokenResponse.data.data;

      // Create Agora client
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      // Set up event listeners
      client.on('user-published', handleUserPublished);
      client.on('user-unpublished', handleUserUnpublished);
      client.on('user-left', handleUserLeft);

      // Join channel
      await client.join(appId, channelName, token, uid);

      // Create and publish local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      // Play local video
      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      // Publish tracks
      await client.publish([audioTrack, videoTrack]);

      setJoined(true);
    } catch (error) {
      console.error('Error joining call:', error);
      console.error('Error details:', error.response?.data);
      
      let errorMessage = 'Failed to join video call. ';
      if (error.response?.status === 403) {
        errorMessage += 'You can only join 1 hour before the scheduled time.';
      } else if (error.response?.status === 404) {
        errorMessage += 'Interview not found.';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else {
        errorMessage += 'Please check if backend is running and Agora credentials are configured.';
      }
      
      alert(errorMessage);
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    await clientRef.current?.subscribe(user, mediaType);

    if (mediaType === 'video') {
      setRemoteUsers((prev) => new Map(prev).set(user.uid.toString(), user));
      
      // Play remote video
      setTimeout(() => {
        if (remoteVideoRef.current) {
          user.videoTrack?.play(remoteVideoRef.current);
        }
      }, 100);
    }

    if (mediaType === 'audio') {
      user.audioTrack?.play();
    }
  };

  const handleUserUnpublished = (user, mediaType) => {
    if (mediaType === 'video') {
      setRemoteUsers((prev) => {
        const newMap = new Map(prev);
        newMap.delete(user.uid.toString());
        return newMap;
      });
    }
  };

  const handleUserLeft = (user) => {
    setRemoteUsers((prev) => {
      const newMap = new Map(prev);
      newMap.delete(user.uid.toString());
      return newMap;
    });
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!videoEnabled);
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!audioEnabled);
      setAudioEnabled(!audioEnabled);
    }
  };

  const leaveCall = async () => {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    if (clientRef.current) {
      await clientRef.current.leave();
    }
    setJoined(false);
    navigate('/interviews');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">
              {interview?.job?.title} - Interview
            </h1>
            <p className="text-sm text-gray-400">
              {user?.role === 'employer' 
                ? `Interviewing: ${interview?.candidate?.name}`
                : `Interviewer: ${interview?.interviewer?.name}`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Duration: {interview?.duration} minutes
            </span>
            <button
              onClick={leaveCall}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Leave Call
            </button>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-6">
        {!joined ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md text-center">
              <svg
                className="mx-auto h-16 w-16 text-primary-500 mb-4"
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
              <h2 className="text-2xl font-bold text-white mb-2">Ready to join?</h2>
              <p className="text-gray-400 mb-6">
                Click the button below to join the video interview
              </p>
              <button
                onClick={joinCall}
                className="btn-primary w-full py-3 text-lg"
              >
                🎥 Join Interview
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
            {/* Remote Video */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              <div
                ref={remoteVideoRef}
                className="w-full h-full flex items-center justify-center"
              >
                {remoteUsers.size === 0 && (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-12 h-12 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400">Waiting for other participant...</p>
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded text-white text-sm">
                {user?.role === 'employer' 
                  ? interview?.candidate?.name
                  : interview?.interviewer?.name}
              </div>
            </div>

            {/* Local Video */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              <div
                ref={localVideoRef}
                className="w-full h-full"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded text-white text-sm">
                You {!videoEnabled && '(Video Off)'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {joined && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full ${
                audioEnabled
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-red-600 hover:bg-red-700'
              } text-white transition-colors`}
              title={audioEnabled ? 'Mute' : 'Unmute'}
            >
              {audioEnabled ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full ${
                videoEnabled
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-red-600 hover:bg-red-700'
              } text-white transition-colors`}
              title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
            >
              {videoEnabled ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={leaveCall}
              className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
              title="Leave call"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewRoom;
