// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();
// export const generateTokenAndSetCookie = (res, userId) => {
// 	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
// 		expiresIn: "7d",
// 	});

// 	res.cookie("token", token, {
// 		httpOnly: true,
// 		secure: process.env.NODE_ENV === "production",
// 		sameSite: "strict",
// 		maxAge: 7 * 24 * 60 * 60 * 1000,
// 	});

// 	return token;
// };
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateTokenAndSetCookie = (res, userId, isMobile = false) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    if (!isMobile) {
        // Web: Store the token in cookies
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }

    // Mobile: Return the token in response (client stores it)
    return token;
};
