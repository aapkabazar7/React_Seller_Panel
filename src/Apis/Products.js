import axios from "axios";
import { baseURL, headers, pageLimit } from "../config/config";

const fetchProducts = async (categoryId, subCategoryId, leafCategoryId, brandId, page = 0, limit = 10) => {
  const urlParams = [`page=${page}`, `limit=${limit}`];
  if (brandId !== null) {
    urlParams.push(`brandId=${brandId}`);
  }
  if (categoryId !== null) {
    urlParams.push(`categoryId=${categoryId}`);
  }
  if (subCategoryId !== null) {
    urlParams.push(`subCategoryId=${subCategoryId}`);
  }
  if (leafCategoryId !== null) {
    urlParams.push(`leafCategoryId=${leafCategoryId}`);
  }

  const url = `${baseURL}product/stock/list?${urlParams.join("&")}`;

  try {
    console.log(url);
    console.log(urlParams);
    const response = await axios.get(url, headers);
    return response.data;
  } catch (err) {
    console.error("Error in fetching products:", err);
    throw err; // Rethrow the error to handle it outside
  }
};

const getActiveCategoriesApi = async () => {
  const url = `${baseURL}active/category`;
  try {
    const response = await axios.get(url, headers);
    return response.data;
  } catch (err) {
    console.log("error in fetching categories", err);
  }
};

const fetchPinCodesApi = async () => {
  const url = `${baseURL}serveArea`;

  try {
    const response = await axios.get(url, headers);
    return response.data;
  } catch (err) {
    console.error("error in fetching pin codes :", err);
    throw err;
  }
};

const blacklistPinCodesApi = async (sellerProductId, pincode) => {
  const url = `${baseURL}product/blacklistPin`;
  const data = {
    sellerProductId: sellerProductId,
    blacklistedPinCodes: pincode,
  };
  const response = await axios.post(url, data, headers);
  return response.data;
};
const fetchBrandsApi = async () => {
  const url = `${baseURL}brand`;
  try {
    const response = await axios.get(url, headers);
    return response.data;
  } catch (err) {
    console.log("Error in fetching brand names", err);
  }
};
const updateProductInfo = async (data) => {
  const url = `${baseURL}product/update`;
  const response = await axios.post(url, data, headers);
  return response.data;
};
const addNewProductApi = async (page = 0) => {
  try {
    const res = await axios.get(
      `
${baseURL}catalogue/products?page=${page}&limit=${pageLimit}&added=false`,
      headers
    );
    if (res.status === 200) return res.data;
    else return false;
  } catch (error) {
    console.log("Error addNewProductApi", error);
    return false;
  }
};

export { fetchProducts, fetchPinCodesApi, blacklistPinCodesApi, getActiveCategoriesApi, fetchBrandsApi, updateProductInfo, addNewProductApi };
