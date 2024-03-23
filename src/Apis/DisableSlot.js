import axios from "axios";
import { baseURL, headers } from "../config/config";

export const getDisabledSlots = async (areaID) => {
  var url = `${baseURL}disable/slot/${areaID}`;
  try {
    const response = await axios.get(url, headers);
    if (response.status === 200) return response.data;
    else return false;
  } catch (error) {
    console.error("Error fetching areas:", error);
    return false;
  }
};

export const disabledSlots = async (data) => {
  const url = `${baseURL}delivery/bulkUpdateTimeSlots`;
  try {
    const response = await axios.post(url, data, headers);
    if (response.status === 200) return response.data;
    else return false;
  } catch (error) {
    console.error("Error bulk updating timeslots:", error);
    return false;
  }
};
export const deleteDisableSlots = async (id) => {
  const url = `${baseURL}disable/slot/${id}`;
  try {
    const response = await axios.put(url, {}, headers);
    if (response.status === 200) return response.data;
    else return false;
  } catch (error) {
    console.error("Error bulk updating timeslots:", error);
    return false;
  }
};
