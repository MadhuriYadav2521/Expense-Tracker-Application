import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(400).json({ status: 400, message: "Token not provided.", success: false, });
        }

        const authHeader = token.split(" ")[1];
        const decodeToken = jwt.verify(authHeader, process.env.JWT_TOKEN)

        if (!decodeToken) {
            return res.status(401).json({ status: 401, message: "Invalid token", success: false });
        }

        req.userData = {
            id: decodeToken.id,
            email: decodeToken.email,
            name: decodeToken.name,
        };

        next();
    } catch (error) {
        console.error("Error in user authentication:", error.message);
        return res.status(403).json({status: 403, message: "Authentication failed", success: false });
    }
};
