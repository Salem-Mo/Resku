import mongoose from "mongoose";

const orgSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        imgFile: {
            type: String,
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        userImage: {
            type: String,
            required: false
        },
        color:{
            type: Number,
            required: false
        },
        country: {
            type: String,
            required: false,
            default:"EG"
        },
        organization: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: false,
        },
        resetPasswordToken: String,
        resetPasswordExpiresAt: Date,
        verificationToken: String,
        verificationTokenExpiresAt: Date,
    },
    { timestamps: true }
);

export const Organization = mongoose.model("Organization", orgSchema);
