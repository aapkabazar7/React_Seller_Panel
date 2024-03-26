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
  // const apiUrl = 'https://sellerapi.aapkabazar.co/api/seller/disable/slot'; // Replace with your API endpoint
  // const areaIds = [
  //   "619f21b226d9ad0f34102dda",
  //   "61c6d7b3885924407c391fb2",
  //   "61c6d990885924407c391fe7",
  //   "61c6d7f2885924407c391fb6",
  //   "61c6cf29885924407c391f46",
  //   "61e25cf2a646c60bf4a7db88",
  //   "61e25ebaa646c60bf4a7dbaf",
  //   "61e25ed3a646c60bf4a7dbb3",
  //   "61c6d9b1885924407c391feb"
  // ];
  // const requestBody = {
  //   "token" : token,
  //   "startSlot": "12:01AM",
  //   "endSlot": "11:59PM",
  //   "startHr": 0,
  //   "endHr": 23,
  //   "startdate": "2024-03-24",
  //   "enddate": "2024-03-25",
  //   "message": "Holi Festival"
  // };

  // for (const areaId of areaIds) {
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         ...requestBody,
  //         areaId: areaId
  //       })
  //     });

  //     const data = await response.json();
  //     console.log('API Response for areaId', areaId, ':', data);
  //   } catch (error) {
  //     console.error('Error calling API for areaId', areaId, ':', error);
  //   }
  // }

};

export { getDashboardDetails, getOrderSourceReport, getTopProduct, getGraphData, getCardData, getOrderWiseReport, getProductCount, refreshData };
