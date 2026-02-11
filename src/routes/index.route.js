import express from "express";
import userRoutes from "./user.route.js";
import captainRoutes from "./captain.route.js";

const router = express.Router();

// ===== User Routes =====
router.use('/users', userRoutes);
router.use('/captains', captainRoutes);

export default router;