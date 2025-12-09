"use client"

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"
import { Calendar, User, Clock, ArrowLeft, Share2, BookOpen } from "lucide-react"
import { blogsAPI, getImageUrl } from "../services/api" // 🚀 IMPORTED getImageUrl

export default function BlogPost() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true)
        const response = await blogsAPI.getById(id)
        
        // 🚀 FIX: Access .data.data (The actual blog object), not just .data (The response wrapper)
        const blogData = response.data.data || response.data; 
        setBlog(blogData)

        // Fetch related posts from same category
        if (blogData.category) {
          const relatedResponse = await blogsAPI.getAll({ category: blogData.category, limit: 3 })
          // Filter out current post
          const related = (relatedResponse.data.data || []).filter((b) => b._id !== id).slice(0, 3);
          setRelatedPosts(related)
        }
      } catch (err) {
        console.error("Error fetching blog post:", err)
        setError("Failed to load blog post")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPost()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h2>
          <Link to="/blog" className="text-blue-600 hover:text-blue-700">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        <div className="mb-8">
          <img
            // 🚀 FIX: Use getImageUrl for the main image
            src={getImageUrl(blog.image)}
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
            onError={(e) => {e.target.src = "/placeholder.svg"}}
          />
        </div>

        <header className="mb-8">
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">{blog.category}</span>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(blog.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{blog.readTime}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{blog.author}</p>
                <p className="text-sm text-gray-600">Education Consultant</p>
              </div>
            </div>

            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Share2 className="h-5 w-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed font-semibold">{blog.excerpt}</p>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">{blog.content}</div>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link key={post._id} to={`/blog/${post._id}`} className="group">
                  <img
                    // 🚀 FIX: Use getImageUrl for related posts
                    src={getImageUrl(post.image)}
                    alt={post.title}
                    className="w-full h-32 object-cover rounded-lg mb-3 group-hover:shadow-lg transition-shadow"
                    onError={(e) => {e.target.src = "/placeholder.svg"}}
                  />
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{post.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-600 rounded-lg p-8 text-center text-white mt-12">
          <h2 className="text-2xl font-bold mb-4">Need Personalized Guidance?</h2>
          <p className="text-blue-100 mb-6">
            Get expert advice tailored to your specific academic goals and challenges.
          </p>
          <Link
            to="/book-consultation"
            className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Book Free Consultation
          </Link>
        </div>
      </article>
    </div>
  )
}