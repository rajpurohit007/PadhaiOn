# Padhaion - Corrected Architecture

## ✅ CORRECTED REGISTRATION & LOGIN FLOW

### Core Principle
- **User Collection**: Stores ALL authentication (students, admins, institution accounts)
- **Institution Collection**: Stores ONLY profile data, NOT authentication data
- **InstitutionRequest Collection**: Temporary pending registrations

---

## 📋 Registration Flow

### Student Registration
1. User fills student registration form
2. Creates **User** document with:
   - name, email, password (hashed)
   - userType: "student"
   - phone, bio, location, education, etc.

### Institution Registration  
1. Institution fills registration form → **InstitutionRequest** (pending)
2. Stores: institutionName, email, phone, category, location, city, specialization, etc.
3. Status: "pending" (waiting for admin approval)

### Admin Approves Institution
1. Admin approves InstitutionRequest
2. **Step 1**: Create **User** account (authentication):
   - name: institutionName
   - email: institution email
   - password: auto-generated (sent via email)
   - userType: "institution"
   - institutionId: [reference to Institution]

3. **Step 2**: Create **Institution** profile (data only):
   - name, category, location, city, specialization, etc.
   - contact.email, contact.phone (NOT authentication)
   - ownerId: [reference to User account]
   - isVerified: true

4. **Step 3**: Delete InstitutionRequest
5. Send credentials email to institution

---

## 🔐 Login Flow

### Login Endpoint: `POST /api/users/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "userType": "student" // or "institution" or "admin"
}
```

**Process:**
1. Query **User** collection with email (ALL authentication here)
2. Verify password with bcrypt
3. Verify userType matches (if provided)
4. If institution user (userType="institution") and has institutionId:
   - Fetch **Institution** profile data
   - Return in response

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "data": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "userType": "institution", // or "student", "admin"
    "phone": "...",
    "institutionId": "institution_id",
    "institutionData": { // If institution user
      "name": "Institution Name",
      "category": "College",
      "location": "...",
      "rating": 4.5,
      ...
    }
  }
}
```

---

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  userType: "student" | "admin" | "institution",
  
  // Only if institution
  institutionId: ObjectId (ref: Institution),
  
  // Student specific
  bio: String,
  location: String,
  education: [Array],
  avatar: String,
  
  createdAt, updatedAt
}
```

### Institution Collection
```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  location: String,
  city: String,
  specialization: String,
  established: Number,
  totalStudents: Number,
  rating: Number,
  
  // Contact info (NOT authentication)
  contact: {
    phone: String,
    email: String
  },
  
  // Profile data
  description: String,
  features: [String],
  thumbnailUrl: String,
  galleryUrls: [String],
  
  // Link to User account
  ownerId: ObjectId (ref: User),
  
  // Status
  isActive: Boolean,
  isVerified: Boolean,
  
  createdAt, updatedAt
}
```

### InstitutionRequest Collection
```javascript
{
  _id: ObjectId,
  institutionName: String,
  email: String,
  phone: String,
  category: String,
  location: String,
  city: String,
  specialization: String,
  established: Number,
  totalStudents: Number,
  description: String,
  
  status: "pending" | "approved" | "rejected",
  
  createdAt, updatedAt
}
```

---

## 🔄 Comparison: WRONG vs CORRECT

### ❌ WRONG (What Was Done)
- Institution model had email, password fields
- Login queried Institution collection directly
- Approval created Institution only (no User)
- Institution was authentication entity

### ✅ CORRECT (Current)
- Institution model has contact.email only (not for auth)
- Login queries User collection for all users
- Approval creates User + Institution + links them
- User is authentication entity
- Institution is profile/data entity

---

## 🛠️ Admin Endpoints

### Approve Institution Request
```
POST /api/admin/institution-requests/:id/approve
```
- Creates User (institution type) + Institution profile
- Links them via institutionId / ownerId
- Generates password, sends email
- Deletes InstitutionRequest

### Cleanup (Debug)
```
POST /api/admin/institution-requests/:id/cleanup
```
- Deletes User account (not Institution)
- Useful for removing failed approvals

### Debug
```
GET /api/admin/institution-requests/:id/debug
```
- Shows InstitutionRequest details
- Checks for existing User (not Institution)
- Shows if approval can proceed

---

## ✅ Key Points
1. **All authentication in User collection** - consistent, simple
2. **Institution is pure data** - no password/auth fields
3. **Admin creates both User + Institution** - proper linking
4. **Login fetches Institution data** - users can see institution profile
5. **Separation of concerns** - auth vs profile data

---

## 🚀 Verification Checklist
- [ ] Institution.js has no email/password fields
- [ ] User.js can reference institutionId
- [ ] Login route queries User collection only
- [ ] Admin approval creates User + Institution
- [ ] Admin cleanup deletes User (not Institution)
- [ ] Debug endpoint checks User (not Institution)
- [ ] Frontend login accepts userType parameter
- [ ] Institution profile data fetched and returned on login

