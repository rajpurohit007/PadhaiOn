import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, Calendar, MessageSquare, Star, Bell, CheckCircle, Megaphone } from 'lucide-react';
import { studentAPI, consultationsAPI } from "../services/api";

export default function StudentDashboard({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [consultations, setConsultations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || user.userType !== "student") {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch consultations
      const consultationsRes = await consultationsAPI.getAll({ userId: user.id });
      setConsultations(consultationsRes.data.data || []);

      // Fetch notifications
      const notificationsRes = await studentAPI.getNotifications();
      setNotifications(notificationsRes.data.data || []);
      setUnreadCount(notificationsRes.data.unreadCount || 0);

      // Fetch reviews
      const reviewsRes = await studentAPI.getReviews();
      setReviews(reviewsRes.data.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await studentAPI.markNotificationRead(notificationId);
      fetchDashboardData();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await studentAPI.markAllNotificationsRead();
      fetchDashboardData();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">My Consultations</p>
                <p className="text-2xl font-bold text-gray-900">{consultations.length}</p>
              </div>
              <Calendar className="h-10 w-10 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">My Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
              <Star className="h-10 w-10 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <Bell className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
              <MessageSquare className="h-10 w-10 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {["overview", "consultations", "reviews", "notifications"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium capitalize whitespace-nowrap ${
                    activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                  {tab === "notifications" && unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <h3 className="font-semibold mb-2 text-blue-900">Quick Actions</h3>
                      <div className="space-y-2">
                        <Link
                          to="/institutions"
                          className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
                        >
                          Browse Institutions
                        </Link>
                        <Link
                          to="/book-consultation"
                          className="block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
                        >
                          Book Consultation
                        </Link>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 bg-purple-50">
                      <h3 className="font-semibold mb-2 text-purple-900">Recent Activity</h3>
                      {notifications.length > 0 ? (
                        <div className="space-y-2">
                          {notifications.slice(0, 3).map((notification) => (
                            <div key={notification._id} className="text-sm text-gray-700 border-b pb-2">
                              <p className="font-medium">{notification.title}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No recent activity</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "consultations" && (
              <div>
                <h2 className="text-xl font-bold mb-4">My Consultations</h2>
                {consultations.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No consultations booked yet</p>
                    <Link
                      to="/book-consultation"
                      className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Book Your First Consultation
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {consultations.map((consultation) => (
                      <div key={consultation._id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg capitalize">
                              {consultation.consultationType.replace(/-/g, " ")}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Requested: {consultation.selectedDate} at {consultation.selectedTime}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                            {consultation.status}
                          </span>
                        </div>
                        
                        {consultation.status === "approved" && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                            <p className="text-sm font-medium text-green-900 mb-2">✓ Consultation Scheduled</p>
                            <p className="text-sm text-green-800">
                              <strong>Date:</strong> {consultation.scheduledDate} at {consultation.scheduledTime}
                            </p>
                            <p className="text-sm text-green-800">
                              <strong>Mode:</strong> {consultation.meetingType}
                            </p>
                            {consultation.meetingLink && (
                              <p className="text-sm text-green-800">
                                <strong>Link:</strong>{" "}
                                <a href={consultation.meetingLink} target="_blank" rel="noopener noreferrer" className="underline">
                                  Join Meeting
                                </a>
                              </p>
                            )}
                            {consultation.meetingLocation && (
                              <p className="text-sm text-green-800">
                                <strong>Location:</strong> {consultation.meetingLocation}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {consultation.status === "rejected" && consultation.rejectionReason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                            <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason:</p>
                            <p className="text-sm text-red-800">{consultation.rejectionReason}</p>
                          </div>
                        )}
                        
                        {consultation.message && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">
                              <strong>Your Message:</strong> {consultation.message}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h2 className="text-xl font-bold mb-4">My Reviews</h2>
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">You haven't written any reviews yet</p>
                    <Link
                      to="/institutions"
                      className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Browse Institutions
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="font-semibold text-gray-900">{review.rating}/5</span>
                        </div>
                        <h3 className="font-semibold text-lg">{review.institutionId?.name || "Institution"}</h3>
                        <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Posted on {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Notifications</h2>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => {
                      const isPadhaiOnOfficial = notification.type === 'admin_broadcast' || notification.type === 'admin_message';
                      return (
                        <div
                          key={notification._id}
                          className={`border rounded-lg p-4 relative transition-all duration-200 ${
                            isPadhaiOnOfficial 
                              ? "bg-purple-50 border-purple-300 shadow-sm" 
                              : (notification.isRead ? "bg-white" : "bg-blue-50 border-blue-200")
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {isPadhaiOnOfficial && (
                                    <Megaphone className="h-4 w-4 text-purple-600" />
                                )}
                                <h3 className={`font-semibold ${isPadhaiOnOfficial ? 'text-purple-900' : 'text-gray-900'}`}>
                                    {notification.title}
                                </h3>
                                {isPadhaiOnOfficial && (
                                    <span className="bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                        Official
                                    </span>
                                )}
                                {!notification.isRead && !isPadhaiOnOfficial && (
                                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">New</span>
                                )}
                              </div>
                              <p className={`text-sm ${isPadhaiOnOfficial ? 'text-purple-800' : 'text-gray-600'}`}>
                                  {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification._id)}
                                className="ml-4 text-blue-600 hover:text-blue-800"
                                title="Mark as read"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}