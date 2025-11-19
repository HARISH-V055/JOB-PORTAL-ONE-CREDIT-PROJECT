# Job Portal - MERN Stack Application

A full-stack job portal application built with MongoDB, Express.js, React, and Node.js. This platform connects job seekers with employers, featuring role-based access control, real-time job applications, and comprehensive dashboard analytics.

## 🚀 Features

### User Module
- **Authentication**: JWT-based secure authentication
- **Role-based Access**: Job Seeker, Employer, and Admin roles
- **Profile Management**: Update profile information and password
- **Registration & Login**: Separate flows for job seekers and employers

### Job Module
- **Job Posting**: Employers can create, edit, and delete job listings
- **Job Browsing**: Public access to view all active job postings
- **Advanced Filters**: Search by title, location, category, job type, and experience level
- **Job Details**: Comprehensive job information with skills, salary, and deadlines

### Application Module
- **Apply for Jobs**: Job seekers can submit applications with resume and cover letter
- **Application Tracking**: Track application status (pending, reviewing, shortlisted, etc.)
- **Employer Review**: Employers can view and manage applications for their jobs
- **Status Updates**: Real-time application status changes

### Dashboard Module
- **Job Seeker Dashboard**: View all applications and their statuses
- **Employer Dashboard**: Manage job postings and view applications
- **Admin Dashboard**: Comprehensive overview of users, jobs, and applications
- **Analytics**: Visual statistics and charts for key metrics

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Morgan** for logging

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
job-portal/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── asyncHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── errorResponse.js
│   │   └── tokenResponse.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Jobs.tsx
│   │   │   ├── JobDetail.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── PostJob.tsx
│   │   ├── utils/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── .gitignore
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/auth/logout` - Logout user

### Jobs
- `GET /api/v1/jobs` - Get all jobs (with filters)
- `GET /api/v1/jobs/:id` - Get single job
- `POST /api/v1/jobs` - Create job (Employer only)
- `PUT /api/v1/jobs/:id` - Update job (Employer only)
- `DELETE /api/v1/jobs/:id` - Delete job (Employer only)
- `GET /api/v1/jobs/my-jobs` - Get employer's jobs

### Applications
- `POST /api/v1/applications` - Submit application (Job Seeker only)
- `GET /api/v1/applications` - Get all applications (Admin only)
- `GET /api/v1/applications/my-applications` - Get user's applications
- `GET /api/v1/applications/job/:jobId` - Get job applications (Employer only)
- `GET /api/v1/applications/:id` - Get single application
- `PUT /api/v1/applications/:id` - Update application status (Employer only)
- `DELETE /api/v1/applications/:id` - Delete application

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get single user (Admin only)
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin only)
- `PUT /api/v1/users/update-password` - Update password

## 👥 User Roles

### Job Seeker
- Browse and search jobs
- Apply for jobs with resume and cover letter
- Track application status
- Manage profile

### Employer
- Post, edit, and delete job listings
- View applications for posted jobs
- Update application status
- Manage company profile

### Admin
- Full access to all features
- Manage users, jobs, and applications
- View comprehensive analytics
- System-wide control

## 🎨 UI Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean and professional interface with Tailwind CSS
- **Intuitive Navigation**: Easy-to-use navigation with React Router
- **Real-time Updates**: Instant feedback on actions
- **Form Validation**: Client-side and server-side validation
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected routes on frontend and backend
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy the backend folder

### Frontend Deployment (Vercel/Netlify)
1. Build the production version: `npm run build`
2. Set `REACT_APP_API_URL` to your backend URL
3. Deploy the build folder

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

### Frontend (.env)
```
REACT_APP_API_URL=your_backend_api_url
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using the MERN stack

## 🐛 Known Issues

- File upload for resumes is currently URL-based (can be enhanced with multer for actual file uploads)
- Real-time notifications require socket.io implementation (planned for future release)

## 🔮 Future Enhancements

- [ ] Real-time notifications with Socket.io
- [ ] Email notifications for application updates
- [ ] Resume file upload with cloud storage
- [ ] Advanced search with Elasticsearch
- [ ] Company profiles with logos
- [ ] Job recommendations based on user profile
- [ ] Chat feature between employers and candidates
- [ ] Video interview scheduling
- [ ] Analytics dashboard with charts (Recharts/Chart.js)
- [ ] Social media authentication
- [ ] Multi-language support

## 📞 Support

For support, email support@jobportal.com or open an issue in the repository.
