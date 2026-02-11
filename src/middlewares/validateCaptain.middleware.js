import { body, validationResult } from "express-validator";

/**
 * Captain Register Validation
 */
export const validateCaptainRegister = [

    // ---------- Required Parent Objects ----------
    body("fullName")
        .exists().withMessage("Full name is required"),

    body("vehicle")
        .exists().withMessage("Vehicle details are required"),

    body("location")
        .exists().withMessage("Location is required"),


    // ---------- Name ----------
    body("fullName.firstName")
        .trim()
        .notEmpty().withMessage("First name is required")
        .isLength({ min: 2, max: 50 }).withMessage("First name must be between 2 and 50 characters"),

    body("fullName.lastName")
        .trim()
        .notEmpty().withMessage("Last name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Last name must be between 2 and 50 characters"),


    // ---------- Email ----------
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Valid email is required")
        .normalizeEmail()
        .toLowerCase(),


    // ---------- Password ----------
    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),


    // ---------- Phone ----------
    body("phone")
        .optional()
        .trim()
        .matches(/^[+]?[(]?[0-9]{1,3}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/)
        .withMessage("Invalid phone number"),


    // ---------- License ----------
    body("licenseNumber")
        .trim()
        .notEmpty().withMessage("License number is required")
        .isLength({ min: 5, max: 20 }).withMessage("License number must be 5-20 characters"),


    // ---------- Driver Vehicle Type ----------
    body("vehicleType")
        .notEmpty().withMessage("Vehicle type is required")
        .isIn(["car", "bike", "scooter"])
        .withMessage("Vehicle type must be car, bike, or scooter"),


    // ---------- Vehicle Details ----------
    body("vehicle.color")
        .trim()
        .notEmpty().withMessage("Vehicle color is required")
        .isLength({ min: 2, max: 30 }).withMessage("Vehicle color must be 2-30 characters"),

    body("vehicle.plate")
        .trim()
        .toUpperCase()
        .notEmpty().withMessage("Vehicle plate number is required")
        .isLength({ min: 5, max: 20 }).withMessage("Vehicle plate number must be 5-20 characters"),

    body("vehicle.capacity")
        .notEmpty().withMessage("Vehicle capacity is required")
        .isInt({ min: 1, max: 10 })
        .withMessage("Vehicle capacity must be between 1 and 10"),

    body("vehicle.vehicleType")
        .notEmpty().withMessage("Vehicle vehicleType is required")
        .isIn(["car", "bike", "auto-rickshaw"])
        .withMessage("Vehicle type must be car, bike, or auto-rickshaw"),


    // ---------- Location ----------
    body("location.latitude")
        .notEmpty().withMessage("Latitude is required")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be between -90 and 90"),

    body("location.longitude")
        .notEmpty().withMessage("Longitude is required")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be between -180 and 180"),
];


/**
 * Validation Error Handler Middleware
 */
export const handleValidation = (req, res, next) => {

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

    next();
};
