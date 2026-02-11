import captainService from "../services/captain.service.js";
import { validationResult } from "express-validator";

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