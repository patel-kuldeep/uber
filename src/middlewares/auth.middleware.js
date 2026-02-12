import jwt from "jsonwebtoken";
import BlackListedToken from "../models/blackListedToken.model.js";

// Verify JWT Token
export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1] || req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided, authorization denied"
            });
        }

        const tokenBlacklist = await BlackListedToken.isTokenBlacklisted(token);
        if (tokenBlacklist) {
            return res.status(401).json({
                success: false,
                message: "Token has been blacklisted, please log in again"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('error: ', error);
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

// Verify user role
export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions"
            });
        }
        next();
    };
};


export const authCaptain = async (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1] || req.cookies.token;
    try {
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided, authorization denied"
            });
        }

        const tokenBlacklist = await BlackListedToken.isTokenBlacklisted(token);

        if (tokenBlacklist) {
            return res.status(401).json({
                success: false,
                message: "Token has been blacklisted, please log in again"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('decoded: ', decoded);
        if (decoded.role !== "captain") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions"
            });
        }

        req.captain = decoded;
        next();

    } catch (error) {
        console.log('error: ', error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
