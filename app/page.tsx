"use client"

import { useEffect } from "react"

export default function Page() {
  useEffect(() => {
    // Redirect to the frontend app information
    console.log("PadhaiOn MERN Stack Application")
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 shadow-2xl">
          <h1 className="text-5xl font-bold mb-6">🎓 PadhaiOn</h1>
          <h2 className="text-3xl font-semibold mb-8">MERN Stack Educational Platform</h2>

          <div className="bg-white/20 rounded-xl p-8 mb-8 text-left">
            <h3 className="text-2xl font-bold mb-4">📦 Project Structure</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-yellow-300">📁</span>
                <div>
                  <div className="font-bold">backend/</div>
                  <div className="ml-4 text-blue-200">Node.js + Express + MongoDB API</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-300">📁</span>
                <div>
                  <div className="font-bold">frontend/</div>
                  <div className="ml-4 text-blue-200">React + Vite + Tailwind CSS</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/20 rounded-xl p-8 mb-8 text-left">
            <h3 className="text-2xl font-bold mb-4">🚀 Setup Instructions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-lg mb-2">1. Backend Setup:</h4>
                <div className="bg-black/30 rounded p-4 font-mono text-sm space-y-1">
                  <div>cd backend</div>
                  <div>npm install</div>
                  <div>cp .env.example .env</div>
                  <div>npm run seed</div>
                  <div>npm run dev</div>
                </div>
                <p className="mt-2 text-sm text-blue-200">Backend runs on http://localhost:5000</p>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-2">2. Frontend Setup:</h4>
                <div className="bg-black/30 rounded p-4 font-mono text-sm space-y-1">
                  <div>cd frontend</div>
                  <div>npm install</div>
                  <div>cp .env.example .env</div>
                  <div>npm run dev</div>
                </div>
                <p className="mt-2 text-sm text-blue-200">Frontend runs on http://localhost:5173</p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 rounded-xl p-8 mb-8 text-left">
            <h3 className="text-2xl font-bold mb-4">✨ Features</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <span>🏫</span>
                <span>Browse Institutions</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📝</span>
                <span>Educational Blogs</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>👤</span>
                <span>User Authentication</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span>Book Consultations</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>💬</span>
                <span>Send Inquiries</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⭐</span>
                <span>Testimonials</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-400/20 border-2 border-yellow-400 rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-3">⚠️ Important Note</h3>
            <p className="text-lg leading-relaxed">
              This is a <strong>full MERN stack application</strong> with separate frontend and backend. To run the
              complete application, please download the code and follow the setup instructions above. The backend
              requires MongoDB to be installed and running.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="text-sm text-blue-200">
              <p>📚 Complete documentation available in README.md</p>
              <p>🔧 Backend API docs in backend/README.md</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
