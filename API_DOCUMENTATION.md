# Job Portal API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "jobseeker" // or "employer"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "jobseeker"
  }
}
```

---

### Login User
**POST** `/auth/login`

Authenticate and login a user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "jobseeker"
  }
}
```

---

### Get Current User
**GET** `/auth/me`

Get currently logged in user details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "jobseeker",
    "createdAt": "2021-06-25T10:30:00.000Z"
  }
}
```

---

### Logout User
**GET** `/auth/logout`

Logout current user and clear cookie.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

---

## Job Endpoints

### Get All Jobs
**GET** `/jobs`

Get all job listings with optional filters.

**Query Parameters:**
- `search` - Search in title and description
- `location` - Filter by location
- `jobType` - Filter by job type (Full-time, Part-time, etc.)
- `category` - Filter by category
- `experience` - Filter by experience level

**Example:**
```
GET /jobs?search=developer&location=New York&jobType=Full-time
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "title": "Senior Software Developer",
      "description": "We are looking for an experienced developer...",
      "salary": 120000,
      "location": "New York, NY",
      "jobType": "Full-time",
      "category": "Information Technology",
      "experience": "5 Years+",
      "skills": ["JavaScript", "React", "Node.js"],
      "deadline": "2024-12-31T00:00:00.000Z",
      "employer": {
        "_id": "60d5ec49f1b2c72b8c8e4f1c",
        "name": "Tech Company Inc",
        "email": "hr@techcompany.com"
      },
      "status": "active",
      "createdAt": "2021-06-25T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Job
**GET** `/jobs/:id`

Get details of a specific job.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1b",
    "title": "Senior Software Developer",
    "description": "We are looking for an experienced developer...",
    "salary": 120000,
    "location": "New York, NY",
    "jobType": "Full-time",
    "category": "Information Technology",
    "experience": "5 Years+",
    "skills": ["JavaScript", "React", "Node.js"],
    "deadline": "2024-12-31T00:00:00.000Z",
    "employer": {
      "_id": "60d5ec49f1b2c72b8c8e4f1c",
      "name": "Tech Company Inc",
      "email": "hr@techcompany.com"
    },
    "status": "active",
    "createdAt": "2021-06-25T10:30:00.000Z"
  }
}
```

---

### Create Job
**POST** `/jobs`

Create a new job posting (Employer only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Senior Software Developer",
  "description": "We are looking for an experienced developer...",
  "salary": 120000,
  "location": "New York, NY",
  "jobType": "Full-time",
  "category": "Information Technology",
  "experience": "5 Years+",
  "skills": ["JavaScript", "React", "Node.js"],
  "deadline": "2024-12-31"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1b",
    "title": "Senior Software Developer",
    ...
  }
}
```

---

### Update Job
**PUT** `/jobs/:id`

Update a job posting (Employer/Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Job Title",
  "salary": 130000,
  "status": "inactive"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1b",
    "title": "Updated Job Title",
    ...
  }
}
```

---

### Delete Job
**DELETE** `/jobs/:id`

Delete a job posting (Employer/Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

---

### Get My Jobs
**GET** `/jobs/my-jobs`

Get all jobs posted by the logged-in employer.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

---

## Application Endpoints

### Submit Application
**POST** `/applications`

Submit a job application (Job Seeker only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "job": "60d5ec49f1b2c72b8c8e4f1b",
  "resume": "https://example.com/resume.pdf",
  "coverLetter": "I am very interested in this position..."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1d",
    "job": "60d5ec49f1b2c72b8c8e4f1b",
    "applicant": "60d5ec49f1b2c72b8c8e4f1a",
    "resume": "https://example.com/resume.pdf",
    "coverLetter": "I am very interested in this position...",
    "status": "pending",
    "appliedAt": "2021-06-25T10:30:00.000Z"
  }
}
```

---

### Get My Applications
**GET** `/applications/my-applications`

Get all applications submitted by the logged-in job seeker.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1d",
      "job": {
        "_id": "60d5ec49f1b2c72b8c8e4f1b",
        "title": "Senior Software Developer",
        "location": "New York, NY",
        "salary": 120000,
        "jobType": "Full-time",
        "employer": {
          "_id": "60d5ec49f1b2c72b8c8e4f1c",
          "name": "Tech Company Inc"
        }
      },
      "status": "pending",
      "appliedAt": "2021-06-25T10:30:00.000Z"
    }
  ]
}
```

---

### Get Job Applications
**GET** `/applications/job/:jobId`

Get all applications for a specific job (Employer/Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1d",
      "applicant": {
        "_id": "60d5ec49f1b2c72b8c8e4f1a",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": {
          "url": "https://..."
        }
      },
      "resume": "https://example.com/resume.pdf",
      "coverLetter": "I am very interested...",
      "status": "pending",
      "appliedAt": "2021-06-25T10:30:00.000Z"
    }
  ]
}
```

---

### Update Application Status
**PUT** `/applications/:id`

Update application status (Employer/Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "shortlisted" // pending, reviewing, shortlisted, interviewing, selected, rejected
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1d",
    "status": "shortlisted",
    ...
  }
}
```

---

### Delete Application
**DELETE** `/applications/:id`

Delete an application.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

---

## User Endpoints

### Get All Users
**GET** `/users`

Get all users (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 50,
  "data": [...]
}
```

---

### Get Single User
**GET** `/users/:id`

Get a specific user (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "jobseeker",
    "createdAt": "2021-06-25T10:30:00.000Z"
  }
}
```

---

### Update User
**PUT** `/users/:id`

Update user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Updated",
    "email": "johnupdated@example.com",
    ...
  }
}
```

---

### Update Password
**PUT** `/users/update-password`

Update user password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

---

### Delete User
**DELETE** `/users/:id`

Delete a user (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

**Response (4xx/5xx):**
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

### Common Error Codes

- **400** - Bad Request (Invalid input)
- **401** - Unauthorized (Invalid/missing token)
- **403** - Forbidden (Insufficient permissions)
- **404** - Not Found (Resource doesn't exist)
- **500** - Internal Server Error

---

## Status Values

### Application Status
- `pending` - Application submitted, awaiting review
- `reviewing` - Application is being reviewed
- `shortlisted` - Candidate has been shortlisted
- `interviewing` - Candidate is in interview process
- `selected` - Candidate has been selected
- `rejected` - Application has been rejected

### Job Status
- `active` - Job is currently accepting applications
- `inactive` - Job is not accepting applications
- `filled` - Position has been filled

---

## Testing with Postman

1. Import the API endpoints into Postman
2. Set base URL as environment variable: `{{base_url}} = http://localhost:5000/api/v1`
3. For protected routes:
   - First login to get token
   - Add token to Authorization header: `Bearer {{token}}`
4. Test all CRUD operations

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider adding rate limiting middleware to prevent abuse.

---

## Pagination

Pagination is not currently implemented but can be added using query parameters:
- `page` - Page number
- `limit` - Items per page

Example: `/jobs?page=2&limit=10`
