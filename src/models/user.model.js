import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
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
        role: {
            type: String,
            enum: {
                values: ["user", "driver", "admin"],
                message: "Role must be user, driver, or admin"
            },
            default: "user"
        },
        isActive: {
            type: Boolean,
            default: true
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

// 🔒 Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 🔒 Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 🔒 Method to get user data without password
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return token;
}

const User = mongoose.model("User", userSchema);
export default User;