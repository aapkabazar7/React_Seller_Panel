import axios from "axios";
import { baseURL, headers } from "../config/config";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxN2QyOTgyYmQ2OGM5NGQwYmNiOTIwMCIsInBob25lTm8iOjg3ODc4Nzg3ODcsImVtYWlsIjoiYWFwa2FiYXphcnNlbGxlckBnbWFpbC5jb20iLCJpYXQiOjE3MDc0ODkwMzN9.NziQ8vjNz5y42pFtsq6739vo7GwOVuOzVsX0hcFrq0Q";

const getDashboardDetails = async () => {
  const url = `${baseURL}dashboard`;

  try {
    const response = await axios.get(url, {
      headers: {
        "x-access-token": token,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Re-throwing the error for handling in the calling code
  }
};
const getOrderSourceReport = async (startDate, endDate) => {
  const url = `${baseURL}dashboard/orderSource?startDate=${startDate}&endDate=${endDate}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "x-access-token": token,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Re-throwing the error for handling in the calling code
  }
};

const getOrderWiseReport = async (startDate, endDate) => {
  const url = `${baseURL}dashboard/orderReport`;

  try {
    const response = await axios.get(url, {
      headers: {
        "x-access-token": token,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Re-throwing the error for handling in the calling code
  }
};

const getProductCount = async () => {
  const url = `${baseURL}dashboard/productCount`;

  try {
    const response = await axios.get(url, {
      headers: {
        "x-access-token": token,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Re-throwing the error for handling in the calling code
  }
};

const getTopProduct = async (startDate, endDate) => {
  const url = `${baseURL}dashboard/topProducts?startDate=${startDate}&endDate=${endDate}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "x-access-token": token,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Re-throwing the error for handling in the calling code
  }
};

const getGraphData = async (granularity) => {
  // monthly(30)*12 | weekly(52) | daily(30)

  try {
    const res = await axios.get(`${baseURL}dashboard/graphreport?granularity=${granularity}`, headers);
    if (res && res.status === 200) return res;
    else return false;
  } catch (error) {
    console.log("70 Dashboard api.js");
    return false;
  }
};

const getCardData = async (sd, ed) => {
  // monthly(30)*12 | weekly(52) | daily(30)

  try {
    const res = await axios.get(`${baseURL}dashboard/stats?startDate=${sd}&endDate=${ed}`, headers);
    if (res && res.status === 200) return res;
    else return false;
  } catch (error) {
    console.log("76 Dashboard api.js");
    return false;
  }
};

const refreshData = async () => {
  const url = `${baseURL}dashboard/dailyStat`;
  try {
    const response = await axios.get(url, {
      headers: {
        "x-access-token": token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Re-throwing the error for handling in the calling code
  }
};

export { getDashboardDetails, getOrderSourceReport, getTopProduct, getGraphData, getCardData, getOrderWiseReport, getProductCount, refreshData };
