import express from "express";
import { auth } from "../middlewares/auth.js";
import { addTransaction, deleteTransactions, fetchBarChartData, fetchTotalBalance, fetchTransactionsByUser, getTransactionsByFilter, updateTransactions } from "../controllers/transactionController.js";

const transactionRouter = express.Router()

transactionRouter.post('/addTransaction',auth, addTransaction)
transactionRouter.get('/fetchTransactionsByUser',auth,fetchTransactionsByUser)
transactionRouter.get('/fetchTotalBalance',auth,fetchTotalBalance)
transactionRouter.get('/getTransactionsByFilter',auth,getTransactionsByFilter)
transactionRouter.post('/deleteTransactions',auth,deleteTransactions)
transactionRouter.post('/updateTransactions',auth,updateTransactions)
transactionRouter.get('/fetchBarChartData',auth,fetchBarChartData)

export default transactionRouter;