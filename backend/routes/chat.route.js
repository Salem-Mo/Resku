import express from "express";
import {searchContacts,saveMessage,getMessage, getDMList, uploadFile,getAllContacts} from '../controllers/chat.controller.js'
import { verifyToken } from "../middleware/verifyToken.js";
import multer from "multer";

const chatRouter = express.Router();

const upload = multer({ dest: "uploads/files" });

chatRouter.post("/search-contacts", searchContacts);
chatRouter.post("/save-msg",saveMessage)
chatRouter.post("/get-msg",getMessage)
chatRouter.post("/get-dm-contacts", getDMList);
chatRouter.post("/upload-file", upload.single("file"), uploadFile)
chatRouter.get("/get-all-contacts",verifyToken, getAllContacts);
export default chatRouter
