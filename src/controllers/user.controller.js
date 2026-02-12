import mongoose from "mongoose";
import BlackListedToken from "../models/blackListedToken.model.js";
import UserModal from "../models/user.model.js";
import userService from "../services/user.service.js";
import { validationResult } from "express-validator";

// GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModal.find();
        res.json({
            success: true,
            message: "All users fetched successfully",
            data: users
        });

    } catch (error) {
        console.error('Get all users error:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching users"
        });
    }
};

// REGISTER USER
export const registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array()
            });
        }

        const { fullName, email, password, phone, role } = req.body;

        // Check if user already exists
        const existingUser = await UserModal.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Create new user
        const newUser = await userService.createUser({
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            email,
            password,
            phone: phone || null,
            role: role || "user"
        });

        // Generate token
        const token = newUser.generateAuthToken();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser,
            token
        });

    } catch (error) {
        console.error('Registration error:', error.message, error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error registering user",
            error: error.errors || error
        });
    }
};

// LOGIN USER
export const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user and include password field
        const user = await UserModal.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate token
        const token = user.generateAuthToken();

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: user,
            token
        });

    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Error logging in"
        });
    }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UserModal.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });

    } catch (error) {
        console.error('Get user error:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching user"
        });
    }
};

// UPDATE USER
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, phone, profilePicture, role } = req.body;

        // Prepare update object
        const updateData = {};
        if (fullName) {
            updateData.fullName = fullName;
        }
        if (phone) {
            updateData.phone = phone;
        }
        if (profilePicture) {
            updateData.profilePicture = profilePicture;
        }
        if (role) {
            updateData.role = role;
        }

        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });

    } catch (error) {
        console.error('Update user error:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Error updating user"
        });
    }
};

// DELETE USER
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UserModal.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error('Delete user error:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Error deleting user"
        });
    }
};


export const logoutUser = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "No token provided"
            });
        }
        const userId = new mongoose.Types.ObjectId(req.user._id);
        console.log('userId: ', userId);

        await BlackListedToken.addToBlacklist(token, userId, "logout", new Date(Date.now() + 30 * 60 * 1000)); // Blacklist token for 30 minutes

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error logging out"
        });
    }
};