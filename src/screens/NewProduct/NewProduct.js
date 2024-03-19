import { Divider } from "@mui/material";
import React, { useState } from "react";
import { ProductCard } from "../Products/ProductCard";
import { addNewProductApi } from "../../Apis/Products";
import { ProductCardModified } from "./ProductCard";

function NewProduct() {
  const renderProduct = () => {
    return products?.map((item, index) => {
      return <ProductCardModified item={item} index={index} />;
    });
  };

  const [page, setPage] = useState(0);
  const [products, setProducts] = useState();

  React.useEffect(() => {
    const getData = async () => {
      try {
        const res = await addNewProductApi(page);
        if (res) setProducts(res.product);
        console.log(res);
      } catch (error) {
        console.log(error, " getData/NewProduct.js");
      }
    };
    getData();
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, margin: "20px 20px", gap: 10 }}>
      <div
        style={{
          backgroundColor: "rgb(255, 255, 255)",
          padding: "15px",
          gap: 10,
          display: "flex",
          flex: 1,
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px #0000001A",
          flexDirection: "column",
        }}>
        <div style={{ flex: 1, display: "flex", gap: 20 }}>
          <div style={{ flex: 2, display: "flex", flexDirection: "row", marginBottom: 10 }}>
            <div style={{ flex: 1, border: "1px solid #ddd", borderRadius: 8 }}>
              <input type="text" placeholder="Search by Product Name, BarCode SKU and HSN" style={{ border: "none", width: "100%", paddingLeft: 10 }} />
            </div>
          </div>
          <div>
            <select style={{ flex: 1, borderRadius: 10, padding: 10, textAlign: "center" }}>
              <option value="today">Sort By A-Z</option>
              <option value="yesterday">Sort by Z-A</option>
            </select>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "row", gap: 20 }}>
            <div style={{ flex: 0.1, display: "flex", flexDirection: "row" }}>
              <button
                style={{
                  backgroundColor: "#FFEF03",
                  padding: "10px 30px",
                  fontSize: 14,
                  color: "#000",
                  width: "fit-content",
                  borderRadius: 10,
                  border: "1px solid #DACC00",
                  maxHeight: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}>
                Search
              </button>
            </div>
            <div style={{ flex: 0.1, display: "flex", flexDirection: "row" }}>
              <button
                style={{
                  backgroundColor: "#fce8e8",
                  padding: "10px 30px",
                  fontSize: 14,
                  color: "#e21b1b",
                  width: "fit-content",
                  borderRadius: 10,
                  border: "1px solid #e84e4e",
                  maxHeight: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "rgb(255, 255, 255)",
          padding: "15px",
          gap: 10,
          display: "flex",
          flex: 1,
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px #0000001A",
          flexDirection: "column",
        }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <span style={{ fontSize: 16, fontWeight: "bold" }}>Add New Product</span>
          <span style={{ fontSize: 16, color: "#aaa" }}>
            New Products: <span style={{ color: "black" }}>100</span>
          </span>
        </div>
        <div id="productList">
          <table style={{ fontSize: 16 }}>
            <thead className="headerRow">
              <tr>
                <th>Item/SKU Code</th>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>MRP</th>
                <th>Sell Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{renderProduct()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default NewProduct;
