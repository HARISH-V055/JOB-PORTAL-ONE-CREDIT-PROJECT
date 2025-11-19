# Quick Start Guide - Job Portal

Get the Job Portal up and running in 5 minutes!

## Prerequisites Check

Before starting, verify you have:
- ✅ Node.js installed: `node --version` (should be v14+)
- ✅ MongoDB installed or MongoDB Atlas account
- ✅ npm installed: `npm --version`

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Backend Dependencies (1 min)

```bash
cd backend
npm install
```

### Step 2: Configure Backend Environment (30 sec)

Create `backend/.env` file:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=my_super_secret_jwt_key_12345
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

**Using MongoDB Atlas?** Replace `MONGO_URI` with your connection string.

### Step 3: Start MongoDB (if local) (30 sec)

**Windows:**
```bash
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
```

**Skip this if using MongoDB Atlas!**

### Step 4: Start Backend Server (30 sec)

```bash
# From backend directory
npm run dev
```

✅ You should see: `✅ Connected to MongoDB` and `🚀 Server running on port 5000`

### Step 5: Install Frontend Dependencies (1 min)

Open a **NEW terminal window**:

```bash
cd frontend
npm install
```

### Step 6: Configure Frontend Environment (30 sec)

Create `frontend/.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### Step 7: Start Frontend Server (30 sec)

```bash
# From frontend directory
npm start
```

✅ Browser should automatically open to `http://localhost:3000`

## 🎉 You're Ready!

The application is now running:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Docs:** http://localhost:5000 (shows available endpoints)

## 🧪 Quick Test

### Test 1: Create an Employer Account

1. Click **"Sign Up"** on homepage
2. Fill in details:
   - Name: Test Employer
   - Email: employer@test.com
   - Password: test123
   - Role: **Employer**
3. Click **"Sign Up"**
4. You'll be redirected to Dashboard

### Test 2: Post a Job

1. Click **"Post Job"** in navbar
2. Fill in job details:
   - Title: Software Developer
   - Description: Looking for a talented developer
   - Salary: 80000
   - Location: New York
   - Job Type: Full-time
   - Category: Information Technology
   - Experience: 2 Years
   - Skills: JavaScript, React, Node.js
   - Deadline: (select a future date)
3. Click **"Post Job"**
4. Check Dashboard to see your posted job

### Test 3: Create a Job Seeker Account

1. **Logout** (click Logout in navbar)
2. Click **"Sign Up"**
3. Fill in details:
   - Name: Test Job Seeker
   - Email: jobseeker@test.com
   - Password: test123
   - Role: **Job Seeker**
4. Click **"Sign Up"**

### Test 4: Apply for a Job

1. Click **"Browse Jobs"** in navbar
2. Click on the job you posted earlier
3. Click **"Apply Now"**
4. Fill in:
   - Resume URL: https://example.com/resume.pdf
   - Cover Letter: I'm interested in this position
5. Click **"Submit Application"**
6. Check Dashboard to see your application

## 🎯 What You Can Do Now

### As Job Seeker:
- ✅ Browse and search jobs
- ✅ Apply for jobs with resume and cover letter
- ✅ Track application status in Dashboard
- ✅ Update profile information

### As Employer:
- ✅ Post new job listings
- ✅ View all your posted jobs
- ✅ See applications for your jobs
- ✅ Update application status
- ✅ Edit or delete job postings

## 🔧 Troubleshooting

### Backend won't start?

**Problem:** `MongoNetworkError: failed to connect`

**Solution:**
- Ensure MongoDB is running
- Check `MONGO_URI` in `backend/.env`
- Try: `MONGO_URI=mongodb://127.0.0.1:27017/job-portal`

---

**Problem:** `Port 5000 already in use`

**Solution:**
- Change PORT in `backend/.env` to 5001
- Update `REACT_APP_API_URL` in `frontend/.env` to match

---

### Frontend won't start?

**Problem:** Tailwind styles not loading

**Solution:**
```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms
npm start
```

---

**Problem:** API calls failing

**Solution:**
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in `frontend/.env`
- Clear browser cache and localStorage

---

### Can't login?

**Solution:**
- Clear browser localStorage (F12 → Application → Local Storage → Clear)
- Try registering a new account
- Check backend console for errors

## 📱 Access the Application

Once both servers are running:

1. **Homepage:** http://localhost:3000
2. **Login:** http://localhost:3000/login
3. **Register:** http://localhost:3000/register
4. **Browse Jobs:** http://localhost:3000/jobs
5. **Dashboard:** http://localhost:3000/dashboard (after login)
6. **Profile:** http://localhost:3000/profile (after login)

## 🎨 Features to Explore

### Search & Filter Jobs
- Search by job title or keywords
- Filter by location, job type, category
- Sort by date posted

### Application Tracking
- View all your applications
- See application status updates
- Track which jobs you've applied to

### Job Management (Employers)
- Create, edit, delete job postings
- View applications for each job
- Update application status

### Profile Management
- Update personal information
- Change password
- View account details

## 📚 Next Steps

1. **Read Full Documentation:**
   - `README.md` - Complete project overview
   - `SETUP.md` - Detailed setup instructions
   - `API_DOCUMENTATION.md` - API endpoints reference

2. **Customize the Application:**
   - Modify colors in `frontend/tailwind.config.js`
   - Update components in `frontend/src/components`
   - Add new features as needed

3. **Deploy to Production:**
   - Follow deployment guides in `README.md`
   - Set up MongoDB Atlas for production database
   - Deploy backend to Heroku/Railway
   - Deploy frontend to Vercel/Netlify

## 🆘 Need Help?

### Common Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev         # Start development server
npm start           # Start production server

# Frontend
cd frontend
npm install          # Install dependencies
npm start           # Start development server
npm run build       # Build for production

# MongoDB
mongod              # Start MongoDB
mongo               # Open MongoDB shell
```

### Check if Services are Running

```bash
# Check if backend is running
curl http://localhost:5000

# Check if MongoDB is running (Windows)
sc query MongoDB

# Check if MongoDB is running (Mac/Linux)
sudo systemctl status mongod
```

## 🎊 Success!

You now have a fully functional Job Portal application running locally!

**Test Accounts Created:**
- Employer: employer@test.com / test123
- Job Seeker: jobseeker@test.com / test123

**What's Working:**
- ✅ User authentication (JWT)
- ✅ Role-based access control
- ✅ Job posting and browsing
- ✅ Job applications
- ✅ Dashboard analytics
- ✅ Profile management
- ✅ Search and filters

Happy coding! 🚀

---

**Pro Tip:** Keep both terminal windows open - one for backend, one for frontend. Both need to be running for the application to work!
