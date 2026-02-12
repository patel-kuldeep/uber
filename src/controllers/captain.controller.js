import mongoose from "mongoose";
import BlackListedToken from "../models/blackListedToken.model.js";
import captainService from "../services/captain.service.js";
import { validationResult } from "express-validator";
import CaptainModal from "../models/captain.model.js";

// GET ALL CAPTAINS
export const getAllCaptains = async (req, res) => {
    try {
        const captains = await CaptainModal.find();
        res.json({
            success: true,
            message: "All captains fetched successfully",
            data: captains
        });
    } catch (error) {
        console.error('Get all captains error:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching captains"
        });
    }
};

// REGISTER CAPTAIN
export const registerCaptain = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg
                }))
            });
        }

        // service se token + captain dono aayega
        const result = await captainService.registerCaptain(req.body);

        return res.status(201).json({
            success: true,
            message: "Captain registered successfully",
            token: result.token,
            captain: result.captain
        });

    } catch (error) {
        console.error("Register Captain Error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Server error while registering captain"
        });
    }
};

// login captain

export const loginCaptain = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await captainService.loginCaptain(email, password);


        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.json({
            success: true,
            message: "Captain logged in successfully",
            token: result.token,
            captain: result.captain
        });
    } catch (error) {
        console.error("Login Captain Error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Server error while logging in captain"
        });
    }
};

export const getCaptainById = async (req, res) => {
    try {
        const captain = await CaptainModal.findById(req.params.id);
        if (!captain) {
            return res.status(404).json({
                success: false,
                message: "Captain not found"
            });
        }
        res.json({
            success: true,
            message: "Captain fetched successfully",
            data: captain
        });
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching captain"
        });
    }
}

export const logoutCaptain = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1] || req.cookies.token;
        console.log('token: ', token);
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "No token provided"
            });
        }
        console.log('req.user: ', req.captain);
        const userId = new mongoose.Types.ObjectId(req.captain._id);
        console.log('userId: ', userId);
        await BlackListedToken.addToBlacklist(token, userId, "logout", new Date(Date.now() + 30 * 60 * 1000)); // Blacklist token for 30 minutes

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.json({
            success: true,
            message: "Captain logged out successfully"
        });

    } catch (error) {
        console.error("Logout Captain Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while logging out captain"
        });
    }
};
