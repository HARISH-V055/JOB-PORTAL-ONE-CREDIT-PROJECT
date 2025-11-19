import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Chatbot = ({ className = '' }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: '1',
        text: `Hi ${user?.name || 'there'}! 👋 I'm your Job Search Assistant. I can help you with:

🔍 Smart job recommendations
💰 Salary insights  
📋 Application status
🎯 Interview preparation

Try asking: "Show me React developer jobs" or "What's the average salary for Python developers?"`,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [user?.name]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Wait for animation to complete
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Simulate typing effect
  const simulateTyping = (text, callback) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, Math.min(text.length * 30, 2000)); // Max 2 seconds
  };

  // Simple offline responses for testing
  const getOfflineResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `👋 Hello! I'm your Job Search Assistant!\n\n🤖 I can help you with:\n• Job search\n• Salary insights\n• Application status\n• Interview preparation\n\nTry asking: "Show me React jobs" 🚀`;
    }
    
    if (lowerMessage.includes('react') && lowerMessage.includes('job')) {
      return `🎯 **React Developer Jobs:**\n\n1. **React Developer** at TechCorp\n   💰 ₹8,00,000 - ₹12,00,000\n   📍 Mumbai\n\n2. **Frontend Engineer** at StartupX\n   💰 ₹6,00,000 - ₹10,00,000\n   📍 Bangalore\n\nWant to see more? Visit the Jobs page! 🚀`;
    }
    
    if (lowerMessage.includes('salary') && lowerMessage.includes('python')) {
      return `💰 **Python Developer Salary:**\n\n• **Average:** ₹9,00,000 per year\n• **Range:** ₹5,00,000 - ₹15,00,000\n\n💡 **Tips:**\n• Build portfolio projects\n• Learn frameworks like Django/Flask\n• Contribute to open source\n\nGreat career choice! 🐍`;
    }
    
    return `🤖 I understand you're asking about "${message}".\n\n📋 **I can help with:**\n• "Show me React jobs"\n• "Python developer salary"\n• "My application status"\n• "Interview questions for data science"\n\nWhat would you like to know? 😊`;
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      // Get bot response
      console.log('Sending message:', messageText);
      const response = await api.post('/chatbot/message', {
        message: messageText,
        userId: user?._id,
      });

      console.log('Bot response:', response.data);
      const botResponse = response.data.response;

      // Simulate typing and add bot response
      simulateTyping(botResponse, () => {
        const botMessage = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Chatbot API error:', error);
      // Use offline response as fallback
      const fallbackResponse = getOfflineResponse(messageText);
      
      simulateTyping(fallbackResponse, () => {
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          text: fallbackResponse,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
      });
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick action buttons
  const quickActions = [
    "Show me React developer jobs",
    "What's the average salary for Python developers?",
    "Interview questions for data science",
    "My application status"
  ];

  const handleQuickAction = (action) => {
    setInputValue(action);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Window */}
      <div
        className={`mb-4 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 transform ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{ 
          transformOrigin: 'bottom right',
          zIndex: 1000,
          position: 'relative'
        }}
      >
        {/* Header */}
        <div className="bg-primary-600 dark:bg-primary-700 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary-600 text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold">Job Assistant</h3>
              <p className="text-xs text-primary-100">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-primary-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.isBot
                    ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                    : 'bg-primary-600 text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500 dark:text-gray-400' : 'text-primary-100'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-1">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                console.log('Input change:', e.target.value);
                setInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                console.log('Key pressed:', e.key);
                handleKeyPress(e);
              }}
              onFocus={() => console.log('Input focused')}
              onBlur={() => console.log('Input blurred')}
              placeholder="Type here..."
              disabled={isLoading}
              style={{ 
                zIndex: 9999,
                position: 'relative',
                pointerEvents: 'auto'
              }}
              className="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              onClick={() => {
                console.log('Send button clicked');
                handleSendMessage();
              }}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Debug: Input value = "{inputValue}" | Loading = {isLoading.toString()}
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'rotate-180' : 'animate-pulse'
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
      </button>

      {/* Notification Badge */}
      {!isOpen && messages.length > 1 && (
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
          !
        </div>
      )}
    </div>
  );
};

export default Chatbot;
