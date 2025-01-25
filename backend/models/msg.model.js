import mongoose from "mongoose";

const msgSchema = new mongoose.Schema(
    {
        message: String,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        roomID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: false,
        },
        msgType: {
            type: String,
            enum: ["text", "image", "file", "video", "audio"],
            default: "text",
        },
        content: {
            type: String,
            required: function () {
                return this.msgType === "text";
            },
        },
        fileURL: {
            type: String,
            required: function () {
                return this.msgType === "file";
            },
        },
        timestamp: { type: Date, default: Date.now },
    },
    {
        timestamps: false,
    }
);
export const MSG = mongoose.model("MSG", msgSchema);
