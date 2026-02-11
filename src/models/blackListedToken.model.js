import mongoose from "mongoose";

const blackListedTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: [true, "Token is required"],
            unique: [true, "Token already exists in blacklist"],
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"]
        },
        reason: {
            type: String,
            enum: {
                values: ["logout", "password-change", "account-delete", "suspicious-activity", "admin-action", "token-refresh"],
                message: "Reason must be one of: logout, password-change, account-delete, suspicious-activity, admin-action, token-refresh"
            },
            default: "logout"
        },
        blacklistedAt: {
            type: Date,
            default: Date.now
        },
        expiresAt: {
            type: Date,
            required: [true, "Token expiration time is required"],
            index: { expires: 0 } // Auto-delete document after expiration
        }
    },
    { timestamps: true }
);

// 🔍 Index for faster lookups
blackListedTokenSchema.index({ token: 1 });
blackListedTokenSchema.index({ userId: 1 });
blackListedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ✅ Check if token is blacklisted
blackListedTokenSchema.statics.isTokenBlacklisted = async function (token) {
    const blacklistedToken = await this.findOne({ token });
    return !!blacklistedToken;
};

// ✅ Add token to blacklist
blackListedTokenSchema.statics.addToBlacklist = async function (token, userId, reason, expiresAt) {
    const blacklistedToken = await this.create({
        token,
        userId: new mongoose.Types.ObjectId(userId),
        reason,
        expiresAt
    });
    return blacklistedToken;
};

// ✅ Remove all blacklisted tokens for a user
blackListedTokenSchema.statics.removeUserTokens = async function (userId) {
    return await this.deleteMany({ userId });
};

const BlackListedToken = mongoose.model("BlackListedToken", blackListedTokenSchema);
export default BlackListedToken;
