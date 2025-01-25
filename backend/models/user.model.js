import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
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
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,

	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
