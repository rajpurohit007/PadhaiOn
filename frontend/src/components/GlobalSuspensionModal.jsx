import React, { useEffect, useState } from 'react';
import { Ban, Mail, Lock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GlobalSuspensionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 🚀 LISTENS FOR THE SUSPENSION SIGNAL
    const handleSuspension = (event) => {
      setMessage(event.detail?.message || "Your account has been suspended.");
      setIsOpen(true);
    };

    window.addEventListener("auth:suspended", handleSuspension);

    return () => {
      window.removeEventListener("auth:suspended", handleSuspension);
    };
  }, []);

  const handleContactSupport = () => {
    window.location.href = "mailto:padhaion@gmail.com?subject=Account Suspension Appeal";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-red-50 p-6 flex justify-center border-b border-red-100">
          <div className="relative">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <Ban className="w-10 h-10 text-red-600" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-sm">
              <Lock className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Suspended</h2>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            {message}
          </p>

          <div className="space-y-3">
            <button 
              onClick={handleContactSupport}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-200"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </button>
            
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Please contact <span className="font-semibold text-gray-600">padhaion@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}