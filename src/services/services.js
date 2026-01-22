import axios from "axios";
import { getToken } from "./localStorageServices"

export const getData = async (endPoint, body) => {
  try {
    const accessToken = getToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(`${API_BASE_URL}${endPoint}`, body, {
      headers: headers,
    });

    return response;
  } catch (error) {
    
    
  }
};
export const getListData = async (endPoint, body) => {
  try {
    const accessToken = getToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.get(`${API_BASE_URL}${endPoint}`, {
      headers: headers,
    });
    return response;
  } catch (error) {
    

    throw error;
  }
};
export const getDataWithoutToken = async (endPoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endPoint}`);

    return response;
  } catch (error) {
    
    throw error;
  }
};
export const getLoginData = async (endPoint, body) => {
  try {
    
    const response = await axios.post(`${API_BASE_URL}${endPoint}`, body);

    return response;
  } catch (error) {
    
    
    throw error;
  }
};

export const createData = async (endPoint, body) => {
  try {
    const accessToken = getToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(`${API_BASE_URL}${endPoint}`,body,  {
      headers: headers
    });

    return response;
  } catch (error) {
    
    
  }
};

export const updateData = async (endPoint, body) => {
  try {
    const accessToken = getToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    const response = await axios.put(`${API_BASE_URL}${endPoint}`, body, {
      headers,
    });
    return response;
  } catch (error) {
    console.error("Error updating user:", error);


    throw error;
  }
};

export const deleteData = async (endPoint, body) => {
  try {
    const accessToken = getToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await axios.delete(`${API_BASE_URL}${endPoint}`, {
      headers: headers,
      data: body,
    });
    
    return response;
  } catch (error) {
    console.error("Error deleting Data:", error);

 
    throw error;
  }
};
