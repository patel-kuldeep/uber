import express from "express";
import { handleValidation, validateCaptainRegister } from "../middlewares/validateCaptain.middleware.js";
import { loginCaptain, registerCaptain } from "../controllers/captain.controller.js";
import { body } from "express-validator";

const router = express.Router();

// ===== Captain Routes =====
router.post('/register', validateCaptainRegister, handleValidation, registerCaptain);
router.post('/login', body('email').isEmail(), body('password').isLength({ min: 6 }), handleValidation, loginCaptain);
// router.get('/:id', authenticateToken, getCaptainById);
// router.put('/:id', authenticateToken, updateCaptain);
// router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteCaptain);
// router.post('/logout', authenticateToken, logoutCaptain);


export default router;