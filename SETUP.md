# Job Portal - Setup Guide

This guide will help you set up and run the Job Portal application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** package manager
- **Git** (optional, for cloning)

## Step-by-Step Installation

### 1. Clone or Download the Project

```bash
cd d:/MINI PROJECT
```

### 2. Backend Setup

#### Install Backend Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
copy .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

**Important Notes:**
- If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string
- Change `JWT_SECRET` to a strong, unique secret key
- For production, set `NODE_ENV=production`

#### Start MongoDB (if using local installation)

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**Mac/Linux:**
```bash
# Start MongoDB
sudo systemctl start mongod
```

#### Run the Backend Server

```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

The backend server will start on `http://localhost:5000`

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📍 Environment: development
```

### 3. Frontend Setup

Open a new terminal window/tab:

#### Install Frontend Dependencies

```bash
cd frontend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

**Note:** If you deploy the backend to a different URL, update this accordingly.

#### Install Tailwind CSS Plugin

```bash
npm install -D @tailwindcss/forms
```

#### Start the Frontend Development Server

```bash
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## Verification

### Test Backend API

Open your browser or use a tool like Postman to test:

```
http://localhost:5000
```

You should see:
```json
{
  "message": "Welcome to Job Portal API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/v1/auth",
    "jobs": "/api/v1/jobs",
    "applications": "/api/v1/applications",
    "users": "/api/v1/users"
  }
}
```

### Test Frontend

Navigate to `http://localhost:3000` in your browser. You should see the Job Portal home page.

## Creating Test Accounts

### 1. Create an Employer Account

1. Click "Sign Up" on the homepage
2. Fill in the registration form
3. Select "Employer" as the role
4. Submit the form

### 2. Create a Job Seeker Account

1. Click "Sign Up" on the homepage
2. Fill in the registration form
3. Select "Job Seeker" as the role
4. Submit the form

### 3. Create an Admin Account (via MongoDB)

Since admin accounts should not be created through the UI, you can create one directly in MongoDB:

```javascript
// Connect to MongoDB shell
use job-portal

// Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@jobportal.com",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use the registration endpoint with Postman:

```bash
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@jobportal.com",
  "password": "admin123",
  "role": "admin"
}
```

## Common Issues and Solutions

### Issue 1: MongoDB Connection Error

**Error:** `MongoNetworkError: failed to connect to server`

**Solution:**
- Ensure MongoDB is running
- Check if the `MONGO_URI` in `.env` is correct
- For local MongoDB, try: `mongodb://127.0.0.1:27017/job-portal`
- For MongoDB Atlas, ensure your IP is whitelisted

### Issue 2: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
- Change the PORT in backend `.env` file
- Or kill the process using that port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill -9
  ```

### Issue 3: CORS Errors

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Ensure backend is running
- Check that `REACT_APP_API_URL` in frontend `.env` is correct
- Backend CORS is already configured to accept all origins in development

### Issue 4: Tailwind Styles Not Loading

**Solution:**
- Ensure `tailwind.config.js` and `postcss.config.js` exist
- Restart the frontend development server
- Clear browser cache

### Issue 5: JWT Token Errors

**Error:** `JsonWebTokenError: invalid token`

**Solution:**
- Clear browser localStorage
- Log out and log in again
- Ensure `JWT_SECRET` is set in backend `.env`

## Testing the Application

### 1. Test User Registration and Login

1. Register as a Job Seeker
2. Log out
3. Register as an Employer
4. Test login with both accounts

### 2. Test Job Posting (Employer)

1. Log in as Employer
2. Navigate to "Post Job"
3. Fill in job details
4. Submit the form
5. Check Dashboard to see the posted job

### 3. Test Job Application (Job Seeker)

1. Log in as Job Seeker
2. Browse jobs
3. Click on a job to view details
4. Click "Apply Now"
5. Submit application with resume URL
6. Check Dashboard to see application status

### 4. Test Application Management (Employer)

1. Log in as Employer
2. Go to Dashboard
3. Click "Applications" for a job
4. Update application status

## Production Deployment

### Backend Deployment (Heroku Example)

```bash
# Login to Heroku
heroku login

# Create new app
heroku create job-portal-api

# Set environment variables
heroku config:set MONGO_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variable in Vercel dashboard
# REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api/v1
```

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Changes are reflected immediately
- Backend: Using `nodemon` for auto-restart on file changes

### Database Management

Use MongoDB Compass for visual database management:
- Download: https://www.mongodb.com/products/compass
- Connect to: `mongodb://localhost:27017`

### API Testing

Use Postman or Thunder Client (VS Code extension) to test API endpoints:
- Import the API collection (if provided)
- Set base URL: `http://localhost:5000/api/v1`
- Add Bearer token for protected routes

## Next Steps

1. **Customize the Application**
   - Update colors in `tailwind.config.js`
   - Modify components in `frontend/src/components`
   - Add new features as needed

2. **Add Sample Data**
   - Create multiple test accounts
   - Post various job listings
   - Submit sample applications

3. **Enhance Security**
   - Change default JWT secret
   - Implement rate limiting
   - Add input sanitization

4. **Deploy to Production**
   - Follow deployment guides above
   - Set up custom domain
   - Configure SSL certificates

## Support

If you encounter any issues:
1. Check this guide thoroughly
2. Review the main README.md
3. Check console logs for errors
4. Ensure all dependencies are installed
5. Verify environment variables are set correctly

## Useful Commands

```bash
# Backend
npm install          # Install dependencies
npm run dev         # Start development server
npm start           # Start production server

# Frontend
npm install          # Install dependencies
npm start           # Start development server
npm run build       # Build for production
npm test            # Run tests

# MongoDB
mongod              # Start MongoDB server
mongo               # Open MongoDB shell
```

Happy coding! 🚀
