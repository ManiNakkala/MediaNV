# Job Application & Hiring Portal

A full-stack web application for job seekers and recruiters built with MERN stack (PostgreSQL instead of MongoDB) and JWT authentication.

## Features

### For Candidates (Job Seekers)
- Register and login
- Browse all job listings
- Search and filter jobs by title, location, and job type
- View detailed job descriptions
- Apply to jobs (no duplicate applications allowed)
- Save jobs to favourites
- View all applied jobs
- View saved jobs and manage favourites

### For Admin/Recruiter
- Register and login as admin
- Create new job postings
- Edit existing job postings
- Delete job postings
- View all applicants for each job

## Tech Stack

### Frontend
- React.js 18
- React Router v6 for navigation
- Axios for API calls
- Context API for state management
- CSS3 for styling

### Backend
- Node.js
- Express.js
- PostgreSQL (Supabase)
- JWT for authentication
- bcrypt for password hashing
- express-validator for input validation

## Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── jobController.js
│   │   │   ├── applicationController.js
│   │   │   └── favouriteController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── jobRoutes.js
│   │   │   ├── applicationRoutes.js
│   │   │   ├── favouriteRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── axiosInstance.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── JobCard.js
    │   │   └── ProtectedRoute.js
    │   ├── pages/
    │   │   ├── Auth/
    │   │   │   ├── Login.js
    │   │   │   └── Register.js
    │   │   ├── Admin/
    │   │   │   ├── AdminJobs.js
    │   │   │   └── JobForm.js
    │   │   └── User/
    │   │       ├── Jobs.js
    │   │       ├── JobDetails.js
    │   │       ├── MyApplications.js
    │   │       └── MyFavourites.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env
    └── package.json
```

## Database Schema

### Tables

1. **users**
   - user_id (serial primary key)
   - name (varchar)
   - email (varchar, unique)
   - password (text, hashed)
   - role (varchar: 'admin' or 'candidate')
   - created_at (timestamp)

2. **jobs**
   - job_id (serial primary key)
   - title (varchar)
   - description (text)
   - location (varchar)
   - job_type (varchar)
   - created_by (foreign key to users)
   - created_at (timestamp)

3. **applications**
   - application_id (serial primary key)
   - user_id (foreign key to users)
   - job_id (foreign key to jobs)
   - applied_at (timestamp)
   - Unique constraint on (user_id, job_id)

4. **favourites**
   - favourite_id (serial primary key)
   - user_id (foreign key to users)
   - job_id (foreign key to jobs)
   - saved_at (timestamp)
   - Unique constraint on (user_id, job_id)

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Job Routes
- `GET /api/jobs` - Get all jobs (with optional filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Admin only)
- `PUT /api/jobs/:id` - Update job (Admin only)
- `DELETE /api/jobs/:id` - Delete job (Admin only)

### Application Routes
- `POST /api/applications/:jobId` - Apply to job (Candidate only)
- `GET /api/applications/my` - Get my applications (Candidate only)

### Favourite Routes
- `POST /api/favourites/:jobId` - Save job to favourites (Candidate only)
- `DELETE /api/favourites/:jobId` - Remove from favourites (Candidate only)
- `GET /api/favourites/my` - Get my favourites (Candidate only)

### Admin Routes
- `GET /api/admin/jobs/:jobId/applications` - View applicants for a job (Admin only)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database (Supabase instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=5000
```

4. The database tables are already created via Supabase migration

5. Start the backend server:
```bash
npm start
# or for development with nodemon
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the React development server:
```bash
npm start
```

Frontend will run on http://localhost:3000

## Usage

### For Candidates:
1. Register as a candidate
2. Login with your credentials
3. Browse available jobs
4. Use search and filters to find relevant jobs
5. Click on a job to view full details
6. Apply to jobs or save them to favourites
7. Track your applications in "My Applications"
8. Manage saved jobs in "Saved Jobs"

### For Recruiters/Admin:
1. Register as an admin
2. Login with your credentials
3. Create new job postings
4. View, edit, or delete your job postings
5. View all applicants for each job posting

## Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with role-based access control
- Input validation on all forms
- Prevention of duplicate applications and favourites
- Row Level Security (RLS) on database

## Key Features Implementation
- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Separate access for admin and candidates
- **CRUD Operations**: Full create, read, update, delete for jobs
- **Relational Database**: PostgreSQL with proper foreign keys
- **JOIN Queries**: Efficient data retrieval across tables
- **Duplicate Prevention**: Unique constraints on applications and favourites
- **Search & Filter**: Dynamic job filtering
- **Responsive Design**: Mobile-friendly UI

## License
This project is created for educational purposes.
