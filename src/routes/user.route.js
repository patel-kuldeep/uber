import express from "express";
import {
    getAllUsers,
    registerUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser,
    logoutUser
} from "../controllers/user.controller.js";
import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";

const router = express.Router();

// ===== User Routes =====

// Get all users (Protected route - requires authentication)
router.get('/', authenticateToken, getAllUsers);

// Register new user
router.post('/register', body('fullName.firstName').notEmpty().withMessage('firstName is required'), body('email').isEmail().withMessage('Invalid email'), body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'), registerUser);

// Login user
router.post('/login', body('email').isEmail().withMessage('Invalid email'), body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'), loginUser);

// Get user by ID (Protected route)
router.get('/:id', authenticateToken, getUserById);

// Update user (Protected route)
router.put('/:id', authenticateToken, updateUser);

// Delete user (Protected route - admin only)
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteUser);

// Logout user (Protected route)
router.post('/logout', authenticateToken, logoutUser)



export default router;