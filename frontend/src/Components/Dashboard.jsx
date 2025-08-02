import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import BarsDataset from './BarDataSet';
import PieChartSet from './PieChartSet';
import { Box, Typography, Paper, Stack } from '@mui/material';
import AddTransaction from './AddTransaction';
import ViewTransactions from './ViewTransactions';
import { toast } from 'react-toastify'
import { FetchChartDataAxios } from "../services/transactionService.js"
import { useSelector } from 'react-redux';

const Dashboard = () => {

  const transactionAdded = useSelector((state) => state.transactions.transactionAdded);
  const [totalIncome, setTotalIncome] = useState("")
  const [totalExpense, setTotalExpense] = useState("")
  const [totalBalance, setTotalBalance] = useState("")
  const [pieChartData, setPieChartData] = useState([])
  const isPieDataEmpty = !pieChartData || pieChartData.every(item => item.value === 0);

  const getChartData = async () => {
    try {
      const response = await FetchChartDataAxios();
      if (response.data.status == 200) {
        setPieChartData(response.data.pieData || [])
        setTotalBalance(response.data.totalBalance)
        setTotalExpense(response.data.totalExpense)
        setTotalIncome(response.data.totalIncome)
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message || 'Something went wrong.');
      } else {
        toast.error('Internal server error.');
      }
    }
  };

  

  useEffect(() => {
    getChartData();
  }, [transactionAdded]);


  return (
    <>
      <Navbar />

      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        px={6}
        py={4}
        gap={4}
        width="100%"
        boxSizing="border-box"
      >
        {/* Bar Chart */}
        <Paper
          elevation={5}
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            minWidth: 300,
            flex: 1,
            backgroundColor: '#fff',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          <BarsDataset />
        </Paper>

        {/* Pie Chart + Totals */}
        <Paper
          elevation={5}
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            minWidth: 300,
            flex: 1,
            backgroundColor: '#fff',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          <PieChartSet />
          <Box mt={1}>
            <Stack spacing={1}>
              {!isPieDataEmpty &&
                <>
                  <Typography variant="body1" fontWeight="bold">
                    Total Balance: ₹ {totalBalance}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "green" }}>Total Income: ₹ {totalIncome}</Typography>
                  <Typography variant="body1" sx={{ color: "red" }}>Total Expense: ₹ {totalExpense}</Typography>
                </>
              }
            </Stack>
          </Box>
        </Paper>
      </Box>

      {/* Add Transaction Section */}
      <Box px={6} py={4} pt={0}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', }}>
          <AddTransaction />
        </Paper>
      </Box>


      {/* View Transaction Section */}
      <Box px={6} py={4} pt={0}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', }}>
          <ViewTransactions />
        </Paper>
      </Box>

    </>
  );
};

export default Dashboard;
