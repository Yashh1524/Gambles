import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return this.provider === "local";
        },
    },
    provider: {
        type: String,
        enum: ["local", "google", "github"],
        default: "local"
    },
    picture: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    wallet: {
        type: Number,
        default: 0,
        set: (v) => Math.round(v * 100) / 100,
        get: (v) => v.toFixed(2) // string output with 2 decimals
    },
    passResetOtp: {
        type: String,
        default: ""
    },
    passResetOtpExpiresAt: {
        type: Number,
        default: 0
    },
    verifiedResetOTP: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: "",
        unique: false
    },
    verificationTokenExpiration: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const userModel = mongoose.model.user || mongoose.model("User", userSchema);

export default userModel;
