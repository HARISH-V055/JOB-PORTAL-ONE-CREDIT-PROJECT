import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';
import User from './models/User.js';

dotenv.config();

const jobTitles = [
  'Software Engineer', 'Senior Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer', 'Product Manager', 'UI/UX Designer',
  'Marketing Manager', 'Sales Executive', 'Business Analyst', 'Project Manager', 'Scrum Master',
  'Quality Assurance Engineer', 'Mobile App Developer', 'Cloud Architect', 'Security Analyst', 'Network Engineer',
  'Database Administrator', 'System Administrator', 'Technical Writer', 'Content Writer', 'SEO Specialist',
  'Digital Marketing Specialist', 'Social Media Manager', 'Graphic Designer', 'Video Editor', 'HR Manager',
  'Recruiter', 'Financial Analyst', 'Accountant', 'Operations Manager', 'Supply Chain Manager',
  'Customer Success Manager', 'Support Engineer', 'Sales Manager', 'Account Executive', 'Brand Manager'
];

const companies = [
  'Tech Innovations Inc', 'Digital Solutions Ltd', 'Global Systems Corp', 'Future Tech', 'Smart Solutions',
  'Data Dynamics', 'Cloud Nine Technologies', 'Innovative Minds', 'NextGen Software', 'Quantum Computing',
  'AI Ventures', 'Cyber Security Pro', 'Web Masters', 'Mobile First', 'Enterprise Solutions',
  'Startup Hub', 'Growth Partners', 'Market Leaders', 'Creative Agency', 'Design Studio'
];

const locations = [
  'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Boston, MA',
  'Chicago, IL', 'Los Angeles, CA', 'Denver, CO', 'Atlanta, GA', 'Miami, FL',
  'Portland, OR', 'Washington, DC', 'Dallas, TX', 'Phoenix, AZ', 'San Diego, CA',
  'Remote', 'Hybrid - New York', 'Hybrid - San Francisco', 'Hybrid - Austin', 'Hybrid - Seattle'
];

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Freelance'];

const categories = [
  'Information Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
  'Sales', 'Design', 'Engineering', 'Other'
];

const experienceLevels = ['No Experience', '1 Year', '2 Years', '3 Years+', '5 Years+', '10 Years+'];

const skillSets = [
  ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
  ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
  ['Java', 'Spring Boot', 'MySQL', 'Kubernetes', 'Jenkins'],
  ['C#', '.NET', 'Azure', 'SQL Server', 'Angular'],
  ['PHP', 'Laravel', 'Vue.js', 'Redis', 'Linux'],
  ['Ruby', 'Rails', 'PostgreSQL', 'Heroku', 'Git'],
  ['Go', 'Microservices', 'Docker', 'Kubernetes', 'gRPC'],
  ['TypeScript', 'Next.js', 'GraphQL', 'Prisma', 'Tailwind CSS'],
  ['Swift', 'iOS', 'Xcode', 'Firebase', 'SwiftUI'],
  ['Kotlin', 'Android', 'Jetpack Compose', 'Firebase', 'Material Design'],
  ['React Native', 'Flutter', 'Mobile Development', 'REST APIs', 'Git'],
  ['Data Analysis', 'Python', 'Pandas', 'SQL', 'Tableau'],
  ['Machine Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Python'],
  ['UI/UX Design', 'Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
  ['Digital Marketing', 'SEO', 'Google Analytics', 'Social Media', 'Content Marketing'],
  ['Project Management', 'Agile', 'Scrum', 'Jira', 'Confluence'],
  ['DevOps', 'CI/CD', 'Jenkins', 'Docker', 'Kubernetes'],
  ['Cloud Computing', 'AWS', 'Azure', 'GCP', 'Terraform'],
  ['Cybersecurity', 'Network Security', 'Penetration Testing', 'SIEM', 'Firewall'],
  ['Business Analysis', 'Requirements Gathering', 'SQL', 'Excel', 'Power BI']
];

const descriptions = [
  'We are seeking a talented professional to join our dynamic team. You will work on cutting-edge projects and collaborate with industry experts.',
  'Join our innovative company and help us build the future of technology. We offer competitive compensation and excellent benefits.',
  'Looking for a passionate individual who wants to make an impact. You will have the opportunity to work on exciting projects.',
  'Our company is growing rapidly and we need talented people to join us. Great work environment and career growth opportunities.',
  'Be part of a team that values creativity, innovation, and collaboration. We offer flexible work arrangements and professional development.',
  'We are looking for someone who is passionate about technology and wants to work on challenging problems.',
  'Join a fast-paced startup environment where your contributions will directly impact the company\'s success.',
  'Work with a diverse team of professionals on projects that matter. We value work-life balance and employee well-being.',
  'Excellent opportunity for career growth in a supportive and inclusive work environment.',
  'Help us deliver exceptional solutions to our clients. We offer competitive salary and comprehensive benefits package.'
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedJobs = async () => {
  try {
    await connectDB();

    // Find or create an employer user
    let employer = await User.findOne({ role: 'employer' });
    
    if (!employer) {
      console.log('Creating employer user...');
      employer = await User.create({
        name: 'Demo Employer',
        email: 'employer@demo.com',
        password: 'password123',
        role: 'employer',
      });
      console.log('✅ Employer user created');
    }

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('🗑️  Cleared existing jobs');

    // Generate 100 jobs
    const jobs = [];
    for (let i = 0; i < 100; i++) {
      const job = {
        title: jobTitles[Math.floor(Math.random() * jobTitles.length)] + ` ${i + 1}`,
        description: descriptions[Math.floor(Math.random() * descriptions.length)] + 
          `\n\nResponsibilities:\n- Develop and maintain high-quality code\n- Collaborate with cross-functional teams\n- Participate in code reviews\n- Contribute to technical documentation\n\nRequirements:\n- Strong problem-solving skills\n- Excellent communication abilities\n- Team player with attention to detail`,
        salary: Math.floor(Math.random() * (150000 - 50000) + 50000),
        location: locations[Math.floor(Math.random() * locations.length)],
        jobType: jobTypes[Math.floor(Math.random() * jobTypes.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        experience: experienceLevels[Math.floor(Math.random() * experienceLevels.length)],
        skills: skillSets[Math.floor(Math.random() * skillSets.length)],
        deadline: new Date(Date.now() + Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000), // Random date within 90 days
        employer: employer._id,
        status: 'active',
      };
      jobs.push(job);
    }

    await Job.insertMany(jobs);
    console.log(`✅ Successfully created ${jobs.length} job posts!`);
    
    console.log('\n📊 Sample jobs created:');
    const sampleJobs = await Job.find().limit(5).select('title location salary jobType');
    sampleJobs.forEach(job => {
      console.log(`  - ${job.title} | ${job.location} | $${job.salary.toLocaleString()} | ${job.jobType}`);
    });

    console.log('\n🎉 Database seeding completed!');
    console.log('You can now browse jobs at http://localhost:3000/jobs');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedJobs();
