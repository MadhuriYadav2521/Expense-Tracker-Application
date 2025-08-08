import Transactions from "../models/transactionsModel.js";
import mongoose from "mongoose";
import moment from 'moment';
import PDFDocument from "pdfkit";
import getStream from "get-stream";
import { PassThrough } from "stream";
import fs from "fs"
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';


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


        const transactions = await Transactions.find(filter).sort({ _id: -1 });

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


function formatFilters(filters) {
    if (!filters || Object.keys(filters).length === 0) return "None";

    const parts = [];

    if (filters.transactionType && filters.transactionType !== "All") {
        parts.push(`Transaction Type: ${capitalize(filters.transactionType)}`);
    }

    if (filters.category && filters.category !== "All") {
        parts.push(`Category: ${capitalize(filters.category)}`);
    }

    const dateFilter = filters.createdDate;
    if (dateFilter?.$gte && dateFilter?.$lte) {
        const from = new Date(dateFilter.$gte).toLocaleDateString("en-GB");
        const to = new Date(dateFilter.$lte).toLocaleDateString("en-GB");
        parts.push(`Date Range: ${from} to ${to}`);
    } else if (dateFilter?.$gte) {
        const from = new Date(dateFilter.$gte).toLocaleDateString("en-GB");
        parts.push(`From: ${from}`);
    } else if (dateFilter?.$lte) {
        const to = new Date(dateFilter.$lte).toLocaleDateString("en-GB");
        parts.push(`Up to: ${to}`);
    }

    return parts.length > 0 ? parts.join(", ") : "None";
}

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function capitalizeName(str) {
    if (!str) return "";
    return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}


const height = 300;
const width = 600;


const canvasRenderService = new ChartJSNodeCanvas({ width, height });

export const generateChartImage = async (transactions) => {
    const monthMap = {};

    const summary = {
        income: 0,
        expense: 0,
    };

    transactions.forEach((tx) => {
        const date = new Date(tx.createdDate);
        const month = date.toLocaleString('default', { month: 'short' });

        if (!monthMap[month]) {
            monthMap[month] = { income: 0, expense: 0 };
        }

        if (tx.transactionType === 'income') {
            monthMap[month].income += tx.amount;
            summary.income += tx.amount;
        } else {
            monthMap[month].expense += tx.amount;
            summary.expense += tx.amount;
        }
    });

    const MONTH_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = MONTH_ORDER.filter((m) => monthMap[m]);
    const incomeData = months.map((m) => monthMap[m].income);
    const expenseData = months.map((m) => monthMap[m].expense);

    const configuration = {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Income',
                    backgroundColor: '#3b82f6',
                    data: incomeData,
                },
                {
                    label: 'Expense',
                    backgroundColor: '#facc15',
                    data: expenseData,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Income vs Expense',
                },
            },
        },
    };

    const pieConfiguration = {
        type: 'pie',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [summary.income, summary.expense],
                backgroundColor: ['#3b82f6', '#facc15'],
            }],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Income vs Expense (Pie)',
                },
            },
        },
    };

    const barBuffer = await canvasRenderService.renderToBuffer(configuration);
    const pieBuffer = await canvasRenderService.renderToBuffer(pieConfiguration);

    return { barBuffer, pieBuffer, summary };
};



export const getTransactionReport = async (req, res) => {
    try {
        const { month, fromDate, date, toDate, transactionType, category } = req.query;
        const userData = req.userData;
        const userId = userData.id;
        const filter = { userId };

        if (month) {
            const startOfMonth = new Date(`${month}-01`);
            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);
            filter.createdDate = { $gte: startOfMonth, $lt: endOfMonth };
        }
        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            filter.createdDate = { $gte: start, $lte: end };
        }
        if (fromDate && toDate) {
            filter.createdDate = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate),
            };
        } else if (fromDate) {
            filter.createdDate = { $gte: new Date(fromDate) };
        } else if (toDate) {
            filter.createdDate = { $lte: new Date(toDate) };
        }

        if (transactionType) filter.transactionType = transactionType;
        if (category) filter.category = category;

        const transactions = await Transactions.find(filter).sort({ _id: -1 });
        const { barBuffer, pieBuffer, summary } = await generateChartImage(transactions);
        const totalBalance = summary.income - summary.expense;

        const fileName = `transaction-report-${Date.now()}.pdf`;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

        const doc = new PDFDocument({ margin: 50 });
        doc.pipe(res);

        const gradient = doc.linearGradient(0, 0, doc.page.width, 0);
        gradient.stop(0, '#f43f5e').stop(0.5, '#db2777').stop(1, '#ef4444');

        doc.rect(0, 0, doc.page.width, 30).fill(gradient);

        doc
            .fillColor("#ffffff")
            .fontSize(14)
            .font("Helvetica-Bold")
            .text("Expense Tracker", 50, 8);

        doc
            .moveDown(2)
            .fillColor("#2c3e50")
            .fontSize(20)
            .text("Transaction Report", { align: "center" });

        const fullName = capitalizeName(userData?.name || "N/A");
        doc
            .moveDown()
            .fontSize(12)
            .fillColor("#2c3e50")
            .text(`${fullName} (${userData?.email || "N/A"})`);

        const filterText = formatFilters(filter);
        doc
            .fontSize(10)
            .fillColor("#7f8c8d")
            .text("Applied Filters:")
            .moveDown(0.2)
            .text(filterText)
            .moveDown(3);

        // 3️⃣ Display Totals aligned to the LEFT
        doc
            .fontSize(11)
            .font("Helvetica-Bold")
            .fillColor("#34495e")
            .text(`Total Balance:  ${totalBalance}`);

        doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor("green")
            .text(`Total Income:  ${summary.income}`);

        doc
            .fillColor("red")
            .text(`Total Expense:  ${summary.expense}`);

        // 4️⃣ Add space before next section (chart or table)
        doc.moveDown(2);


        // ✅ Step 1: Generate and insert chart before table

        // Show both side-by-side
        doc.image(barBuffer, 50, doc.y, { fit: [250, 250] });
        doc.image(pieBuffer, 320, doc.y, { fit: [250, 250] });

        doc.moveDown(13); // space below chart

        const tableTop = doc.y + 10;
        const startX = 50;
        const rowHeight = 20;
        const headers = ["Sr. No.", "Date", "Category", "Amount", "Type", "Description"];
        const colWidths = [60, 80, 100, 80, 80, 130];

        const colX = (index) => colWidths.slice(0, index).reduce((a, b) => a + b, startX);

        function drawTableHeader(yPos) {
            headers.forEach((header, i) => {
                const x = colX(i);
                doc
                    .rect(x, yPos, colWidths[i], rowHeight)
                    .fill('#2c3e50')
                    .stroke();

                doc
                    .fillColor("#ffffff")
                    .font("Helvetica-Bold")
                    .fontSize(10)
                    .text(header, x + 5, yPos + 5, {
                        width: colWidths[i] - 10,
                        align: 'left'
                    });
            });
        }

        function drawTableRow(yPos, values, isOdd) {
            values.forEach((val, i) => {
                const x = colX(i);
                doc
                    .rect(x, yPos, colWidths[i], rowHeight)
                    .fill(isOdd ? '#f9f9f9' : '#ffffff')
                    .stroke();

                doc
                    .fillColor("#2c3e50")
                    .font("Helvetica")
                    .fontSize(10)
                    .text(val.toString(), x + 5, yPos + 5, {
                        width: colWidths[i] - 10,
                        align: 'left'
                    });
            });
        }

        let y = tableTop;
        drawTableHeader(y);
        y += rowHeight;

        transactions.forEach((txn, index) => {
            const values = [
                index + 1,
                moment(txn.createdDate).format("DD/MM/YYYY"),
                txn.category,
                txn.amount,
                capitalizeName(txn.transactionType),
                capitalizeName(txn.description || "")
            ];

            if (y + rowHeight > doc.page.height - 50) {
                doc.addPage();
                y = 50;
                drawTableHeader(y);
                y += rowHeight;
            }

            drawTableRow(y, values, index % 2 === 0);
            y += rowHeight;
        });

        doc.moveDown(2)
            .fontSize(10)
            .fillColor("#7f8c8d")
            .text("Generated by Expense Tracker", { align: "center" });

        doc.end();

    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: "Error generating report" });
    }
};





