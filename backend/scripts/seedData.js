const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Institution = require("../models/Institution")
const Blog = require("../models/Blog")
const Course = require("../models/Course")
const Testimonial = require("../models/Testimonial")

dotenv.config()

// Sample data
const institutions = [
  {
    name: "TechEd Academy",
    category: "Coaching Center",
    location: "Andheri West, Mumbai",
    city: "Mumbai",
    rating: 4.8,
    totalStudents: 2847,
    specialization: "Engineering & Medical Entrance",
    established: 2010,
    image: "https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=400",
    contact: {
      phone: "+91 98765 43210",
      email: "info@techedacademy.com",
    },
    features: [
      "Expert Faculty",
      "Small Batch Size",
      "Mock Tests",
      "Study Material",
      "Doubt Sessions",
      "Online Classes",
    ],
  },
  {
    name: "St. Xavier's College",
    category: "College",
    location: "Fort, Mumbai",
    city: "Mumbai",
    rating: 4.7,
    totalStudents: 8500,
    specialization: "Arts, Science & Commerce",
    established: 1869,
    image: "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400",
    contact: {
      phone: "+91 98765 43211",
      email: "admissions@xaviers.edu",
    },
    features: [
      "NAAC A+ Accredited",
      "Industry Partnerships",
      "Research Programs",
      "Sports Facilities",
      "Cultural Activities",
      "Placement Cell",
    ],
  },
  {
    name: "Delhi Public School",
    category: "School",
    location: "Vasant Vihar, Delhi",
    city: "Delhi",
    rating: 4.9,
    totalStudents: 3200,
    specialization: "CBSE Curriculum",
    established: 1949,
    image: "https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=400",
    contact: {
      phone: "+91 98765 43212",
      email: "info@dpsdelhi.com",
    },
    features: ["Smart Classrooms", "Science Labs", "Sports Complex", "Arts & Crafts", "Computer Lab", "Library"],
  },
  {
    name: "IIT Bombay",
    category: "University",
    location: "Powai, Mumbai",
    city: "Mumbai",
    rating: 4.6,
    totalStudents: 12000,
    specialization: "Engineering & Technology",
    established: 1958,
    image: "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400",
    contact: {
      phone: "+91 98765 43213",
      email: "admissions@iitb.ac.in",
    },
    features: [
      "Top Rankings",
      "Research Excellence",
      "Industry Collaboration",
      "International Programs",
      "Innovation Hub",
      "Alumni Network",
    ],
  },
  {
    name: "FIITJEE",
    category: "Coaching Center",
    location: "Lajpat Nagar, Delhi",
    city: "Delhi",
    rating: 4.8,
    totalStudents: 15000,
    specialization: "JEE & NEET Preparation",
    established: 1992,
    image: "https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=400",
    contact: {
      phone: "+91 98765 43214",
      email: "info@fiitjee.com",
    },
    features: [
      "Proven Track Record",
      "Experienced Faculty",
      "Comprehensive Study Material",
      "Regular Tests",
      "Scholarship Programs",
      "Online Support",
    ],
  },
  {
    name: "Bangalore University",
    category: "University",
    location: "Jnanabharathi, Bangalore",
    city: "Bangalore",
    rating: 4.7,
    totalStudents: 45000,
    specialization: "Multi-disciplinary Education",
    established: 1964,
    image: "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400",
    contact: {
      phone: "+91 98765 43215",
      email: "registrar@bangaloreuniversity.ac.in",
    },
    features: [
      "UGC Recognized",
      "Distance Education",
      "Research Centers",
      "International Collaborations",
      "Digital Library",
      "Career Guidance",
    ],
  },
]

const blogs = [
  {
    title: "Top 10 Study Tips for Exam Success",
    excerpt:
      "Discover proven strategies to maximize your study efficiency and ace your upcoming exams with confidence.",
    author: "Dr. Sarah Johnson",
    date: "Jan 15, 2025",
    readTime: "5 min read",
    category: "Study Tips",
    image: "https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    title: "Choosing the Right University: A Complete Guide",
    excerpt:
      "Navigate the complex process of university selection with our comprehensive guide covering all important factors.",
    author: "Prof. Michael Chen",
    date: "Jan 12, 2025",
    readTime: "8 min read",
    category: "University Guide",
    image: "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    title: "Career Opportunities in Technology 2025",
    excerpt: "Explore the most promising tech career paths and skills that will be in high demand this year.",
    author: "Alex Rodriguez",
    date: "Jan 10, 2025",
    readTime: "6 min read",
    category: "Career Advice",
    image: "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    title: "How to Build a Strong Academic Portfolio",
    excerpt:
      "Learn essential strategies for creating an impressive academic portfolio that stands out to universities and employers.",
    author: "Dr. Emily Watson",
    date: "Jan 8, 2025",
    readTime: "7 min read",
    category: "Academic Tips",
    image: "https://images.pexels.com/photos/4050302/pexels-photo-4050302.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    title: "Study Abroad: Everything You Need to Know",
    excerpt:
      "Your complete guide to studying abroad, from application process to cultural adaptation and financial planning.",
    author: "James Wilson",
    date: "Jan 5, 2025",
    readTime: "10 min read",
    category: "Study Abroad",
    image: "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    title: "Time Management Skills for Students",
    excerpt: "Master the art of time management with practical techniques designed specifically for busy students.",
    author: "Lisa Park",
    date: "Jan 3, 2025",
    readTime: "6 min read",
    category: "Study Tips",
    image: "https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
]

const courses = [
  {
    title: "Machine Learning Basics",
    institution: "AI Academy",
    category: "Programming",
    price: 22999,
    rating: 4.5,
    enrolledStudents: 1678,
    duration: "18 weeks",
    level: "Advanced",
    image: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    title: "Graphic Design Portfolio",
    institution: "Creative Studio",
    category: "Design",
    price: 13999,
    rating: 4.8,
    enrolledStudents: 967,
    duration: "14 weeks",
    level: "Beginner",
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    title: "Environmental Science",
    institution: "Green University",
    category: "Science",
    price: 16999,
    rating: 4.6,
    enrolledStudents: 734,
    duration: "16 weeks",
    level: "Intermediate",
    image: "https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
]

const testimonials = [
  {
    name: "Priya Sharma",
    institution: "TechEd Academy",
    rating: 5,
    quote:
      "PadhaiOn helped me find the perfect coaching center for JEE preparation. The consultation was invaluable and I got into my dream college!",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    name: "Rahul Kumar",
    institution: "St. Xavier's College",
    rating: 5,
    quote:
      "The free consultation service is amazing. They understood my career goals and recommended the perfect college for my commerce degree.",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    name: "Anita Singh",
    institution: "Delhi Public School",
    rating: 5,
    quote:
      "PadhaiOn helped us find the best school for our daughter. The detailed information and ratings were very helpful.",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
]

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/padhaion")

    console.log("MongoDB Connected")

    // Clear existing data
    await Institution.deleteMany({})
    await Blog.deleteMany({})
    await Course.deleteMany({})
    await Testimonial.deleteMany({})

    console.log("Existing data cleared")

    // Insert new data
    await Institution.insertMany(institutions)
    console.log("Institutions seeded")

    await Blog.insertMany(blogs)
    console.log("Blogs seeded")

    await Course.insertMany(courses)
    console.log("Courses seeded")

    await Testimonial.insertMany(testimonials)
    console.log("Testimonials seeded")

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
