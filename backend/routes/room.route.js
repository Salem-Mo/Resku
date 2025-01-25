import express from "express";

import { createRoom,getUserRooms } from "../controllers/room.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const roomRouter = express.Router();


roomRouter.post("/create-room",createRoom);
roomRouter.get("/get-user-rooms",verifyToken, getUserRooms);

export default roomRouter;