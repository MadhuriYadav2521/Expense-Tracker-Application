import React, { useState } from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Button,
    Select,
    InputLabel,
    FormControl,
    Grid,
    Typography,
} from '@mui/material';
import { toast } from 'react-toastify'
import { AddTransactionAxios } from '../services/transactionService';
import Loader from './Loader';
import { useDispatch } from 'react-redux';
import { setTransactionAdded } from '../Redux/transactionSlice';

const AddTransaction = () => {
    const [form, setForm] = useState({ transactionType: '', amount: '', description: '', category: '', date: '' });
    const [loading, setLoading] = useState(false)
    const incomeCategories = ["Salary", "Interest", "Freelance", "Bonus", "Investments", "Rental Income"];
    const expenseCategories = ["Food", "Shopping", "Travel", "Groceries", "Rent", "Internet", "Phone Bill", "Medical"];
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "date") {
            const selectedDate = new Date(value);
            selectedDate.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate > today) {
                toast.error("Transactions can't be recorded for future dates.");
                return;
            }
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    console.log(form, "form");


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await AddTransactionAxios(form)
            console.log(response, "resss");
            if (response.data.success == true) {
                setLoading(false)
                dispatch(setTransactionAdded(true));
                setForm({ transactionType: '', amount: '', description: '', category: '', date: '' });
                toast.success(response.data.message)
            }

        } catch (error) {
            setLoading(false)
            console.log(error);
            if (error.response) {
                toast.error(error.response.data.message || "Something went wrong.");
            } else {
                toast.error("Internal server error.");
            }
        }

    };


    return (

        <>
            {loading && <Loader />}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <Typography sx={{ fontSize: "22px", fontWeight: "bold", marginBottom: "10px" }}>Add Transaction</Typography>
                <Grid container spacing={2} alignItems="center">

                    <Grid item xs={12} sm={2}>
                        <Box sx={{ minWidth: 165, width: "100%" }}>
                            <FormControl fullWidth >
                                <InputLabel>Type</InputLabel>
                                <Select
                                    name="transactionType"
                                    value={form.transactionType}
                                    onChange={handleChange}
                                    label="Type"
                                >
                                    <MenuItem value="income">Income</MenuItem>
                                    <MenuItem value="expense">Expense</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                        <Box sx={{ minWidth: 165, width: "100%" }}>
                            <FormControl fullWidth >
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={form.category}
                                    onChange={(e) => {
                                        if (!form.transactionType) {
                                            toast.warning("Please select Transaction Type first.");
                                            return;
                                        }
                                        handleChange(e);
                                    }}
                                    label="Category"
                                >
                                    {(form.transactionType === "income"
                                        ? incomeCategories
                                        : expenseCategories
                                    ).map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                            {cat}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={2.5}>
                        <Box sx={{ minWidth: 165, width: "100%" }}>
                            <TextField
                                fullWidth
                                name="description"
                                label="Description"
                                value={form.description}
                                onChange={handleChange}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                        <Box sx={{ minWidth: 165, width: "100%" }}>
                            <TextField
                                fullWidth
                                name="amount"
                                label="Amount"
                                type="number"
                                value={form.amount}
                                onChange={handleChange}
                            />
                        </Box>
                    </Grid>


                    <Grid item xs={12} sm={2}>
                        <Box sx={{ minWidth: 165, width: "100%" }}>
                            <TextField
                                fullWidth
                                name="date"
                                label="Date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                        <Box sx={{ minWidth: 165, width: "100%" }}>
                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                sx={{
                                    height: '50px',
                                    width: "100%"
                                }}
                            >
                                Add Transaction
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default AddTransaction;


//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
