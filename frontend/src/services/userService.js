import axios from "axios";

const BASE_URL = "http://localhost:8000/users";

export const RegisterAxios = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, data);
    return response;
    
  } catch (error) {
    throw error;
  }
};

export const LoginAxios = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`,data);
    return response;
    
  } catch (error) {
    throw error;
  }
};


export const getCurrentUser = async () => {
  const jwtToken = localStorage.getItem("jwtToken"); 
  try {
    const response = await axios.get(`${BASE_URL}/curentUser`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return response;
    
  } catch (error) {
    throw error;
  }
};