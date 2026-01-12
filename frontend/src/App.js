import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Jobs from './pages/User/Jobs';
import JobDetails from './pages/User/JobDetails';
import MyApplications from './pages/User/MyApplications';
import MyFavourites from './pages/User/MyFavourites';
import AdminJobs from './pages/Admin/AdminJobs';
import JobForm from './pages/Admin/JobForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/jobs"
              element={
                <ProtectedRoute requireCandidate={true}>
                  <Jobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:id"
              element={
                <ProtectedRoute requireCandidate={true}>
                  <JobDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute requireCandidate={true}>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-favourites"
              element={
                <ProtectedRoute requireCandidate={true}>
                  <MyFavourites />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs/new"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <JobForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs/edit/:id"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <JobForm />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
