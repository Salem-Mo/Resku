import express from "express";
import {
    login,
    logout,
    signup,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuth,
    updateProfile,
    addProfileImg,
    delProfileImg
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import multer from "multer";



const authRouter = express.Router();
const upload = multer({ dest: "uploads/profiles/" });


authRouter.get("/check-auth", verifyToken, checkAuth);

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/verify-email", verifyEmail);
authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/reset-password/:token", resetPassword);

authRouter.post("/update-profile", updateProfile);
authRouter.post("/add-profile-img", upload.single("profile-image"),addProfileImg );
authRouter.post("/del-profile-img",delProfileImg );



export default authRouter;
