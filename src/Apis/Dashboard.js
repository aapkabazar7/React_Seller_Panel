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
  //   "61cc1f6a53c28fd3c74d7547",
  //   "61c6ceda885924407c391f3e",
  //   "61c6d9cc885924407c391fef",
  //   "61c6e006885924407c39201f",
  //   "61cb037c53c28fd3c74d735d",
  //   "61c6d111885924407c391f6a",
  //   "61c6e018885924407c392023",
  //   "61c6de6d885924407c391ff3",
  //   "61c6cf10885924407c391f42",
  //   "61c6d0fc885924407c391f66",
  //   "61c6d0e8885924407c391f62",
  //   "61c6cd56885924407c391f2a",
  //   "61c6cf9a885924407c391f52",
  //   "61c6d545885924407c391fa2",
  //   "61c6de98885924407c391ff7",
  //   "61c6e0a5885924407c392033",
  //   "61c6ccae885924407c391f12",
  //   "61c6d29d885924407c391f92",
  //   "61c6d50d885924407c391f9a",
  //   "61c6d97d885924407c391fe3",
  //   "61c6cf84885924407c391f4e",
  //   "61c6ccf0885924407c391f1e",
  //   "61c6e090885924407c39202f",
  //   "61c6d526885924407c391f9e",
  //   "61c6cf39885924407c391f4a",
  //   "61c6d894885924407c391fc6",
  //   "61c6d935885924407c391fd7",
  //   "61c6e146885924407c39203f",
  //   "61c6cc98885924407c391f0e",
  //   "61c6ceb6885924407c391f3a",
  //   "61c6e113885924407c39203b",
  //   "61c6d1d3885924407c391f7a",
  //   "61c6d1b1885924407c391f76",
  //   "61c6deb5885924407c391ffb",
  //   "61c6d562885924407c391fa6",
  //   "61c6cd8d885924407c391f32",
  //   "61c6df77885924407c39200f",
  //   "61c6d13d885924407c391f72",
  //   "61c6d288885924407c391f8e",
  //   "61c6d807885924407c391fba",
  //   "61c6cd2a885924407c391f26",
  //   "61c6ce98885924407c391f36",
  //   "61c6ded0885924407c391fff",
  //   "61c6df31885924407c392007",
  //   "61c6e02a885924407c392027",
  //   "61c6d779885924407c391faa",
  //   "61c6cd0c885924407c391f22",
  //   "61c6d91f885924407c391fd3",
  //   "61c6d26c885924407c391f8a",
  //   "61c6cfb9885924407c391f56",
  //   "61c6d1f3885924407c391f7e",
  //   "61c6cfda885924407c391f5a",
  //   "61c6e05d885924407c39202b",
  //   "61c6e0c0885924407c392037",
  //   "61c6df96885924407c392013",
  //   "61c6df5a885924407c39200b",
  //   "61c6d946885924407c391fdb",
  //   "61a042ff3d75b41c6d942394",
  //   "61c6cd69885924407c391f2e",
  //   "61c6d8aa885924407c391fca",
  //   "61c6dfab885924407c392017",
  //   "61c6d245885924407c391f86",
  //   "61c6cfed885924407c391f5e",
  //   "61c6d821885924407c391fbe",
  //   "61c6dff1885924407c39201b",
  //   "61c6d124885924407c391f6e",
  //   "61c6d957885924407c391fdf",
  //   "61c6d85d885924407c391fc2",
  //   "61c6d2b9885924407c391f96",
  //   "61cc215a53c28fd3c74d7584",
  //   "61cc1fd153c28fd3c74d7550",
  //   "61c6ccc5885924407c391f16",
  //   "61cc229e53c28fd3c74d75a4",
  //   "61cb034553c28fd3c74d7350",
  //   "61cb03a153c28fd3c74d736d",
  //   "61cb039453c28fd3c74d7363",
  //   "61cb03bf53c28fd3c74d7376",
  //   "61cb02c953c28fd3c74d7348",
  //   "61cb035d53c28fd3c74d7355",
  //   "61cb036e53c28fd3c74d7359",
  //   "61cb044953c28fd3c74d737e",
  //   "61cb033b53c28fd3c74d734c",
  //   "61cc205853c28fd3c74d7562",
  //   "61cc207d53c28fd3c74d756a",
  //   "61cc206553c28fd3c74d7566",
  //   "61c6d226885924407c391f82",
  //   "61f90dfb742f0368e14a677f",
  //   "621dc6971a60f20e3dff2b52",
  //   "62220b1cf8dbd3675c44b063",
  //   "61cc219e53c28fd3c74d758d",
  //   "61cc219253c28fd3c74d7589",
  //   "62220ab5f8dbd3675c44b05c",
  //   "61cc220853c28fd3c74d759a",
  //   "61c6dee9885924407c392003",
  //   "622adf4ef8dbd3675c44bb61",
  //   "622adf3af8dbd3675c44bb5d",
  //   "622adf24f8dbd3675c44bb59",
  //   "622adee1f8dbd3675c44bb55",
  //   "622adeccf8dbd3675c44bb51",
  //   "622adea5f8dbd3675c44bb4d",
  //   "622ade91f8dbd3675c44bb49",
  //   "622ade80f8dbd3675c44bb45",
  //   "622ade71f8dbd3675c44bb41",
  //   "622ade61f8dbd3675c44bb3d"
  // ];
  // const requestBody = {
  //   "token" : token,
  //   "startSlot": "12:01AM",
  //   "endSlot": "11:59PM",
  //   "startHr": 0,
  //   "endHr": 23,
  //   "startdate": "2024-03-25",
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
