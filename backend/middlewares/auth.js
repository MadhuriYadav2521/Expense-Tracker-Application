import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
dotenv.config()

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        if (!token) return res.status(400).json({ status: 400, message: "Token not provided.", success: false })

        const authHeader = token.split(' ')[1]
        const decodeToken = jwt.decode(authHeader, process.env.JWT_TOKEN)

        if (!decodeToken) return res.status(400).json({ status: 400, message: "Authentication failed.", success: true })

        req.userData = {
            id: decodeToken.id,
            email: decodeToken.email,
            name: decodeToken.name
        }
        next()

    } catch (error) {
        console.log("error in user authentication:", error);
        return res.status(500).json({ status: 500, message: "Internal server error." })

    }
}