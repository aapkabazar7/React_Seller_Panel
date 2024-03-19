import { baseURL, headers } from "../config/config";
import axios from "axios";
const getCategoriesApi = async () => {
    const url = `${baseURL}category`;
    try {
        const response = await axios.get(url, headers);
        return response.data;
    } catch (err) {
        console.log('error in fetching categories', err);
    }
}

const activateCategory = async (id) =>{
    const url = `${baseURL}category`;
    try{
        const data = {
            categoryId : id
        }
        const response = await axios.put(url,data,headers);
        return response.data;
    } catch (err){
        console.log('error in activating category', err);
    }
}
const deleteCategory = async (id) =>{
    const url = `${baseURL}category`;

    try{
        const response = await axios.delete(url,{
            headers:{
                'x-access-token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxN2QyOTgyYmQ2OGM5NGQwYmNiOTIwMCIsInBob25lTm8iOjg3ODc4Nzg3ODcsImVtYWlsIjoiYWFwa2FiYXphcnNlbGxlckBnbWFpbC5jb20iLCJpYXQiOjE3MDc0ODkwMzN9.NziQ8vjNz5y42pFtsq6739vo7GwOVuOzVsX0hcFrq0Q'
            },
            data:{
                'categoryId' : id
            }
        });
        return response.data;
    } catch (err){
        console.log('error in activating category', err);
    }
}

export {getCategoriesApi, activateCategory,deleteCategory}