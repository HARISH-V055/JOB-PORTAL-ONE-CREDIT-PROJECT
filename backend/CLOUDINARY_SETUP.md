# Cloudinary Setup Guide for Resume Upload

## 📄 What is Cloudinary?

Cloudinary is a cloud-based service for storing and managing files (images, videos, documents). We're using it to store resume files (PDF, DOC, DOCX).

## 🆓 Free Tier

- **Storage:** 25GB
- **Bandwidth:** 25GB/month
- **Transformations:** 25,000/month
- **Perfect for development and small projects!**

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com/users/register/free
2. Sign up with your email (or use Google/GitHub)
3. Verify your email
4. Complete the setup wizard

### Step 2: Get Your Credentials

After logging in:

1. Go to **Dashboard** (https://cloudinary.com/console)
2. You'll see your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 3: Add to .env File

Add these lines to `backend/.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### Step 4: Restart Backend Server

```bash
cd backend
npm run dev
```

---

## ✅ Testing Resume Upload

### Test 1: Upload via Frontend

1. Go to http://localhost:3003
2. Login as Job Seeker
3. Click on any job
4. Click "Apply Now"
5. Select "📄 Upload File"
6. Choose a PDF/DOC/DOCX file
7. Submit application

### Test 2: Check Cloudinary Dashboard

1. Go to https://cloudinary.com/console/media_library
2. Navigate to `job-portal/resumes` folder
3. You should see your uploaded resume!

### Test 3: Test API Directly

Using Postman or curl:

```bash
POST http://localhost:5000/api/v1/upload/resume
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
Body (form-data):
  resume: [select file]
```

---

## 📁 File Organization

Resumes are stored in Cloudinary with this structure:

```
job-portal/
  └── resumes/
      ├── resume-USER_ID-TIMESTAMP-1.pdf
      ├── resume-USER_ID-TIMESTAMP-2.docx
      └── ...
```

**Naming Convention:**
- `resume-{userId}-{timestamp}-{random}.{extension}`
- Example: `resume-60d5ec49f1b2c72b8c8e4f1a-1704123456789-123456789.pdf`

---

## 🔒 Security Features

### File Validation

✅ **File Type:** Only PDF, DOC, DOCX allowed  
✅ **File Size:** Maximum 5MB  
✅ **Authentication:** Only logged-in users can upload  
✅ **User-specific:** Files are tagged with user ID  

### Access Control

- Files are stored as `raw` resources (not publicly browsable)
- Only users with the direct URL can access
- URLs are returned in API responses

---

## 📊 Features Implemented

### 1. File Upload
- ✅ Upload PDF, DOC, DOCX files
- ✅ File validation (type and size)
- ✅ Progress indication
- ✅ Error handling

### 2. Dual Upload Method
- ✅ **Option 1:** Upload file directly
- ✅ **Option 2:** Provide URL (Google Drive, Dropbox, etc.)
- ✅ Toggle between methods

### 3. File Management
- ✅ Store file metadata in database
- ✅ Track upload date
- ✅ Delete files from Cloudinary
- ✅ Multiple resume versions support

### 4. User Experience
- ✅ File size display
- ✅ Upload progress
- ✅ Success/error messages
- ✅ File preview information

---

## 🎨 UI Features

### Application Modal

```
┌─────────────────────────────────────┐
│  Resume Submission Method           │
│  ┌──────────────┐  ┌──────────────┐│
│  │ 📄 Upload    │  │ 🔗 Provide   ││
│  │    File      │  │    URL       ││
│  └──────────────┘  └──────────────┘│
│                                     │
│  Upload Resume                      │
│  [Choose File] resume.pdf           │
│  ✓ Selected: resume.pdf (1.2 MB)   │
│  Accepted: PDF, DOC, DOCX (Max 5MB)│
│                                     │
│  Cover Letter (Optional)            │
│  [Text area...]                     │
│                                     │
│  [Cancel]  [Submit Application]     │
└─────────────────────────────────────┘
```

---

## 🔧 API Endpoints

### Upload Resume
```
POST /api/v1/upload/resume
Headers: Authorization: Bearer {token}
Body: multipart/form-data
  - resume: File

Response:
{
  "success": true,
  "data": {
    "public_id": "job-portal/resumes/resume-...",
    "url": "https://res.cloudinary.com/...",
    "filename": "resume.pdf",
    "format": "pdf",
    "size": 1234567
  }
}
```

### Delete Resume
```
DELETE /api/v1/upload/resume/:publicId
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

---

## 📝 Database Schema Updates

### Application Model

```javascript
{
  resume: String,              // URL or uploaded file URL
  resumeFile: {
    public_id: String,         // Cloudinary public ID
    url: String,               // Cloudinary URL
    filename: String,          // Original filename
    format: String,            // File format (pdf, doc, docx)
    uploadedAt: Date          // Upload timestamp
  },
  // ... other fields
}
```

---

## 🚨 Troubleshooting

### Upload Fails

**Error:** "Invalid file type"
- **Solution:** Only PDF, DOC, DOCX files are allowed

**Error:** "File too large"
- **Solution:** File must be under 5MB. Compress your PDF or use a smaller file

**Error:** "Cloudinary configuration error"
- **Solution:** Check your `.env` file has correct credentials

### Files Not Appearing in Cloudinary

1. Check Cloudinary Dashboard → Media Library
2. Navigate to `job-portal/resumes` folder
3. If folder doesn't exist, it will be created on first upload

### Can't Download Resume

- Resumes are stored as `raw` resources
- Click the URL in the application to download
- Employers can access resume URLs from application details

---

## 💡 Advanced Features (Future)

### Possible Enhancements:

1. **Resume Preview**
   - Display PDF in modal
   - Use Cloudinary's document viewer

2. **Multiple Resumes**
   - Allow users to upload multiple versions
   - Select which resume to use per application

3. **Resume Parsing**
   - Extract text from PDF
   - Auto-fill profile information

4. **Virus Scanning**
   - Integrate with antivirus API
   - Scan files before storing

5. **Resume Templates**
   - Provide downloadable templates
   - Help users create better resumes

---

## 📚 Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Multer Documentation](https://github.com/expressjs/multer)
- [File Upload Best Practices](https://cloudinary.com/blog/file_upload_best_practices)

---

## ✅ Checklist

Before going live:

- [ ] Cloudinary account created
- [ ] Credentials added to `.env`
- [ ] Backend server restarted
- [ ] Test file upload works
- [ ] Test file appears in Cloudinary
- [ ] Test application submission
- [ ] Test file download
- [ ] Verify file size limits
- [ ] Verify file type restrictions

---

**Resume upload feature is ready!** 🎉

Users can now upload their resumes directly or provide URLs!
