import axios from "axios";
import { baseURL } from "../config/config";
const apiURL = "http://13.232.36.248:13000/api/seller";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxN2QyOTgyYmQ2OGM5NGQwYmNiOTIwMCIsInBob25lTm8iOjg3ODc4Nzg3ODcsImVtYWlsIjoiYWFwa2FiYXphcnNlbGxlckBnbWFpbC5jb20iLCJpYXQiOjE3MDc0ODkwMzN9.NziQ8vjNz5y42pFtsq6739vo7GwOVuOzVsX0hcFrq0Q";

const getCustomersApi = async (body, page = 0, limit = 10) => {
  const url = `${baseURL}users?page=${page}&limit=${limit}`;

  try {
    const response = await axios.post(url, body, {
      headers: {
        "x-access-token": token,
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Re-throwing the error for handling in the calling code
  }
};

const getCustomerDetailsApi = async (id) => {
  const url = `${baseURL}user/detail`;

  try {
    const response = await axios.get(url, {
      headers: {
        "x-access-token": token,
      },
      params: {
        "_id": id
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Re-throwing the error for handling in the calling code
  }

}

const getCustomerByPhoneApi = async (num) => {
  try {
    const res = await axios.get(`${baseURL}user/phoneNo?phoneNo=${num}`, {
      headers: {
        "x-access-token": token
      }
    });
    if (res.data?.success)
      return res.data
    else
      return false
  } catch (error) {
    console.log(error)
  }
}

const exportCsvApi = async (body) => {
  const url = `${baseURL}user/getCsv`;

  try {
    const response = await axios.post(url, body, {
      headers: {
        "x-access-token": token,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;

  };

}

export { getCustomersApi, getCustomerDetailsApi, getCustomerByPhoneApi, exportCsvApi };
