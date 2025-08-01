import Transactions from "../models/transactionsModel.js";
import mongoose from "mongoose";
import moment from 'moment';

export const addTransaction = async (req, res) => {
    try {
        const { transactionType, amount, description, category, date } = req.body
        if (!transactionType || !amount || !description || !category || !date) return res.status(400).json({ status: 400, message: "Please fill all the fields.", success: false })

        if (amount <= 0) {
            return res.status(400).json({ status: 400, message: "Amount must be greater than 0.", success: false });
        }

        if (!['income', 'expense'].includes(transactionType)) {
            return res.status(400).json({ status: 400, message: "Transaction type must be either 'income' or 'expense'.", success: false });
        }

        const newTransaction = new Transactions({
            transactionType, amount, description, category, createdDate: new Date(date), userId: req.userData.id
        })

        await newTransaction.save()
        return res.status(200).json({ status: 200, message: "Transaction added successfully.", success: true, data: newTransaction })


    } catch (error) {
        console.log("error in adding transaction:", error);
        return res.status(500).json({ status: 500, message: "Internal server error.", success: false })
    }
}

export const fetchTransactionsByUser = async (req, res) => {
    try {
        const userId = req.userData.id
        const transactions = await Transactions.find({ userId }).sort({ _id: -1 }).exec();
        // if (transactions.length == 0) return res.status(400).json({ status: 400, message: "No transactions found.", success: false })

        return res.status(200).json({ status: 200, message: "Transactions fetched successfully..", success: true, transactions: transactions })

    } catch (error) {
        console.log("error in fetching transaction:", error);
        return res.status(500).json({ status: 500, message: "Internal server error.", success: false })
    }
}

export const fetchTotalBalance = async (req, res) => {
    try {
        const userId = req.userData.id;
        const transactions = await Transactions.find({ userId });

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(txn => {
            if (txn.transactionType === 'income') {
                totalIncome += txn.amount;
            } else if (txn.transactionType === 'expense') {
                totalExpense += txn.amount;
            }
        });

        const totalBalance = totalIncome - totalExpense;

        // ✅ Pie chart formatted data
        const pieData = [
            { id: 0, value: totalIncome, label: 'Income' },
            { id: 1, value: totalExpense, label: 'Expense' },
        ];

        return res.status(200).json({
            status: 200,
            message: "Total balance fetched successfully.",
            totalIncome,
            totalExpense,
            totalBalance,
            pieData,
        });

    } catch (error) {
        console.log("error in fetching total balance:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error.",
            success: false
        });
    }
}


export const getTransactionsByFilter = async (req, res) => {
    try {
        const { transactionType, date, category, fromDate, toDate } = req.query;
        const userId = req.userData.id;

        const filter = { userId };

        if (transactionType) filter.transactionType = transactionType;

        if (date) {
            // fetch transactions only on that day
            const start = new Date(date);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            filter.createdDate = { $gte: start, $lte: end };
        }
        if (category) filter.category = category;

        if (fromDate && toDate) {
            filter.createdDate = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        } else if (fromDate) {
            filter.createdDate = { $gte: new Date(fromDate) };
        } else if (toDate) {
            filter.createdDate = { $lte: new Date(toDate) };
        }

        console.log(filter, "filter");


        const transactions = await Transactions.find(filter).sort({ createdDate: -1 });

        if (transactions.length == 0) return res.status(400).json({ status: 400, message: "No transactions found for the given filters.", success: false })

        res.status(200).json({ status: 200, message: "Transactions fetched successfully", success: true, data: transactions });

    } catch (error) {
        console.log("Error in fetch transactions:", error);
        res.status(500).json({ status: 500, message: "Internal server error", success: false });
    }
};


export const deleteTransactions = async (req, res) => {
    try {
        const { selectedIds } = req.body;
        const userId = req.userData.id;

        if (!selectedIds || !Array.isArray(selectedIds) || selectedIds.length === 0) {
            return res.status(400).json({ status: 400, message: "No transaction IDs provided.", success: false, });
        }
        const objectIds = selectedIds.map(id => new mongoose.Types.ObjectId(id));

        const result = await Transactions.deleteMany({
            _id: { $in: objectIds },
            userId: userId,
        });

        return res.status(200).json({ status: 200, message: `Transaction(s) deleted successfully.`, success: true });

    } catch (error) {
        console.error("Error in delete transactions:", error);
        return res.status(500).json({ status: 500, message: "Internal server error.", success: false, });
    }
};

export const updateTransactions = async (req, res) => {
    try {
        console.log(req.body, "xxxxx");

        const { id, amount, description, category, date } = req.body;
        const userId = req.userData.id;

        if (!id) {
            return res.status(400).json({ status: 400, message: "No transaction ID provided.", success: false, });
        }
        const transaction = await Transactions.findOne({ _id: id, userId: userId });

        if (!transaction) {
            return res.status(404).json({ status: 404, message: "Transaction not found.", success: false });
        }

        transaction.amount = amount;
        transaction.description = description;
        transaction.category = category;
        transaction.createdDate = new Date(date);

        await transaction.save();


        return res.status(200).json({ status: 200, message: `Transaction updated successfully.`, success: true });

    } catch (error) {
        console.error("Error in update transactions:", error);
        return res.status(500).json({ status: 500, message: "Internal server error.", success: false, });
    }
};



export const fetchBarChartData = async (req, res) => {
    try {
        const userId = req.userData.id;

        const transactions = await Transactions.find({ userId });

        const monthlyData = {};

        transactions.forEach((txn) => {
            const month = moment(txn.createdDate).format('MMM');

            if (!monthlyData[month]) {
                monthlyData[month] = {
                    month,
                    income: 0,
                    expense: 0
                };
            }

            if (txn.transactionType === 'income') {
                monthlyData[month].income += txn.amount;
            } else if (txn.transactionType === 'expense') {
                monthlyData[month].expense += txn.amount;
            }
        });

        // Convert object to array and sort by month order
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dataset = monthOrder
            .filter(month => monthlyData[month])
            .map(month => monthlyData[month]);

        return res.status(200).json({
            status: 200,
            message: 'Bar chart data fetched successfully.',
            barData: dataset
        });

    } catch (error) {
        console.error('Error in fetchBarChartData:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            success: false
        });
    }
};
