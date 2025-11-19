import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const SimpleChatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        text: `Hi ${user?.name || 'there'}! 👋 I'm your Job Search Assistant.\n\n🔍 Smart job recommendations\n💰 Salary insights\n📋 Application status\n🎯 Interview preparation\n\nTry: "Show me React jobs" or "Python developer salary"`,
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [user?.name]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get bot response
  const getBotResponse = async (userMessage) => {
    try {
      const response = await api.post('/chatbot/message', {
        message: userMessage,
        userId: user?._id,
      });
      return response.data.response;
    } catch (error) {
      // Offline fallback responses
      const lower = userMessage.toLowerCase();
      
      if (lower.includes('hello') || lower.includes('hi')) {
        return `👋 Hello! I can help you with:\n• Job search\n• Salary insights\n• Application status\n• Interview prep\n\nWhat would you like to know?`;
      }
      
      if (lower.includes('react') && lower.includes('job')) {
        return `🎯 React Developer Jobs:\n\n1. React Developer at TechCorp\n   💰 ₹8-12 LPA | 📍 Mumbai\n\n2. Frontend Engineer at StartupX\n   💰 ₹6-10 LPA | 📍 Bangalore\n\nVisit Jobs page for more!`;
      }
      
      if (lower.includes('salary') && lower.includes('python')) {
        return `💰 Python Developer Salary:\n\n• Average: ₹9,00,000/year\n• Range: ₹5-15 LPA\n\n💡 Tips:\n• Build portfolio projects\n• Learn Django/Flask\n• Contribute to open source`;
      }
      
      if (lower.includes('application') || lower.includes('status')) {
        return `📋 Check your applications on the Dashboard page!\n\nI can help with:\n• Job recommendations\n• Salary insights\n• Interview prep`;
      }
      
      if (lower.includes('interview')) {
        return `🎯 Interview Preparation:\n\n• Practice coding problems\n• Review core concepts\n• Prepare project examples\n• Research the company\n\nAsk me "Interview questions for [technology]"`;
      }
      
      return `🤖 I can help you with:\n\n🔍 "Show me React jobs"\n💰 "Python developer salary"\n📋 "My application status"\n🎯 "Interview questions"\n\nWhat would you like to know?`;
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user message
    const userMsg = {
      text: message.trim(),
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    // Get bot response
    const botResponse = await getBotResponse(userMsg.text);
    
    // Simulate typing delay
    setTimeout(() => {
      const botMsg = {
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Simple Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white border-2 border-gray-300 rounded-lg shadow-lg">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <p className="font-semibold">Job Assistant</p>
                <p className="text-xs text-blue-100">{isTyping ? 'Typing...' : 'Online'}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="h-64 p-3 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.isUser 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg">
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

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isTyping}
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                autoFocus
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || isTyping}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isTyping ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-xl"
      >
        💬
      </button>
    </div>
  );
};

export default SimpleChatbot;
