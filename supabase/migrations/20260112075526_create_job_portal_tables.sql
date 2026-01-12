/*
  # Job Application & Hiring Portal Database Schema

  1. New Tables
    - `users`
      - `user_id` (serial, primary key)
      - `name` (varchar, not null)
      - `email` (varchar, unique, not null)
      - `password` (text, not null - will store hashed passwords)
      - `role` (varchar, default 'candidate' - values: 'admin' or 'candidate')
      - `created_at` (timestamp, default now)
    
    - `jobs`
      - `job_id` (serial, primary key)
      - `title` (varchar, not null)
      - `description` (text, not null)
      - `location` (varchar)
      - `job_type` (varchar - Full-time/Internship/Remote)
      - `created_by` (int, foreign key to users)
      - `created_at` (timestamp, default now)
    
    - `applications`
      - `application_id` (serial, primary key)
      - `user_id` (int, foreign key to users)
      - `job_id` (int, foreign key to jobs)
      - `applied_at` (timestamp, default now)
      - Unique constraint on (user_id, job_id) to prevent duplicate applications
    
    - `favourites`
      - `favourite_id` (serial, primary key)
      - `user_id` (int, foreign key to users)
      - `job_id` (int, foreign key to jobs)
      - `saved_at` (timestamp, default now)
      - Unique constraint on (user_id, job_id) to prevent duplicate saves

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'candidate',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_role CHECK (role IN ('admin', 'candidate'))
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  job_id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(100),
  job_type VARCHAR(30),
  created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  application_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  job_id INT REFERENCES jobs(job_id) ON DELETE CASCADE,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, job_id)
);

-- Create favourites table
CREATE TABLE IF NOT EXISTS favourites (
  favourite_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  job_id INT REFERENCES jobs(job_id) ON DELETE CASCADE,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, job_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Anyone can register"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for jobs table
CREATE POLICY "Anyone can view jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can create jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE user_id = created_by 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE user_id = created_by 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admin can delete own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE user_id = created_by 
      AND role = 'admin'
    )
  );

-- RLS Policies for applications table
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Candidates can apply to jobs"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE user_id = applications.user_id 
      AND role = 'candidate'
    )
  );

CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- RLS Policies for favourites table
CREATE POLICY "Users can view own favourites"
  ON favourites FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Candidates can save jobs"
  ON favourites FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE user_id = favourites.user_id 
      AND role = 'candidate'
    )
  );

CREATE POLICY "Users can remove own favourites"
  ON favourites FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_favourites_user_id ON favourites(user_id);
CREATE INDEX IF NOT EXISTS idx_favourites_job_id ON favourites(job_id);