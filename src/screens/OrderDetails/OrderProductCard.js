import { baseURL, liveURL } from "../../config/config";
import { useState, useEffect } from "react";
export const OrderDetailsProductCard = ({ item, index }) => {
  return (
    <>
      <tr key={index}>
        <td>
          <span>{index + 1}</span>
        </td>
        <td>
          <div style={{ justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", gap: 5 }}>
            <p className="blacktext">SKU</p>
            <p className="greytext">{item.sku}</p>
            <p className="blacktext">GSTIN</p>
            <p className="greytext">{item.hsnCode}</p>
          </div>
        </td>
        <td>
          <div style={{ display: "flex", gap: 10 }}>
            <div>
              <img src={`${liveURL}/public/product/${item.id}/${item.images[0]}`} className="productImage" />
            </div>
            <div>
              <p className="blacktext">{item.name}</p>
              <p className="greytext">{item.recommendedAttribute}</p>
            </div>
          </div>
        </td>
        <td>
          <span>{item.price}</span>
        </td>
        <td>
          <span>{item.sellPrice}</span>
        </td>
        <td>
          <span>{item.quantity}</span>
        </td>
        <td>
          <span>{item.quantity * item.sellPrice}</span>
        </td>
      </tr>
    </>
  );
};
