import React, { useState } from "react";
import { LogOut, LayoutDashboard, Users, BookOpen, Clock, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// 🚀 FIX: Renamed the imported component to avoid conflict 
// and fixed the import path assumption.
import AdminPanelContent from "../components/AdminPanelContent"; 

// Sidebar Nav Items (Unchanged)
const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
  { name: "Users & Students", icon: Users, path: "users" },
  { name: "Institutions", icon: BookOpen, path: "institutions" },
  { name: "Requests", icon: Clock, path: "requests" },
  { name: "Settings", icon: Settings, path: "settings" },
];

export default function AdminDashboard({ setUser }) { // This is the main layout component
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all user data and token
    localStorage.removeItem("padhaiOn_token");
    localStorage.removeItem("padhaiOn_user");
    setUser(null); // Clear state in App.jsx
    navigate("/admin-panel"); // Redirect to the admin login page
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* 1. Sidebar (Unchanged) */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-center text-2xl font-bold bg-blue-600">
          PadhaiOn Admin
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to="#" 
              onClick={() => setActiveTab(item.path)}
              className={`flex items-center p-3 rounded-lg transition duration-150 ${
                activeTab === item.path 
                  ? "bg-blue-700 text-white font-semibold shadow-md" 
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout Button (Unchanged) */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 rounded-lg text-red-300 hover:bg-red-700 transition duration-150"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area (Unchanged) */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-semibold text-gray-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h1>
          <div className="text-gray-600">
            Welcome, Administrator
          </div>
        </header>
        
        {/* 🚀 FIX: Use the correctly imported content component */}
        <div className="mt-8">
          <AdminPanelContent activeTab={activeTab} />
        </div>
      </main>
    </div>
  );
}