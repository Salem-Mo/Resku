import bcryptjs from "bcryptjs";
import crypto from "crypto";
import path from "path";
import fs from 'fs';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
    sendResetPasswordEmail,
    sendResetSuccessPasswordEmail,
    sendVerEmail,
    sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";
import { renameSync , unlinkSync } from "fs";
const FEHosturl = process.env.FEHosturl;

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });
        console.log("userAlreadyExists", userAlreadyExists);

        if (userAlreadyExists) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        const user = await new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        await user.save();

        // jwt
        generateTokenAndSetCookie(res, user._id);

        await sendVerEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code",
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("error in verifyEmail ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("Error in login ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // send email
        await sendResetPasswordEmail(
            user.email,
            user.name,
            `${FEHosturl}/reset-password/${resetToken}`
        );

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
        });
    } catch (error) {
        console.log("Error in forgotPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }

        // update password
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessPasswordEmail(user.email);

        res.status(200).json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const { userID, name, country, color, userImage } = req.body;

        const user = await User.findByIdAndUpdate(
            userID,
            { name, country, color, userImage },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Updated successfully",
        });
    } catch (error) {
        console.log("Error in UpdateProfile:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const addProfileImg = async (req, res,next) => {
    try {
        const { userID } = req.body;
        const userImage = req.file;
        if (!userImage) {
            return res.status(400).json({success: false,message: "No image provided",});
        }
        const uploadDate = new Date().toISOString().replace(/[:.]/g, '-'); 
        const fileExtension = path.extname(userImage.originalname)
        const fileName = `uploads/profiles/${userID}_${uploadDate}_${fileExtension}`;
        renameSync(userImage.path, fileName);

        const user = await User.findByIdAndUpdate(
            userID,
            { userImage: fileName }, 
            { new: true }
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Image added successfully",
        });
    } catch (error) {
        console.log("Error in addProfileImg:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const delProfileImg = async (req, res) => {
    try {
        const { userID } = req.body;
        const user = await User.findById(userID);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                });
                }
                if (user.userImage) {
                const userImage = user.userImage;
                const filePath = path.join('../', userImage);
                console.log("File path to delete:", filePath);
                if (fs.existsSync(filePath)) {
                    unlinkSync(filePath);
                } else {
                    console.log("File not found:", filePath);
                }
                user.userImage = null;
                await user.save();

                res.status(200).json({
                success: true,
                message: "Image deleted successfully",
                })
            }
    } catch (error) {
        console.log("Error in delProfileImg:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}


export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
