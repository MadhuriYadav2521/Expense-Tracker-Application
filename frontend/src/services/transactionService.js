import axios from "axios";

const BASE_URL = "http://localhost:8000/transactions";

export const AddTransactionAxios = async (data) => {
    try {
        const jwtToken = localStorage.getItem("jwtToken");
        const response = await axios.post(`${BASE_URL}/addTransaction`, data, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        return response;

    } catch (error) {
        throw error;
    }
};

export const ViewTransactionAxios = async () => {
    try {
        const jwtToken = localStorage.getItem("jwtToken");
        const response = await axios.get(`${BASE_URL}/fetchTransactionsByUser`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        return response;

    } catch (error) {
        throw error;
    }
};

export const DeleteTransactionsAxios = async (data) => {
    try {
        const jwtToken = localStorage.getItem("jwtToken");
        const response = await axios.post(`${BASE_URL}/deleteTransactions`, data, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        return response;

    } catch (error) {
        throw error;
    }
};

export const UpdateTransactionsAxios = async (data) => {
    try {
        const jwtToken = localStorage.getItem("jwtToken");
        const response = await axios.post(`${BASE_URL}/updateTransactions`, data, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        return response;

    } catch (error) {
        throw error;
    }
};

export const FetchTransactionsByFilterAxios = async (filters) => {
    try {
        const jwtToken = localStorage.getItem("jwtToken");

        const params = new URLSearchParams(filters).toString();

        const response = await axios.get(`${BASE_URL}/getTransactionsByFilter?${params}`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        return response;

    } catch (error) {
        throw error;
    }
};

export const FetchChartDataAxios = async (data) => {
    try {
        const jwtToken = localStorage.getItem("jwtToken");
        const response = await axios.get(`${BASE_URL}/fetchTotalBalance`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        return response;

    } catch (error) {
        throw error;
    }
};

export const FetchBarChartDataAxios = async (data) => {
    try {
        const jwtToken = localStorage.getItem("jwtToken");
        const response = await axios.get(`${BASE_URL}/fetchBarChartData`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        return response;

    } catch (error) {
        throw error;
    }
};
