import React, { useEffect, useMemo, useState } from "react";
import "./Products.css";
import AllProductList from "./AllProductList";
import { fetchBrandsApi, fetchProducts, getActiveCategoriesApi } from "../../Apis/Products";
import { ToastContainer } from "react-toastify";

const Products = () => {
  const [tree, setTree] = useState();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryID, setSelectedSubCategoryId] = useState(null);
  const [selectedLeafCategoryId, setSelectedLeafCategoryId] = useState(null);
  const [brandName, setBrandName] = useState(null);
  const [selectedbrandId, setSelectedBrandId] = useState(null);
  const [categoryItem, setCategoryItem] = useState(null);
  const [subCategoryItem, setSubCategoryItem] = useState(null);
  const [products, setProducts] = useState([]);
  const [noMoreProducts, setNoMoreProducts] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [page, setPage] = useState(0);
  const [searchKeyword,setSearchKeyword] = useState("");

  const getData = async () => {
    if (!loadingProducts) {
      setLoadingProducts(true);
      try {
        const result = await fetchProducts(selectedCategoryId, selectedSubCategoryID, selectedLeafCategoryId, selectedbrandId, searchKeyword, page);
        if (result.success === true) {
          if(page === 0){
            setProducts(result.products);
          }else{
            setProducts((data) => [...data, ...result.products]);
          }
        } else {
          setNoMoreProducts(true);
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching data");
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  React.useEffect(() => {
    console.log(searchKeyword)
    getData().then();
  }, [page]);
  useEffect(()=>{
    console.log(searchKeyword);
    if(page === 0){

      getData().then();
    }else{
      setPage(0);
    }
  },[searchKeyword])

  const mapCategories = () => {
    return tree?.map((item, index) => {
      return (
        <option key={index} value={item._id}>
          {item.name}
        </option>
      );
    });
  };

  const handleSetCategory = (value) => {
    setSelectedCategoryId(value);
    let data = tree.find((item) => item._id === value);
    setCategoryItem(data.children);
    setSelectedSubCategoryId(null);
    setSubCategoryItem(null);
  };
  const handleSetSubCategory = (value) => {
    let data = categoryItem.find((item) => item._id === value);
    setSubCategoryItem(data.children);
    setSelectedSubCategoryId(value);
  };

  const mapSubCategories = () => {
    if (selectedCategoryId) {
      return categoryItem.map((subItem, index) => (
        <option style={{ textTransform: "capitalize" }} key={index} value={subItem._id}>
          {subItem.name}
        </option>
      ));
    }
    return null;
  };

  const mapLeafCategories = () => {
    if (selectedSubCategoryID) {
      return subCategoryItem.map((leafItem, index) => (
        <option style={{ textTransform: "capitalize" }} key={index} value={leafItem._id}>
          {leafItem.name}
        </option>
      ));
    }
    return null;
  };

  const mapBrandNames = () => {
    return brandName.map((item, index) => {
      return (
        <option style={{ textTransform: "capitalize" }} key={index} value={item._id}>
          {item.name}
        </option>
      );
    });
  };

  useEffect(() => {
    const getCategories = async () => {
      fetchBrandsApi().then((res) => {
        if (res.success) {
          setBrandName(res.brands);
        } else {
          console.log("Brand Names cannot be fetched");
        }
      });
      const result = await getActiveCategoriesApi();
      if (result.success === true) {
        setTree(result.tree);
      } else {
        console.log("error in fetching categories", result.message);
      }
    };
    getCategories();
  }, []);

  return (
    <div>
      <div
        style={{
          backgroundColor: "rgb(255, 255, 255)",
          padding: "15px",
          gap: 10,
          margin: "20px",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px #0000001A",
          display: "flex",
          flexDirection: "column",
        }}>
        <div style={{ flexDirection: "row", display: "flex", flex: 1, gap: 20, border: "0px solid red" }}>
          <div style={{ flexDirection: "row", flex: 0.6, display: "flex", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 24, fontWeight: "bolder" }}>Filter</span>
            </div>
            <select
              style={{ flex: 1, borderRadius: 10, textAlign: "center", border: '1px solid #eee' }}
              onChange={(event) => {
                handleSetCategory(event.target.value);
              }}>
              <option value="">Category</option>
              {mapCategories()}
            </select>
            <select style={{ flex: 1, borderRadius: 10, textAlign: "center" , border: '1px solid #eee'}} onChange={(event) => handleSetSubCategory(event.target.value)}>
              <option value="">Sub Category</option>
              {selectedCategoryId !== null ? mapSubCategories() : <></>}
            </select>
            <select style={{ flex: 1, borderRadius: 10, textAlign: "center", border: '1px solid #eee' }} onChange={(event) => setSelectedLeafCategoryId(event.target.value)}>
              <option value="">Leaf Category</option>
              {selectedSubCategoryID !== null ? mapLeafCategories() : <></>}
            </select>
            <select style={{ flex: 1, borderRadius: 10, textAlign: "center", border: '1px solid #eee' }}>
              <option value="today">Brands</option>
              {brandName !== null ? mapBrandNames() : <></>}
            </select>
          </div>
          <div style={{ flexDirection: "row", flex: 0.4, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ flex: 0.5, gap: 20, justifyContent: "flex-end", display: "flex", flexDirection: "row" }}>
              <button
                onClick={() => {
                  setProducts([]);
                  getData().then();
                }}
                style={{
                  cursor: "pointer",
                  backgroundColor: "#ffef03",
                  color: "#000",
                  borderWidth: 1,
                  padding: 10,
                  fontSize: 14,
                  width: "50%",
                  borderRadius: 10,
                  borderStyle: "solid",
                  borderColor: "#dacc00",
                }}>
                Search
              </button>
              <button
                onClick={() => {
                  setProducts([]);
                  getData().then();
                }}
                style={{
                  cursor: "pointer",
                  backgroundColor: "#fce8e8",
                  color: "#000",
                  borderWidth: 1,
                  padding: 10,
                  fontSize: 14,
                  width: "50%",
                  borderRadius: 10,
                  borderStyle: "solid",
                  borderColor: "#e21b1b",
                }}>
                Clear
              </button>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "row", gap: 20 }}>
          <div style={{ flex: 0.6, display: "flex", gap: 20 }}>
            <input style={{ flex: 5, paddingLeft: 10, border: '1px solid #eee' }} placeholder="Search by Product Name,BarCode, SKU and HSN" onBlur={(e)=>{setSearchKeyword(e.target.value)}}/>
            <select style={{ flex: 1, borderRadius: 10, textAlign: "center" , border: '1px solid #eee'}}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="custom">Custom</option>
            </select>
            <select style={{ flex: 1, borderRadius: 10, textAlign: "center" , border: '1px solid #eee' }}>
              <option value="today">Sort By A-Z</option>
              <option value="yesterday">Sort by Z-A</option>
            </select>
          </div>
          <div style={{ flexDirection: "row", gap: 20, flex: 0.4, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", flex: 0.5, gap: 20, justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setProducts([]);
                  getData().then();
                }}
                style={{
                  cursor: "pointer",
                  backgroundColor: "#e7f5f0",
                  color: "#000",
                  borderWidth: 1,
                  padding: 10,
                  fontSize: 14,
                  width: "50%",
                  borderRadius: 10,
                  borderStyle: "solid",
                  borderColor: "#0d9e67",
                }}>
                Import
              </button>
              <button
                onClick={() => {
                  setProducts([]);
                  getData().then();
                }}
                style={{
                  cursor: "pointer",
                  backgroundColor: "#f2f2f2",
                  color: "#000",
                  borderWidth: 1,
                  padding: 10,
                  fontSize: 14,
                  width: "50%",
                  borderRadius: 10,
                  borderStyle: "solid",
                  borderColor: "#cecece",
                }}>
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
      <AllProductList page={page} setPage={setPage} keyword={searchKeyword} loadingProducts={loadingProducts} products={products} noMoreProducts={noMoreProducts} />
    </div>
  );
};

export default Products;
