import express from "express";
import { currentUser, login, register } from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/curentUser',auth,currentUser)

export default userRouter;