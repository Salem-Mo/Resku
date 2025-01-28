import { Server as SocketIOServer } from "socket.io";
import { MSG } from "./models/msg.model.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.FEHosturl || "http://localhost:5173", 
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const userSocketMap = new Map();

    const sendMessage = async (message) => {
        try {
            const sendSocketId = userSocketMap.get(message.sender);
            const receiveSocketId = userSocketMap.get(message.recipient);

            const createdMessage = await MSG.create(message);

            const messageData = await MSG.findById(createdMessage._id)
                .populate("sender", "_id email name image color")
                .populate("recipient", "_id email name image color");

            if (receiveSocketId) {
                io.to(receiveSocketId).emit("receiveMessage", messageData);
            }

            if (sendSocketId) {
                io.to(sendSocketId).emit("receiveMessage", messageData);
            }
        } catch (error) {
            console.error("Error in sendMessage:", error);
        }
    };
    const sendRoomMessage = async (message) => {
        try {
            const sendSocketId = userSocketMap.get(message.sender);
            const receiveSocketId = userSocketMap.get(message.recipient);
            const roomSocketId = userSocketMap.get(message.roomID);
            const createdMessage = await MSG.create(message);
            const messageData = await MSG.findById(createdMessage._id)
            .populate("sender", "_id email name image color")
            .populate("recipient", "_id email name image color")
            .populate("room", "_id name image color");
            if (roomSocketId) {
                io.to(roomSocketId).emit("receiveRoomMessage", messageData);
            }
            if (receiveSocketId) {
                io.to(receiveSocketId).emit("receiveRoomMessage", messageData);
            }
            if (sendSocketId) {
                io.to(sendSocketId).emit("receiveRoomMessage", messageData);
            }
            }}

    io.on("connection", (socket) => {
        console.log(`A user connected: socket id ${socket.id}`);

        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User ${userId} connected with socket id ${socket.id}`);
        } else {
            console.warn(`Socket ${socket.id} connected without a userId`);
        }
        

        socket.on("sendMSG", async (message) => {
            try {
                await sendMessage(message); 
                console.log("Message sent successfully");
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });
        socket.on("sendRoomMessage", async (message) => {
            try {
                await sendRoomMessage(message);
                console.log("Message sent successfully");
            } catch (error) {
                console.error("Error sending message:", error);
            }
            });

        socket.on("disconnect", () => {
            console.log(`Socket ${socket.id} disconnected`);
            for (const [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });

        socket.on("error", (error) => {
            console.error("Socket error:", error);
        });
    });
};

export default setupSocket;
