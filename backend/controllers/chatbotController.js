import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';

// Sample salary data (in real app, this could be from external API)
const salaryData = {
  'react': { min: 400000, max: 1200000, avg: 800000 },
  'python': { min: 500000, max: 1500000, avg: 900000 },
  'javascript': { min: 350000, max: 1000000, avg: 650000 },
  'java': { min: 450000, max: 1300000, avg: 850000 },
  'node': { min: 400000, max: 1100000, avg: 750000 },
  'angular': { min: 400000, max: 1000000, avg: 700000 },
  'vue': { min: 350000, max: 900000, avg: 625000 },
  'data science': { min: 600000, max: 2000000, avg: 1200000 },
  'machine learning': { min: 700000, max: 2500000, avg: 1500000 },
  'devops': { min: 600000, max: 1800000, avg: 1100000 },
  'full stack': { min: 500000, max: 1400000, avg: 950000 },
};

// Interview questions database
const interviewQuestions = {
  'react': [
    "What is the difference between state and props in React?",
    "Explain the React component lifecycle methods.",
    "What are React Hooks and why are they useful?",
    "How does virtual DOM work in React?",
    "What is the difference between controlled and uncontrolled components?"
  ],
  'python': [
    "What are the key features of Python?",
    "Explain the difference between list and tuple in Python.",
    "What is a decorator in Python?",
    "How does memory management work in Python?",
    "What are generators in Python?"
  ],
  'javascript': [
    "What is the difference between let, const, and var?",
    "Explain closures in JavaScript.",
    "What is the event loop in JavaScript?",
    "What are promises and how do they work?",
    "Explain the concept of hoisting."
  ],
  'data science': [
    "What is the difference between supervised and unsupervised learning?",
    "Explain the bias-variance tradeoff.",
    "What is cross-validation and why is it important?",
    "How do you handle missing data in a dataset?",
    "What are the assumptions of linear regression?"
  ],
  'machine learning': [
    "What is overfitting and how can you prevent it?",
    "Explain the difference between classification and regression.",
    "What is feature engineering and why is it important?",
    "How do you evaluate a machine learning model?",
    "What is the curse of dimensionality?"
  ],
  'java': [
    "What is the difference between JDK, JRE, and JVM?",
    "Explain object-oriented programming concepts in Java.",
    "What is the difference between abstract class and interface?",
    "How does garbage collection work in Java?",
    "What are the different types of inheritance in Java?"
  ]
};

// Format currency in Indian Rupees
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Extract skills/keywords from message
const extractKeywords = (message) => {
  const keywords = [];
  const lowerMessage = message.toLowerCase();
  
  // Check for programming languages and technologies
  const techKeywords = ['react', 'python', 'javascript', 'java', 'node', 'angular', 'vue', 'data science', 'machine learning', 'devops', 'full stack', 'html', 'css', 'mongodb', 'sql'];
  
  techKeywords.forEach(keyword => {
    if (lowerMessage.includes(keyword)) {
      keywords.push(keyword);
    }
  });
  
  return keywords;
};

// Extract location from message
const extractLocation = (message) => {
  const locations = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'pune', 'chennai', 'kolkata', 'ahmedabad', 'remote'];
  const lowerMessage = message.toLowerCase();
  
  for (const location of locations) {
    if (lowerMessage.includes(location)) {
      return location;
    }
  }
  return null;
};

// @desc    Handle chatbot message
// @route   POST /api/v1/chatbot/message
// @access  Private
export const handleChatbotMessage = async (req, res, next) => {
  try {
    const { message, userId } = req.body;
    const lowerMessage = message.toLowerCase();

    let response = '';

    // Job search queries
    if (lowerMessage.includes('job') || lowerMessage.includes('show me') || lowerMessage.includes('find')) {
      const keywords = extractKeywords(message);
      const location = extractLocation(message);
      
      let query = {};
      
      if (keywords.length > 0) {
        query.$or = keywords.map(keyword => ({
          $or: [
            { title: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { requirements: { $regex: keyword, $options: 'i' } }
          ]
        }));
      }
      
      if (location && location !== 'remote') {
        query.location = { $regex: location, $options: 'i' };
      } else if (location === 'remote') {
        query.remote = true;
      }

      const jobs = await Job.find(query)
        .populate('employer', 'name')
        .limit(5)
        .sort({ createdAt: -1 });

      if (jobs.length > 0) {
        response = `🎯 I found ${jobs.length} matching jobs:\n\n`;
        jobs.forEach((job, index) => {
          response += `${index + 1}. **${job.title}** at ${job.employer.name}\n`;
          response += `   💰 ${formatCurrency(job.salary.min)} - ${formatCurrency(job.salary.max)}\n`;
          response += `   📍 ${job.location}${job.remote ? ' (Remote)' : ''}\n\n`;
        });
        response += `Want to apply to any of these? Just say "Apply to job 1" or visit the Jobs page! 🚀`;
      } else {
        response = `😔 I couldn't find any jobs matching "${keywords.join(', ')}"${location ? ` in ${location}` : ''}.\n\nTry searching for:\n• Different keywords\n• Broader location\n• Related technologies\n\nOr browse all jobs on our Jobs page! 📋`;
      }
    }
    
    // Salary insights
    else if (lowerMessage.includes('salary') || lowerMessage.includes('pay') || lowerMessage.includes('average')) {
      const keywords = extractKeywords(message);
      
      if (keywords.length > 0) {
        const skill = keywords[0];
        const salaryInfo = salaryData[skill];
        
        if (salaryInfo) {
          response = `💰 **${skill.toUpperCase()} Developer Salary Insights:**\n\n`;
          response += `• **Average:** ${formatCurrency(salaryInfo.avg)} per year\n`;
          response += `• **Range:** ${formatCurrency(salaryInfo.min)} - ${formatCurrency(salaryInfo.max)}\n\n`;
          response += `💡 **Tips to increase salary:**\n`;
          response += `• Build strong portfolio projects\n`;
          response += `• Gain 2-3 years experience\n`;
          response += `• Learn complementary skills\n`;
          response += `• Consider remote opportunities\n\n`;
          response += `Want to see jobs in this salary range? Ask me to "Show me ${skill} jobs"! 🎯`;
        } else {
          response = `🤔 I don't have salary data for "${skill}" yet.\n\nI have insights for:\n• React, Python, JavaScript\n• Java, Node.js, Angular, Vue\n• Data Science, Machine Learning\n• DevOps, Full Stack\n\nTry asking about one of these! 💡`;
        }
      } else {
        response = `💰 **General Salary Insights:**\n\n`;
        response += `• **Entry Level (0-2 years):** ₹3-8 LPA\n`;
        response += `• **Mid Level (2-5 years):** ₹8-15 LPA\n`;
        response += `• **Senior Level (5+ years):** ₹15-30 LPA\n\n`;
        response += `For specific technology salaries, ask me:\n"What's the average salary for Python developers?" 🐍`;
      }
    }
    
    // Application status
    else if (lowerMessage.includes('application') || lowerMessage.includes('status') || lowerMessage.includes('applied')) {
      if (!userId) {
        response = `🔐 Please log in to check your application status.\n\nOnce logged in, I can show you:\n• All your applications\n• Current status\n• Next steps\n• Interview schedules`;
      } else {
        const applications = await Application.find({ applicant: userId })
          .populate('job', 'title')
          .populate({
            path: 'job',
            populate: { path: 'employer', select: 'name' }
          })
          .sort({ createdAt: -1 })
          .limit(5);

        if (applications.length > 0) {
          response = `📋 **Your Recent Applications:**\n\n`;
          applications.forEach((app, index) => {
            const statusEmoji = {
              'pending': '⏳',
              'reviewing': '👀',
              'shortlisted': '✅',
              'rejected': '❌',
              'hired': '🎉'
            };
            
            response += `${index + 1}. **${app.job.title}** at ${app.job.employer.name}\n`;
            response += `   Status: ${statusEmoji[app.status] || '⏳'} ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}\n`;
            response += `   Applied: ${app.createdAt.toLocaleDateString()}\n\n`;
          });
          
          response += `💡 **Next Steps:**\n`;
          response += `• Keep your profile updated\n`;
          response += `• Prepare for interviews\n`;
          response += `• Apply to more positions\n\n`;
          response += `Need interview prep? Ask me "Interview questions for [technology]"! 🎯`;
        } else {
          response = `📭 You haven't applied to any jobs yet.\n\n🚀 **Ready to start your journey?**\n• Browse our job listings\n• Update your profile\n• Upload your resume\n\nAsk me "Show me [technology] jobs" to find opportunities! 💼`;
        }
      }
    }
    
    // Interview preparation
    else if (lowerMessage.includes('interview') || lowerMessage.includes('questions') || lowerMessage.includes('preparation')) {
      const keywords = extractKeywords(message);
      
      if (keywords.length > 0) {
        const skill = keywords[0];
        const questions = interviewQuestions[skill];
        
        if (questions) {
          response = `🎯 **${skill.toUpperCase()} Interview Questions:**\n\n`;
          questions.forEach((question, index) => {
            response += `${index + 1}. ${question}\n\n`;
          });
          response += `💡 **Interview Tips:**\n`;
          response += `• Practice coding problems daily\n`;
          response += `• Prepare real project examples\n`;
          response += `• Research the company\n`;
          response += `• Ask thoughtful questions\n\n`;
          response += `Want more specific prep? Ask about other technologies! 🚀`;
        } else {
          response = `🤔 I don't have interview questions for "${skill}" yet.\n\n📚 **Available prep materials:**\n• React, Python, JavaScript\n• Java, Data Science, ML\n\n🎯 **General Interview Tips:**\n• Review your resume thoroughly\n• Practice explaining your projects\n• Prepare STAR method examples\n• Research the company culture\n\nTry asking "Interview questions for React"! 💡`;
        }
      } else {
        response = `🎯 **Interview Preparation Guide:**\n\n`;
        response += `**Technical Prep:**\n• Review core concepts\n• Practice coding problems\n• Prepare project explanations\n\n`;
        response += `**Behavioral Prep:**\n• STAR method examples\n• Career goals discussion\n• Company research\n\n`;
        response += `**Available Question Sets:**\n• React, Python, JavaScript\n• Java, Data Science, ML\n\n`;
        response += `Ask me "Interview questions for [technology]" for specific prep! 📚`;
      }
    }
    
    // Greeting and general help
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
      response = `👋 Hello! I'm your Job Search Assistant!\n\n🤖 **I can help you with:**\n\n🔍 **Job Search:**\n"Show me React developer jobs"\n"Find Python jobs in Mumbai"\n\n💰 **Salary Insights:**\n"What's the average salary for Python developers?"\n\n📋 **Application Status:**\n"What's my application status?"\n\n🎯 **Interview Prep:**\n"Interview questions for data science"\n\nWhat would you like to know? 😊`;
    }
    
    // Default response
    else {
      response = `🤔 I'm not sure how to help with that.\n\n🤖 **Try asking me about:**\n\n• Job search: "Show me React jobs"\n• Salaries: "Python developer salary"\n• Applications: "My application status"\n• Interviews: "Data science interview questions"\n\n💡 **Or use these quick phrases:**\n• "Find jobs in [city]"\n• "Average salary for [skill]"\n• "Interview prep for [technology]"\n\nWhat can I help you with? 😊`;
    }

    res.status(200).json({
      success: true,
      response: response,
    });
  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({
      success: false,
      response: 'Sorry, I encountered an error. Please try again! 😅',
    });
  }
};
