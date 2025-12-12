"use client"

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "./components/NavBar"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"; // IMPORTED NEW COMPONENT
import GlobalSuspensionModal from './components/GlobalSuspensionModal';
// Pages
import Home from "./pages/Home"
import Institutions from "./pages/Institutions"
import Blog from "./pages/Blog"
import BookConsultation from "./pages/BookConsultation"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import InstitutionDetail from "./pages/InstitutionDetail"
import BlogPost from "./pages/BlogPost"
import AdminDashboard from "./pages/AdminDashboard"
import InstitutionDashboard from "./pages/InstitutionDashboard"
import StudentDashboard from "./pages/StudentDashboard"
import AboutUs from './pages/AboutUs';
import CareerLibrary from './pages/CareerLibrary';
import AdminLoginPage from "./pages/AdminLoginPage"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session from localStorage
    const savedUser = localStorage.getItem("padhaiOn_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("padhaiOn_user")
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Helper to reset scroll on route change */}
        <GlobalSuspensionModal />
        <ScrollToTop />
        
        {/* Notifications */}
        <Toaster position="top-right" reverseOrder={false} />

        <Navbar user={user} setUser={setUser} />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/institutions" element={<Institutions />} />
            <Route path="/institutions/:id" element={<InstitutionDetail user={user} />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/book-consultation" element={<BookConsultation user={user} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/career-library" element={<CareerLibrary />} />
            {/* 🚀 START: LOGIN REDIRECTION LOGIC 🚀 */}
            <Route
                path="/admin-panel"
                element={
                    user ? (
                        // If user is already logged in, redirect them based on type (Admin -> Dashboard)
                        user.userType === "admin" ? (
                            <Navigate to="/admin-dashboard" replace />
                        ) : (
                            // Block non-admin users from seeing the admin login page
                            <Navigate to="/login" replace /> 
                        )
                    ) : (
                        // If not logged in, show the dedicated Admin Login Component
                        <AdminLoginPage setUser={setUser} /> 
                    )
                }
            />
            <Route
                path="/login"
                element={
                    user ? (
                        // Block admin access here (redundant, but good to keep clean)
                        user.userType === "admin" ? (
                            <Navigate to="/admin-panel" replace />
                        ) : user.userType === "institution" ? (
                            <Navigate to="/institution-dashboard" replace />
                        ) : user.userType === "student" ? (
                            <Navigate to="/student-dashboard" replace />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    ) : (
                        // If user is NOT logged in, render the general Login component
                        <Login setUser={setUser} user={user} />
                    )
                }
            />
            {/* 🚀 END: LOGIN REDIRECTION LOGIC 🚀 */}
            
            <Route path="/profile" element={<Profile user={user} />} />
            
            <Route
              path="/admin-dashboard"
              element={user?.userType === "admin" ? <AdminDashboard user={user} /> : <Navigate to="/login" replace />}
            />
            
            <Route
              path="/institution-dashboard"
              element={
                user?.userType === "institution" ? (
                  <InstitutionDashboard user={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            
            <Route
              path="/student-dashboard"
              element={
                user?.userType === "student" ? <StudentDashboard user={user} /> : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App