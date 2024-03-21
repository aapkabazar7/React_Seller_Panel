import React, { useEffect, useRef, useState } from "react";
import { saveDeliveryoffersApi, searchProductApi } from "../../Apis/DeliveryCharges";
import { liveURL } from "../../config/config";
import { toast } from "react-toastify";
import { Autocomplete, TextField } from "@mui/material";
import AlertDialogSlide from "../DeliverySlot/SlotPopup";

export default function DeliveryOfferCard({ item, index }) {
  const [searchedData, setSearchedData] = useState([]);
  const [orderValue, setOrderValue] = useState(item._id.offerOrderAmount);
  const [pincodes, setPincodes] = useState(item.pincodes);
  const [product, setProduct] = useState(item._id.offerOrderProduct || {});
  const [showChange, setShowChange] = useState(false);
  const [searchQuery, setSearchQuery] = useState(item._id.offerOrderProduct?.name || "");

  React.useEffect(() => {
    if (searchQuery) {
      searchKeywordHandler(searchQuery);
    }
  }, [searchQuery]);

  const searchKeywordHandler = async (e) => {
    try {
      if (e.length > 3) {
        const response = await searchProductApi(e);
        setSearchedData(response.products);
      }
    } catch (err) {
      console.error("Error searching product:", err);
      throw err;
    }
  };

  // React.useEffect(() => {
  //   if (item?._id?.offerOrderProduct) {
  //     setSearchQuery(item._id.offerOrderProduct.name);
  //   }
  // }, [item]);
  const toastId = React.useRef(null);

  const handleSave = async () => {
    const data = {
      offerOrderProductId: product._id,
      offerOrderAmount: orderValue,
      pincodes: pincodes,
    };
    try {
      toastId.current = toast.loading("Saving offer", {
        autoClose: false,
      });
      await saveDeliveryoffersApi(data);
      toast.dismiss();
      toast.success("Offer saved successfully");
    } catch (err) {
      console.error("Error saving delivery charges:", err);
      toast.dismiss();
      toast.error("Error saving delivery charges");
      throw err;
    }
  };

  return (
    <div style={{ backgroundColor: "#f0f0f0", padding: 10, borderRadius: 10, width: "100%", alignItems: "center" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "row", marginBottom: 10 }}>
        <div style={{ display: "flex", flex: 0.8, flexDirection: "row", alignItems: "flex-end" }}>
          {/* <div
            onClick={() => {
              setShowChange(true);
            }}
            style={{ flex: 1, border: "0px solid red", textDecoration: "underline", textDecorationStyle: "dashed" }}>
            <span style={{ cursor: "pointer", verticalAlign: "top" }}> {item._id.offerOrderProduct?.name}</span>
          </div> */}
          <input
            type="text"
            value={product.name}
            onClick={() => {
              setShowChange(true);
            }}
            placeholder="Search Product"
            style={{ display: "flex", flex: 1 }}
          />

          <AlertDialogSlide open={showChange} setOpen={setShowChange} heading={"Change product"}>
            <input type="text" style={{ width: "100%", margin: 10 }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <table style={{ width: "100%" }}>
              <thead>
                <tr className="headerRow">
                  <th>Sr No</th>
                  <th>Image</th>
                  <th>HSN Code</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {searchedData.map((item, index) => (
                  <tr
                    className="tablerow"
                    onClick={() => {
                      setProduct(item);
                      setShowChange(false);
                    }}
                    style={{ cursor: "pointer" }}
                    key={index}>
                    <td style={{ width: "10%" }}>
                      <span>{index + 1}</span>
                    </td>
                    <td style={{ width: "20%" }}>
                      <img src={`${liveURL}/public/product/${item.id}/${item.images[0]}`} style={{ width: 50, height: 50 }} alt="" />
                    </td>
                    <td style={{ width: "20%" }}>
                      <span style={{ textTransform: "capitalize" }}>{item.hsnCode}</span>
                    </td>
                    <td style={{ width: "70%" }}>
                      <span style={{ textTransform: "capitalize" }}>{item.name}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AlertDialogSlide>
        </div>
        <div style={{ flex: 0.1, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <div style={{ justifyContent: "center", alignItems: "center" }}>Order Value</div>
        </div>
        <div style={{ flex: 0.1, display: "flex", flexDirection: "row" }}>
          <input
            onChange={(e) => {
              setOrderValue(e.target.value);
            }}
            defaultValue={item._id.offerOrderAmount}
            type="text"
            placeholder="Minimum Order value"
            style={{ border: "none", backgroundColor: "white", width: "100%", padding: 10, borderRadius: 8 }}
          />
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "row" }}>
        <div style={{ flex: 0.8 }}>
          <textarea
            onChange={(e) => {
              setPincodes(e.target.value.split(","));
            }}
            defaultValue={item.pincodes.join(",")}
            placeholder="Pincodes"
            style={{
              border: "none",
              backgroundColor: "white",
              color: "#808080",
              width: "100%",
              minHeight: 100,
              maxHeight: "auto",
              padding: 10,
              borderRadius: 8,
              resize: "none",
              "&onFocus": { backgroundColor: "red" },
            }}
          />
        </div>
        <div style={{ flex: 0.2, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: "#0d9e67",
              padding: "10px 30px",
              fontSize: 14,
              color: "#fff",
              width: "fit-content",
              borderRadius: 10,
              border: "none",
              maxHeight: 40,
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
