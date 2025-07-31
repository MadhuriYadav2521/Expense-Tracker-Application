import Transactions from "../models/transactionsModel.js";

export const addTransaction = async (req, res) => {
    try {
        const { transactionType, amount, description, category } = req.body
        if (!transactionType || !amount || !description || !category) return res.status(400).json({ status: 400, message: "All fields are required.", success: false })

        if (amount <= 0) {
            return res.status(400).json({ status: 400, message: "Amount must be greater than 0.", success: false });
        }

        if (!['income', 'expense'].includes(transactionType)) {
            return res.status(400).json({ status: 400, message: "Transaction type must be either 'income' or 'expense'.", success: false });
        }

        const newTransaction = new Transactions({
            transactionType, amount, description, category, createdDate: Date.now(), userId: req.userData.id
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
        const trancations = await Transactions.find({ userId }).exec();
        if (trancations.length == 0) return res.status(400).json({ status: 400, message: "No transactions found.", success: false })

        return res.status(200).json({ status: 200, message: "Transactions fetched successfully..", success: true, trancationsData: trancations })

    } catch (error) {
        console.log("error in fetching transaction:", error);
        return res.status(500).json({ status: 500, message: "Internal server error.", success: false })
    }
}

export const fetchTotalBalance = async (req, res) => {
    try {
        const userId = req.userData.id
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
        return res.status(200).json({ status: 200, message: "Total balanca fetched successfully.", totalIncome, totalExpense, totalBalance });


    } catch (error) {
        console.log("error in fetching total balance:", error);
        return res.status(500).json({ status: 500, message: "Internal server error.", success: false })
    }
}

export const getTransactionsByFilter = async (req, res) => {
    try {
        const { transactionType, category, startDate, endDate } = req.query;
        const userId = req.userData.id;

        const filter = { userId };

        if (transactionType) filter.transactionType = transactionType;
        if (category) filter.category = category;

        if (startDate && endDate) {
            filter.createdDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else if (startDate) {
            filter.createdDate = { $gte: new Date(startDate) };
        } else if (endDate) {
            filter.createdDate = { $lte: new Date(endDate) };
        }

        const transactions = await Transactions.find(filter).sort({ createdDate: -1 });

        if (transactions.length == 0) return res.status(400).json({ status: 400, message: "No transactions found for the given filters.", success: false })

        res.status(200).json({ status: 200, message: "Transactions fetched successfully", success: true, data: transactions });

    } catch (error) {
        console.log("Error in fetch transactions:", error);
        res.status(500).json({ status: 500, message: "Internal server error", success: false });
    }
};
