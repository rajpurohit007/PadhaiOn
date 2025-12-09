# PadhaiOn Backend API

Backend API for the PadhaiOn educational platform built with Node.js, Express, and MongoDB.

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Environment Variables
Create a `.env` file in the backend directory:
\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/padhaion
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
\`\`\`

### 3. Start MongoDB
Make sure MongoDB is running on your system:
\`\`\`bash
# For macOS with Homebrew
brew services start mongodb-community

# For Linux
sudo systemctl start mongod

# For Windows
# Start MongoDB service from Services
\`\`\`

### 4. Seed Database
Populate the database with sample data:
\`\`\`bash
npm run seed
\`\`\`

### 5. Start Server
\`\`\`bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
\`\`\`

The server will run on `http://localhost:5000`

## API Endpoints

### Institutions
- `GET /api/institutions` - Get all institutions (with filters)
- `GET /api/institutions/:id` - Get single institution
- `POST /api/institutions` - Create new institution
- `POST /api/institutions/:id/inquiry` - Send inquiry to institution

### Blogs
- `GET /api/blogs` - Get all blogs (with filters)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create new blog

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create new course

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Consultations
- `GET /api/consultations` - Get all consultations
- `POST /api/consultations` - Book new consultation
- `GET /api/consultations/:id` - Get single consultation

### Contact
- `GET /api/contact` - Get all contact messages
- `POST /api/contact` - Send contact message

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Create new testimonial

## Database Models

- **Institution** - Educational institutions data
- **Blog** - Blog posts and articles
- **Course** - Course offerings
- **User** - User accounts and profiles
- **Consultation** - Consultation bookings
- **Contact** - Contact form submissions
- **Testimonial** - User testimonials
- **Inquiry** - Institution inquiries
\`\`\`

Now let me create the updated frontend files:
