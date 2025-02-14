import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
		country: {
			type: String,
			required: false,
			default:"EG"
		},
        organization: {
            type: mongoose.Schema.ObjectId,
            required: false,
        },
		phone: {
			type: String,
			required: false,
		},
        role: {
            type: String,
            enum: ["admin", "Moderator"],
            default: "user",
        },
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{ timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
