import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const captainSchema = new mongoose.Schema(
    {
        fullName: {
            firstName: {
                type: String,
                required: [true, "First name is required"],
                trim: true,
                minlength: [2, "First name must be at least 2 characters"],
                maxlength: [50, "First name cannot exceed 50 characters"]
            },
            lastName: {
                type: String,
                required: [true, "Last name is required"],
                trim: true,
                minlength: [2, "Last name must be at least 2 characters"],
                maxlength: [50, "Last name cannot exceed 50 characters"]
            }
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email already exists"],
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email address"
            ]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false
        },
        phone: {
            type: String,
            match: [
                /^[+]?[(]?[0-9]{1,3}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
                "Please provide a valid phone number"
            ]
        },
        licenseNumber: {
            type: String,
            required: [true, "License number is required"],
            unique: [true, "License number already exists"],
            trim: true,
            minlength: [5, "License number must be at least 5 characters"],
            maxlength: [20, "License number cannot exceed 20 characters"]
        },
        vehicleType: {
            type: String,
            enum: {
                values: ["car", "bike", "scooter"],
                message: "Vehicle type must be car, bike, or scooter"
            },
            required: [true, "Vehicle type is required"]
        },
        status: {
            type: String,
            enum: {
                values: ["active", "inactive", "on-trip"],
                message: "Status must be active, inactive, or on-trip"
            },
            default: "inactive"
        },
        vehicle: {
            color: {
                type: String,
                required: [true, "Vehicle color is required"],
                trim: true,
                minlength: [2, "Vehicle color must be at least 2 characters"],
                maxlength: [30, "Vehicle color cannot exceed 30 characters"]
            },
            plate: {
                type: String,
                required: [true, "Vehicle plate number is required"],
                unique: [true, "Vehicle plate number already exists"],
                trim: true,
                minlength: [5, "Vehicle plate number must be at least 5 characters"],
                maxlength: [20, "Vehicle plate number cannot exceed 20 characters"]
            },
            capacity: {
                type: Number,
                required: [true, "Vehicle capacity is required"],
                min: [1, "Vehicle capacity must be at least 1"],
                max: [10, "Vehicle capacity cannot exceed 10"]
            },
            vehicleType: {
                type: String,
                enum: {
                    values: ["car", "bike", "auto-rickshaw"],
                    message: "Vehicle type must be car, bike, or auto-rickshaw"
                },
                required: [true, "Vehicle type is required"]
            }
        },
        location: {
            longitude: {
                type: Number,
                required: [true, "Longitude is required"],
                min: [-180, "Longitude must be between -180 and 180"],
                max: [180, "Longitude must be between -180 and 180"]
            },
            latitude: {
                type: Number,
                required: [true, "Latitude is required"],
                min: [-90, "Latitude must be between -90 and 90"],
                max: [90, "Latitude must be between -90 and 90"]
            }
        },
        profilePicture: {
            type: String,
            default: null
        },
        socketId: {
            type: String,
        }
    },
    { timestamps: true }
);

captainSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: "driver"
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
};


captainSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
});

const Captain = mongoose.model("Captain", captainSchema);

export default Captain;