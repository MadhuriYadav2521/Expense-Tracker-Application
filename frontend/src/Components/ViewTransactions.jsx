import React, { useEffect, useState } from 'react';
import EnhancedTable from './EnhancedTable';
import { DeleteTransactionsAxios, FetchTransactionsByFilterAxios, GeneratePdfReportAxios, UpdateTransactionsAxios, ViewTransactionAxios } from '../services/transactionService';
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import { setTransactionAdded } from '../Redux/transactionSlice';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
    Button,
    MenuItem,
    Box,
    Typography,
    FormControl,
    InputLabel, Select, FormLabel, RadioGroup, FormControlLabel, Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "./Loader"
import axios from 'axios';


const incomeCategories = ["Salary", "Interest", "Freelance", "Bonus", "Investments", "Rental Income"];
const expenseCategories = ["Food", "Shopping", "Travel", "Groceries", "Rent", "Internet", "Phone Bill", "Medical"];

const UpdateTransactionDialog = ({ open, handleClose, data, clearFilters }) => {
    const [formData, setFormData] = useState({
        transactionType: data.transactionType,
        amount: data.amount,
        description: data.description,
        category: data.category,
        date: data.createdDate
    });
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)

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

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onUpdate = async () => {
        try {
            setLoading(true)
            formData.id = data.id
            const response = await UpdateTransactionsAxios(formData);
            if (response.data.success) {
                setLoading(false)
                dispatch(setTransactionAdded(true));
                toast.success(response.data.message);
                clearFilters()
                handleClose()
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
            if (error.response) {
                toast.error(error.response.data.message || 'Something went wrong.');
            } else {
                toast.error('Internal server error.');
            }
        }
    };

    const formatDate = (inputDate) => {
        if (!inputDate) return '';
        const d = new Date(inputDate);
        const year = d.getFullYear();
        const month = (`0${d.getMonth() + 1}`).slice(-2);
        const day = (`0${d.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };


    return (
        <>
            {loading && <Loader />}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", }}>Update Transaction</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500]
                        }}
                    >
                        <CloseIcon sx={{ color: 'red', fontSize: "24px", fontWeight: 'bold' }} />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            select
                            label="Transaction Type"
                            name="transactionType"
                            value={formData.transactionType}
                            onChange={handleChange}
                            fullWidth
                            disabled={true}
                        >
                            <MenuItem value="income">Income</MenuItem>
                            <MenuItem value="expense">Expense</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            fullWidth
                        >
                            {(formData.transactionType === "income"
                                ? incomeCategories
                                : expenseCategories
                            ).map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Date"
                            name="date"
                            type="date"
                            value={formatDate(formData.date)}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                            fullWidth
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", margin: "10px" }}>
                    <Button onClick={() => onUpdate()} variant="contained" >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const FilterDialog = ({ open, handleClose, onSubmit }) => {
    const [formData, setFormData] = useState({ category: '', date: '', fromDate: '', toDate: '', transactionType: "" });
    const [dateMode, setDateMode] = useState('single');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = () => {
        const updatedFormData = {
            ...formData,
            ...(dateMode === 'single'
                ? { fromDate: '', toDate: '' }
                : { date: '' })
        };

        const filtersToSubmit = {
            category: updatedFormData.category,
            transactionType: updatedFormData.transactionType,
            ...(dateMode === 'single'
                ? { date: updatedFormData.date }
                : { fromDate: updatedFormData.fromDate, toDate: updatedFormData.toDate })
        };

        console.log(filtersToSubmit, "filtersToSubmitvvvvvvvvvvvvvvvv");


        onSubmit(filtersToSubmit);
        // handleClose();
        setFormData({ category: '', date: '', fromDate: '', toDate: '', transactionType: '' });
        setDateMode('single');
    };


    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Select Filters</Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon sx={{ color: 'red', fontSize: "24px", fontWeight: "bold" }} />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    {/* Type */}
                    <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                            name="transactionType"
                            value={formData.transactionType}
                            label="Transaction Type"
                            onChange={handleChange}
                        >
                            <MenuItem value="income">Income</MenuItem>
                            <MenuItem value="expense">Expense</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Category */}
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category"
                            value={formData.category}
                            label="Category"
                            onChange={(e) => {
                                if (!formData.transactionType) {
                                    toast.warning("Please select Transaction Type first.");
                                    return;
                                }
                                handleChange(e);
                            }}
                        >
                            {(formData.transactionType === "income"
                                ? incomeCategories
                                : expenseCategories
                            ).map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Date filter type */}
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Date Filter Type</FormLabel>
                        <RadioGroup
                            row
                            value={dateMode}
                            onChange={(e) => setDateMode(e.target.value)}
                        >
                            <FormControlLabel value="single" control={<Radio />} label="Single Date" />
                            <FormControlLabel value="range" control={<Radio />} label="Custom Range" />
                        </RadioGroup>
                    </FormControl>

                    {/* Conditionally render date inputs */}
                    {dateMode === 'single' ? (
                        <TextField
                            name="date"
                            label="Date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        // inputProps={{ max: new Date().toISOString().split('T')[0] }}
                        />
                    ) : (
                        <Box display="flex" gap={2}>
                            <TextField
                                name="fromDate"
                                label="From Date"
                                type="date"
                                value={formData.fromDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                // inputProps={{ max: new Date().toISOString().split('T')[0] }}
                                fullWidth
                            />
                            <TextField
                                name="toDate"
                                label="To Date"
                                type="date"
                                value={formData.toDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                // inputProps={{ max: new Date().toISOString().split('T')[0] }}
                                fullWidth
                            />
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", margin: "10px" }}>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};


const ViewTransactions = () => {
    const [transactionData, setTransactionData] = useState([]);
    const dispatch = useDispatch();
    const transactionAdded = useSelector((state) => state.transactions.transactionAdded);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState()
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openFilterModal, setOpenFilterModal] = useState(false)
    const [filters, setFilters] = useState()
    const [loading, setLoading] = useState(false)
    const [clearSelectionCount, setClearSelectionCount] = useState(0);
    const [resetTablePage, setResetTablePage] = useState(0);

    const clearReset = () => setResetTablePage(prev => prev + 1);


    console.log(filters, "filterszzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");



    const headCells = [
        { id: 'transactionType', numeric: false, disablePadding: false, label: 'Type' },
        { id: 'amount', numeric: true, disablePadding: false, label: 'Amount' },
        { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
        { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
        { id: 'createdDate', numeric: false, disablePadding: false, label: 'Date' },
    ];

    const getTransactions = async () => {
        try {
            setLoading(true)
            const response = await ViewTransactionAxios();
            if (response.data.success) {
                setLoading(false)
                const formatted = response.data.transactions.map((item) => ({
                    id: item._id,
                    transactionType: item.transactionType,
                    amount: item.amount,
                    description: item.description,
                    category: item.category,
                    createdDate: new Date(item.createdDate).toLocaleDateString(),
                }));
                setTransactionData(formatted);
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
            if (error.response) {
                toast.error(error.response.data.message || 'Something went wrong.');
            } else {
                toast.error('Internal server error.');
            }
        }
    };

    useEffect(() => {
        if (!filters || Object.keys(filters).length === 0) {
            clearFilters()
        }
        if (transactionAdded) {
            dispatch(setTransactionAdded(false));
            clearFilters()
        }
    }, [transactionAdded]);

    const clearFilters = () => {
        setFilters({});
        setResetTablePage(prev => prev + 1);
        getTransactions();
    };

    const handleDeleteTransactions = async (data) => {
        try {
            setLoading(true)
            const response = await DeleteTransactionsAxios({ selectedIds: data })
            if (response.data.success) {
                setLoading(false)
                dispatch(setTransactionAdded(true))
                setSelectedIds([])
                setClearSelectionCount(prev => prev + 1);
                clearFilters()
                toast.success(response.data.message)
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
            if (error.response) {
                toast.error(error.response.data.message || 'Something went wrong.');
            } else {
                toast.error('Internal server error.');
            }
        }
    }
    console.log(selectedTransaction, "selectedTransaction");
    console.log(openEditModal, "openEditModal");

    const handleFilterSubmit = async (allfilters) => {
        try {
            setLoading(true)

            const hasValidFilters = Object.values(allfilters).some((val) => val && val.trim() !== "");
            if (!hasValidFilters) {
                setLoading(false)
                toast.error("Please select filters.");
                return;
            }

            setFilters(allfilters)
            const response = await FetchTransactionsByFilterAxios(allfilters);
            if (response.data.success) {
                setLoading(false)
                const formatted = response.data.data.map((item) => ({
                    id: item._id,
                    transactionType: item.transactionType,
                    amount: item.amount,
                    description: item.description,
                    category: item.category,
                    createdDate: new Date(item.createdDate).toLocaleDateString(),
                }));
                setTransactionData(formatted);
                setResetTablePage(prev => prev + 1);
                setFilters(allfilters);
                setOpenFilterModal(false)
                toast.success(response.data.message);
            }
        } catch (error) {
            setTransactionData([]);
            setOpenFilterModal(false)
            setLoading(false)
            console.log(error);
            if (error.response) {
                toast.error(error.response.data.message || 'Something went wrong.');
            } else {
                toast.error('Internal server error.');
            }
        }
    }


    const downloadReport = async () => {
        try {
            const res = await GeneratePdfReportAxios(filters);

            // Create PDF download link
            const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
            const a = document.createElement("a");
            a.href = url;
            a.download = "report.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading report:", error);
        }
    };




    return (
        <div>
            {loading && <Loader />}
            <EnhancedTable
                rows={transactionData}
                headCells={headCells}
                onSelectedIdsChange={setSelectedIds}
                deleteTransactions={handleDeleteTransactions}
                onEdit={(row) => {
                    setSelectedTransaction(row);
                    setOpenEditModal(true);
                }}
                openFilter={() => setOpenFilterModal(true)}
                filters={filters}
                clearFilters={() => clearFilters()}
                clearSelectionCount={clearSelectionCount}
                resetTablePage={resetTablePage}
                clearReset={clearReset}
                downloadReport={downloadReport}
            />


            {openEditModal &&
                <>
                    <UpdateTransactionDialog
                        open={open}
                        handleClose={() => { setOpenEditModal(false); setSelectedTransaction(null) }}
                        data={selectedTransaction}
                        clearFilters={() => clearFilters()}
                    />
                </>
            }

            {openFilterModal &&
                <>
                    <FilterDialog
                        open={open}
                        handleClose={() => setOpenFilterModal(false)}
                        onSubmit={handleFilterSubmit}
                    />
                </>
            }
        </div>
    );
};


export default ViewTransactions;



