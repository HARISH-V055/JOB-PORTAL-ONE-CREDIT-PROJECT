import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';

const Messages = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      
      // Join conversation room
      if (socket) {
        socket.emit('join_conversation', selectedConversation._id);
      }

      return () => {
        // Leave conversation room on cleanup
        if (socket) {
          socket.emit('leave_conversation', selectedConversation._id);
        }
      };
    }
  }, [selectedConversation, socket]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
      
      // Show notification if message is not from current user
      if (message.sender._id !== user?._id) {
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Message', {
            body: `${message.sender.name}: ${message.content}`,
            icon: message.sender.avatar?.url || '/logo.png',
          });
        }
        
        // Play notification sound (optional)
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgs7y2Ik2CBlou+3nn00QDFCn4/C2YxwGOJLX8sx5LAUkd8fw3ZBBChRetevrqFUUCkaf4PK+bCEFK4LO8tmJNggZaLvt559NEAxQp+PwtmMcBjiS1/LMeSwFJHfH8N2QQAoUXrTr66hVFApGn+DyvmwhBSuCzvLZiTYIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgs7y2Ik2CBlou+3nn00QDFCn4/C2YxwGOJLX8sx5LAUkd8fw3ZBBChRetevrqFUUCkaf4PK+bCEFK4LO8tmJNggZaLvt559NEAxQp+PwtmMcBjiS1/LMeSwFJHfH8N2QQAoUXrTr66hVFApGn+DyvmwhBSuCzvLZiTYIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQU=');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
    });

    // Listen for typing indicators
    socket.on('user_typing', () => {
      setIsTyping(true);
    });

    socket.on('user_stop_typing', () => {
      setIsTyping(false);
    });

    return () => {
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [socket, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await api.get(`/messages/conversation/${conversationId}`);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const response = await api.post('/messages', {
        conversationId: selectedConversation._id,
        content: newMessage,
        messageType: 'text',
      });

      const message = response.data.data;
      setMessages((prev) => [...prev, message]);

      // Emit via Socket.io for real-time delivery
      if (socket) {
        socket.emit('send_message', {
          conversationId: selectedConversation._id,
          message: message,
        });
      }

      setNewMessage('');
      
      // Stop typing indicator
      if (socket) {
        socket.emit('stop_typing', { conversationId: selectedConversation._id });
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    if (!socket || !selectedConversation) return;

    socket.emit('typing', { conversationId: selectedConversation._id });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { conversationId: selectedConversation._id });
    }, 1000);
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find((p) => p._id !== user?._id);
  };

  const formatTime = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">💬 Messages</h1>
          {isConnected && (
            <span className="flex items-center text-sm text-green-600">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Connected
            </span>
          )}
        </div>

        <div className="card overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Conversations</h2>
              </div>
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">Apply for jobs to start messaging with employers</p>
                </div>
              ) : (
                <div>
                  {conversations.map((conversation) => {
                    const otherUser = getOtherParticipant(conversation);
                    const unreadCount = conversation.unreadCount?.[user?._id || ''] || 0;

                    return (
                      <div
                        key={conversation._id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedConversation?._id === conversation._id ? 'bg-primary-50' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {otherUser?.avatar?.url ? (
                              <img
                                src={otherUser.avatar.url}
                                alt={otherUser.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-primary-600 font-semibold text-lg">
                                  {otherUser?.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {otherUser?.name}
                              </p>
                              {unreadCount > 0 && (
                                <span className="ml-2 px-2 py-1 text-xs font-bold text-white bg-primary-600 rounded-full">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">
                              {conversation.application?.job?.title}
                            </p>
                            {conversation.lastMessage && (
                              <p className="text-sm text-gray-600 truncate mt-1">
                                {conversation.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getOtherParticipant(selectedConversation)?.avatar?.url ? (
                          <img
                            src={getOtherParticipant(selectedConversation)?.avatar?.url}
                            alt={getOtherParticipant(selectedConversation)?.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">
                              {getOtherParticipant(selectedConversation)?.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {getOtherParticipant(selectedConversation)?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedConversation.application?.job?.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {messages.map((message) => {
                      const isOwnMessage = message.sender._id === user?._id;

                      return (
                        <div
                          key={message._id}
                          className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-end ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} max-w-xs lg:max-w-md`}>
                            {!isOwnMessage && (
                              <div className="flex-shrink-0 mr-2">
                                {message.sender.avatar?.url ? (
                                  <img
                                    src={message.sender.avatar.url}
                                    alt={message.sender.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-gray-600 text-xs font-semibold">
                                      {message.sender.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex flex-col">
                              {!isOwnMessage && (
                                <span className="text-xs text-gray-500 mb-1 ml-1">
                                  {message.sender.name}
                                </span>
                              )}
                              <div
                                className={`px-4 py-2 rounded-lg ${
                                  isOwnMessage
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-900 border border-gray-200'
                                }`}
                              >
                              {message.messageType === 'interview' && message.interviewDetails ? (
                                <div>
                                  <p className="font-semibold mb-2">📅 Interview Scheduled</p>
                                  <p className="text-sm">Date: {message.interviewDetails.date}</p>
                                  <p className="text-sm">Time: {message.interviewDetails.time}</p>
                                  <p className="text-sm">Location: {message.interviewDetails.location}</p>
                                  {message.interviewDetails.meetingLink && (
                                    <a
                                      href={message.interviewDetails.meetingLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm underline mt-2 block"
                                    >
                                      Join Meeting
                                    </a>
                                  )}
                                </div>
                              ) : message.messageType === 'file' ? (
                                <div>
                                  <p className="mb-2">{message.content}</p>
                                  <a
                                    href={message.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-sm underline"
                                  >
                                    📎 {message.fileName}
                                  </a>
                                </div>
                              ) : (
                                <p>{message.content}</p>
                              )}
                              <p
                                className={`text-xs mt-1 ${
                                  isOwnMessage ? 'text-primary-100' : 'text-gray-500'
                                }`}
                              >
                                {formatTime(message.createdAt)}
                              </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {isTyping && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="animate-pulse">Typing...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          handleTyping();
                        }}
                        placeholder="Type a message..."
                        className="flex-1 input-field"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="ml-3 btn-primary disabled:opacity-50"
                      >
                        {sending ? 'Sending...' : 'Send'}
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="mt-2">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
