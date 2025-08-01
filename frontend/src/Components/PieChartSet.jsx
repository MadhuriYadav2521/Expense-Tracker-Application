import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useSelector } from 'react-redux';
import { FetchChartDataAxios } from '../services/transactionService';
import Loader from './Loader';

const PieChartSet = () => {
  const transactionAdded = useSelector((state) => state.transactions.transactionAdded);
  const [loading, setLoading] = useState(false)
  const [pieChartData, setPieChartData] = useState([])
  const isPieDataEmpty = !pieChartData || pieChartData.every(item => item.value === 0);

  const getChartData = async () => {
    try {
      setLoading(true)
      const response = await FetchChartDataAxios();
      if (response.data.status == 200) {
        setLoading(false)

        setPieChartData(response.data.pieData || [])
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

  console.log(pieChartData, "pieChartData");


  useEffect(() => {
    getChartData();
  }, [transactionAdded]);



  return (
    <>
      {loading && <Loader />}

      {!loading && !isPieDataEmpty ? (
        <PieChart
          series={[{ data: pieChartData }]}
          width={250}
          height={250}
        />
      ) : (
        !loading && <p style={{ textAlign: 'center', marginTop: '1rem' }}>No chart available</p>
      )}

    </>
  );
}

export default PieChartSet;