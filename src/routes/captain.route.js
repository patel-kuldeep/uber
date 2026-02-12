import express from "express";
import { handleValidation, validateCaptainRegister } from "../middlewares/validateCaptain.middleware.js";
import { getCaptainById, loginCaptain, logoutCaptain, registerCaptain } from "../controllers/captain.controller.js";
import { body } from "express-validator";
import { authCaptain } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ===== Captain Routes =====
router.post('/register', validateCaptainRegister, handleValidation, registerCaptain);
router.post('/login', body('email').isEmail(), body('password').isLength({ min: 6 }), handleValidation, loginCaptain);
router.get('/:id', authCaptain, getCaptainById);
// router.put('/:id', authenticateToken, updateCaptain);
// router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteCaptain);
router.post('/logout', authCaptain, logoutCaptain);


export default router;