import express from "express";
import { auth } from "../middlewares/auth.js";
import { addTransaction, fetchTotalBalance, fetchTransactionsByUser, getTransactionsByFilter } from "../controllers/transactionController.js";

const transactionRouter = express.Router()

transactionRouter.post('/addTransaction',auth, addTransaction)
transactionRouter.get('/fetchTransactionsByUser',auth,fetchTransactionsByUser)
transactionRouter.get('/fetchTotalBalance',auth,fetchTotalBalance)
transactionRouter.get('/getTransactionsByFilter',auth,getTransactionsByFilter)

export default transactionRouter;