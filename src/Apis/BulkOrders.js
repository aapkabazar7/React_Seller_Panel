import axios from "axios";
import { baseURL, headers } from "../config/config";
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxN2QyOTgyYmQ2OGM5NGQwYmNiOTIwMCIsInBob25lTm8iOjg3ODc4Nzg3ODcsImVtYWlsIjoiYWFwa2FiYXphcnNlbGxlckBnbWFpbC5jb20iLCJpYXQiOjE3MDc0ODkwMzN9.NziQ8vjNz5y42pFtsq6739vo7GwOVuOzVsX0hcFrq0Q'

const getBulkOrdersApi = async (page = 1, limit = 40) => {

    var url = `${baseURL}/get-bulk-order-list?page=${page}&limit=${limit}`;
    // const? data = 
    try {
        const response = await axios.get(url, headers);

        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error; // Re-throwing the error for handling in the calling code
    }
}

export {getBulkOrdersApi}
