import Users from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) return res.status(400).json({ status: 400, message: "All fields are required.", success: false })
        const isUserExist = await Users.findOne({ email }).exec()
        if (isUserExist) return res.status(400).json({ status: 400, message: "User already exist.", success: false })

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: 400, message: 'Invalid email format.', success: false });
        }

        if (password.length < 5) {
            return res.status(400).json({ status: 400, message: 'Password must be at least 5 characters long.', success: false });
        }
        const hashedPassword = await bcrypt.hashSync(password, 10)
        const newUser = new Users({
            name, email, password: hashedPassword
        })
        await newUser.save()
        return res.status(200).json({ status: 200, message: "Registration successful.", success: true })

    } catch (error) {
        console.log("error in register:", error);
        return res.status(500).json({ status: 500, message: "Internal server error." })

    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ status: 400, message: "All fields are required.", success: false })

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: 400, message: 'Invalid email format.', success: false });
        }

        const isUserExist = await Users.findOne({ email }).exec()

        if (!isUserExist) return res.status(400).json({ status: 400, message: "User does not exist.", success: false })

        const verifyPassword = await bcrypt.compareSync(password, isUserExist.password)

        if (!verifyPassword) return res.status(400).json({ status: 400, message: "Credintials not matched.", success: false })

        const tokenData = { id: isUserExist._id, name: isUserExist.name, email: isUserExist.email }

        const jwtToken = await jwt.sign(tokenData, process.env.JWT_TOKEN)

        return res.status(200).json({ status: 200, message: "Login successful.", success: true, jwtToken })


    } catch (error) {
        console.log("error in login:", error);
        return res.status(500).json({ status: 500, message: "Internal server error." })

    }
}


export const currentUser = async (req, res) => {
    try {
        const userData = req.userData

        return res.status(200).json({status: 200, message: "Fetched current user.", success: true, userData})

    } catch (error) {
        console.log("error in login:", error);
        return res.status(500).json({ status: 500, message: "Internal server error." })

    }
}

