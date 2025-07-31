import express from "express";
import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema({
    transactionType: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }
});

const Transactions = mongoose.model("Transactions", transactionSchema);
export default Transactions;
