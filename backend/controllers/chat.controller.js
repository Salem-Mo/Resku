import { User } from "../models/user.model.js";
import { MSG } from "../models/msg.model.js";
import mongoose from "mongoose";
import {mkdirSync, renameSync} from "fs";



export const searchContacts = async (req, res) => {
    try {
        const { searchTerm ,userId } = req.body;
        if (searchTerm === undefined || searchTerm === null) {
            return res
                .status(400)
                .json({ success: false, message: "Search term is required" });
        }
        const clearedSearchTerm = searchTerm.replace(
            /[`~!#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi,
        );
        const regex = new RegExp(clearedSearchTerm);

        const contacts = await User.find({
            $and: [
                {_id: { $ne: userId },}
            ],
            $or: [
                { name: { $regex: regex, $options: "i" } },
                { email: { $regex: regex, $options: "i" } },
            ]
        });
        res.status(200).json({ success: true, contacts });
    } catch (error) {
        console.log("Error in searchContacts ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};



export const getMessage = async (req, res) => {
    try {
        const { sender, recipient, roomID } = req.body;
        const messages = await MSG.find({
            $or: [
                { sender, recipient },
                { sender: recipient, recipient: sender },
                {recipient: roomID}
            ],
        }).sort({ timestamp: 1 });
        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error in getMessages:", error);
        res.status(500).json({ success: false, message: "Error fetching messages" });
    }
};



export const getDMList = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const contacts = await MSG.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userObjectId },
                        { recipient: userObjectId },
                    ],
                },
            },
            {
                $sort: {
                    timestamp: -1,
                },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userObjectId] },
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timestamp" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                },
            },
            {
                $unwind: "$contactInfo",
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    name: "$contactInfo.name",
                    userImage: "$contactInfo.userImage",
                    color: "$contactInfo.color",
                },
            },
            {
                $sort: {
                    lastMessageTime: -1,
                },
            },
        ]);

        res.status(200).json({ success: true, contacts });
    } catch (error) {
        console.error("Error in getDMList:", error);
        res.status(500).json({ success: false, message: "Error fetching DM list" });
    }
};
export const saveMessage = async (req, res) => {
    try {
        const { sender, recipient, roomID, content, msgType, fileURL } = req.body.newMessage;

        if (!sender || !content || !msgType) {
            return res.status(400).json({ success: false, message: "Required fields are missing" });
        }

        const newMessage = new MSG({
            sender,
            recipient,
            roomID,
            content,
            msgType,
            fileURL,
        });

        await newMessage.save();

        res.status(200).json({ success: true, message: "Message saved successfully", data: newMessage });
    } catch (error) {
        console.error("Error in saveMessage:", error);
        res.status(500).json({ success: false, message: "Error saving message" });
    }
};
export const uploadFile = async (req, res) => {
    try {
        const { sender, recipient, content, msgType } = req.body; 
        if (!req.file) {return res.status(400).json({ success: false, message: "No file uploaded" });}
        const date = Date.now();
        const fileDir = `uploads/files/${date}`;
        const fileName = `${fileDir}/${req.file.originalname}`;
        mkdirSync(fileDir, { recursive: true });
        renameSync(req.file.path, fileName);
        const filePath = `${fileDir}/${req.file.originalname}`;
        const newMessage = new MSG({
            sender,
            recipient,
            content,
            msgType: msgType || "file", 
            fileURL: filePath,
        });
        await newMessage.save();
        res.status(200).json({
            success: true,
            message: "File uploaded and message saved",
            filePath,
            data: newMessage,
        });
    } catch (error) {
        console.error("Error in uploadFile:", error);
        res.status(500).json({ success: false, message: "Error uploading file" });
    }
};

export const getAllContacts = async (req, res) => {
    try {
        const {userId } = req.userId;
        const users = await User.find({_id: { $ne: userId }}, "name email");
        const contacts = users.map((user) => ({ label: user.name , value: user._id }));
        
        res.status(200).json({ success: true, contacts });
    } catch (error) {
        console.log("Error in searchContacts ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};