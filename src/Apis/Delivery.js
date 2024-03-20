import axios from "axios";
import { baseURL, headers } from "../config/config";

const getAreaDetailsApi = async (areaID) => {
  var url = `${baseURL}serveArea/${areaID}`;
  try {
    const response = await axios.get(url, headers);
    if (response.status === 200) return response.data;
    else return false;
  } catch (error) {
    console.error("Error fetching areas:", error);
    return false;
  }
};
const getServeAreasApi = async (areaID) => {
  var url = `${baseURL}serveArea`;
  try {
    const response = await axios.get(url, headers);
    if (response.status === 200) return response.data;
    else return false;
  } catch (error) {
    console.error("Error fetching areas:", error);
    return false;
  }
};

export const saveDeliveryApi = async (data) => {
  var url = `${baseURL}delivery`;
  try {
    const response = await axios.post(url, data, headers);
    if (response.status === 200) return response.data;
    else return false;
  } catch (error) {
    console.error("Error fetching areas:", error);
    return false;
  }
};

export const bulkUpdateTimeSlots = async (data) =>{
  const url = `${baseURL}bulkUpdateTimeSlot`;
  try {
    const response = await axios.post(url, data, headers);
    if (response.status === 200) return response.data;
    else return false;
  } catch (error) {
    console.error("Error bulk updating timeslots:", error);
    return false;
  }
}


export { getAreaDetailsApi, getServeAreasApi };
