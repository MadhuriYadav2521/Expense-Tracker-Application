import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from './routes/userRoutes.js'
import transactionRouter from './routes/transactionRoutes.js'
dotenv.config();

const app = express()

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/users',userRouter)
app.use('/transactions',transactionRouter)


mongoose.connect(process.env.CONNECTION)
    .then(() => console.log("DB Connected"))
    .catch((e) => console.log("Erro in db connection", e))



const port = process.env.PORT || 4000
app.listen(port, () => console.log("Running on port", port))