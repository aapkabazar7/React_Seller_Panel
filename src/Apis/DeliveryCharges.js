import { baseURL, headers } from "../config/config";
import axios from "axios";

export const getDeliveryChargesApi = async () => {

    const url = `${baseURL}delivery/groupByCharges`;
    try {
        const response = await axios.get(url, headers);
        return response.data;
    } catch (err) {
        console.error("Error fetching delivery charges:", err);
        throw err;
    }
}
export const getDeliveryOffersApi = async () => {

    const url = `${baseURL}delivery/groupByOffers`;
    try {
        const response = await axios.get(url, headers);
        return response.data;
    } catch (err) {
        console.error("Error fetching delivery offers:", err);
        throw err;
    }
}

export const saveDeliveryChargesApi = async (data) => {
    const url = `${baseURL}delivery/setCharges`;
    try {
        const response = await axios.post(url, data, headers);
        return response.data;
    } catch (err) {
        console.error("Error saving delivery charges:", err);
        throw err;
    }
}
export const saveDeliveryoffersApi = async (data) => {
    const url = `${baseURL}delivery/setOffer`;
    try {
        const response = await axios.post(url, data, headers);
        return response.data;
    } catch (err) {
        console.error("Error saving delivery charges:", err);
        throw err;
    }
}

export const searchProductApi = async (searchKeyword) => {
    const url = `${baseURL}delivery/searchProduct?keyword=${searchKeyword}`;
    try {
        const response = await axios.get(url, headers);
        return response.data;
    } catch (err) {
        console.error("Error searching product:", err);
        throw err;
    }
}