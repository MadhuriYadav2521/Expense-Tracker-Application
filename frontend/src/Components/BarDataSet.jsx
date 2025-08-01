import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FetchBarChartDataAxios } from '../services/transactionService';
import Loader from './Loader';


const chartSetting = {
  yAxis: [
    {
      label: 'Income and Expense',
      width: 80,
      valueFormatter: (value) => value.toLocaleString(),
    },
  ],
  height: 300,
};

const BarsDataset = () => {

  const transactionAdded = useSelector((state) => state.transactions.transactionAdded);
  const [loading, setLoading] = useState(false)
  const [barChartData, setBarChartData] = useState("")


  const getChartData = async () => {
    try {
      setLoading(true)
      const response = await FetchBarChartDataAxios();
      if (response.data.status == 200) {
        setLoading(false)
        console.log(response.data, "piiiiiiiiiiiiiiiiiiiiiiiiiii");

        setBarChartData(response.data.barData)
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
    getChartData();
  }, [transactionAdded]);


  return (
    <>
      {loading && <Loader />}

      {!loading && barChartData.length > 0 ? (
        <BarChart
          xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
          series={[
            { dataKey: 'income', label: 'Income' },
            { dataKey: 'expense', label: 'Expense' },
          ]}
          dataset={barChartData}
          {...chartSetting}
        />
      ) : (
        !loading && <p style={{ textAlign: 'center', marginTop: '1rem', marginBottom: "8px" }}>No chart available</p>
      )}


    </>
  );
};

export default BarsDataset;
