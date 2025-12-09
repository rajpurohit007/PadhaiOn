// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // HELPER: Safely extract User ID from token
// // This fixes the issue where the token structure ({user: {id: ...}}) didn't match what middleware expected ({id: ...})
// const getUserIdFromToken = (decoded) => {
//   if (decoded.user && decoded.user.id) {
//     return decoded.user.id;
//   }
//   return decoded.id;
// };

// // Verify admin role
// const isAdmin = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({ message: "No authentication token, access denied" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = getUserIdFromToken(decoded);
    
//     const user = await User.findById(userId).select("-password");

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     if (user.userType !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admin only." });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Admin Auth Error:", error.message);
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

// // Verify institution role
// const isInstitution = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({ message: "No authentication token, access denied" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = getUserIdFromToken(decoded);

//     const user = await User.findById(userId).select("-password");

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     if (user.userType !== "institution") {
//       return res.status(403).json({ message: "Access denied. Institution only." });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Institution Auth Error:", error.message);
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

// // Verify student role
// const isStudent = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({ message: "No authentication token, access denied" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = getUserIdFromToken(decoded);

//     const user = await User.findById(userId).select("-password");

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     if (user.userType !== "student") {
//       return res.status(403).json({ message: "Access denied. Student only." });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Student Auth Error:", error.message);
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

// // Verify any authenticated user
// const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({ message: "No authentication token, access denied" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = getUserIdFromToken(decoded);

//     const user = await User.findById(userId).select("-password");

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Auth Error:", error.message);
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

// module.exports = {
//   isAdmin,
//   isInstitution,
//   isStudent,
//   isAuthenticated,
// };
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Institution = require("../models/Institution");

// Helper to extract ID
const getUserIdFromToken = (decoded) => {
  if (decoded.user && decoded.user.id) {
    return decoded.user.id;
  }
  return decoded.id;
};

// 1. Verify Admin
const isAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token, access denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = getUserIdFromToken(decoded);
    
    const user = await User.findById(userId).select("-password");

    if (!user || user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// 2. Verify Institution
const isInstitution = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = getUserIdFromToken(decoded);

    const institution = await Institution.findById(userId).select("-password");

    if (!institution) {
      return res.status(401).json({ message: "Institution not found" });
    }

    req.user = institution;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// 3. Verify Student
const isStudent = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = getUserIdFromToken(decoded);

    const user = await User.findById(userId).select("-password");

    if (!user || user.userType !== "student") {
      return res.status(403).json({ message: "Access denied. Student only." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// 4. General Authentication
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = getUserIdFromToken(decoded);
    const userType = decoded.user?.userType || decoded.userType;

    let user;

    if (userType === 'institution') {
        user = await Institution.findById(userId).select("-password");
    } else {
        user = await User.findById(userId).select("-password");
    }

    if (!user) {
      return res.status(401).json({ message: "User/Institution not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = {
  isAdmin,
  isInstitution,
  isStudent,
  isAuthenticated,
};