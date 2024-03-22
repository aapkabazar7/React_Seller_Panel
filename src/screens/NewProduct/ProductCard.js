import { toast } from "react-toastify";
import { addNewProductSeller, updateProductInfo } from "../../Apis/Products";
import { baseURL, liveURL } from "../../config/config";
import { useState, useEffect } from "react";
export const ProductCardModified = ({ item, index }) => {

  const updateInfo = async () => {
    try {
      const res = await addNewProductSeller(item._id,item.CategoryId);
      if (res && res.success) toast.success("Item added successfully");
    } catch (error) {
      console.log(error, "Product Card:26.js");
    }
  };

  return (
    <>
      <tr key={index}>
        <td>
          <div style={{ justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", gap: 5 }}>
            <p className="blacktext">SKU</p>
            <p className="greytext">{item.sku}</p>
            <p className="blacktext">GSTIN</p>
            <p className="greytext">{item.hsnCode}</p>
          </div>
        </td>
        <td>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center" }}>
            <div>
              <img alt="" src={`${liveURL}/public/product/${item.id}/${item.images[0]}`} className="productImage" />
            </div>
          </div>
        </td>
        <td>
          <div>
            <p style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }} className="blacktext">
              {item.name}
            </p>
            <p style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }} className="greytext">
              {item.recommendedAttribute}
            </p>
          </div>
        </td>
        <td>
          <p className="blacktext" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            ₹ {item.price}
          </p>
        </td>
        <td>
          <p className="blacktext" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            ₹ {item.sellPrice}
          </p>
        </td>
        <td>
          <button
            style={{ backgroundColor:  "#0d9e67", border:  "none", color: "white" }}
            onClick={() => {
              updateInfo();
            }}
            className="SaveBtn">
            ADD
          </button>
        </td>
      </tr>
    </>
  );
};
