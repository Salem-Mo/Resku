// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import path from "path";
// import axios from "axios";
// import { connectDB } from "./db/connectDB.js";
// import dotenv from "dotenv";
// import { Server } from "socket.io";
// import { createServer } from "http";

// import authRoutes from "./routes/auth.route.js";
// import pinRoutes from "./routes/pin.route.js";
// import chatRouter from "./routes/chat.route.js";
// import roomRouter from "./routes/room.route.js";

// dotenv.config();
// const app = express();
// const __dirname = path.resolve();

// const PORT = process.env.PORT || 5000;
// const FEHosturl = process.env.FEHosturl;
// const FEHosturlnet = ['http://localhost:5173', 'http://localhost:3000','http://192.168.1.169', 'http://192.168.1.2:5173', 'http://192.168.1.2:3000','http://192.168.1.9'];

// app.use(cors({
//     origin: [FEHosturl, FEHosturlnet],
//     credentials: true,
// }));
// app.use(express.json());
// app.use(cookieParser());

// app.use(
//     "/uploads/profiles/",
//     express.static(path.join(__dirname, "uploads/profiles/"))
// );

// app.use(
//     "/uploads/files/",
//     express.static(path.join(__dirname, "uploads/files/"))
// );

// app.use("/api/auth", authRoutes);
// app.use("/api/pins", pinRoutes);
// app.use("/api/chat", chatRouter);
// app.use("/api/room", roomRouter);
// app.get("/", async (req, res) => {
//     res.send("Server Running....")
// });


// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "/frontend/dist")));

//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//     });
// }

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//     cors: { origin: FEHosturl, credentials: true },
// });

// io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);
//     socket.on("joinRoom", ({ userId }) => {
//         socket.join(userId);
//         console.log(`User ${userId} joined room`);
//     });

//     socket.on("sendMessage", async (messageObject) => {
//         const { to } = messageObject;
//         io.to(to).emit("receiveMessage", messageObject.newMessage);
        

//     });

//     socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//     });
// });


// httpServer.listen(PORT,  () => {
//     connectDB();
//     // console.log(`Server is running on: http://${BEHostip}:${PORT}`);
//     console.log(`Server is running on port: ${PORT}`);

// });
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import axios from "axios";
import { connectDB } from "./db/connectDB.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";

import authRoutes from "./routes/auth.route.js";
import pinRoutes from "./routes/pin.route.js";
import chatRouter from "./routes/chat.route.js";
import roomRouter from "./routes/room.route.js";

dotenv.config();
const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;
const FEHosturl = process.env.FEHosturl;
const FEHosturlnet = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://192.168.1.169",
    "http://192.168.1.2:5173",
    "http://192.168.1.2:3000",
    "http://192.168.1.9"
];

app.use(cors({
    origin: [...FEHosturlnet, FEHosturl],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

app.use("/uploads/profiles/", express.static(path.join(__dirname, "uploads/profiles/")));
app.use("/uploads/files/", express.static(path.join(__dirname, "uploads/files/")));

app.use("/api/auth", authRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/chat", chatRouter);
app.use("/api/room", roomRouter);

app.get("/", (req, res) => {
    res.send("Server Running....");
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Socket.io setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: [...FEHosturlnet, FEHosturl], credentials: true },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", ({ userId }) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on("sendMessage", async (messageObject) => {
        const { to } = messageObject;
        io.to(to).emit("receiveMessage", messageObject.newMessage);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

httpServer.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port: ${PORT}`);
});
