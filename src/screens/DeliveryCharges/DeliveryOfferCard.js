import React, { useEffect, useRef, useState } from "react";
import { saveDeliveryoffersApi, searchProductApi } from "../../Apis/DeliveryCharges";
import { liveURL } from "../../config/config";
import { toast } from "react-toastify";
import { Autocomplete, TextField } from "@mui/material";

export default function DeliveryOfferCard({ item, index }) {
  const [searchedData, setSearchedData] = useState([]);
  const [product, setProduct] = useState(item._id.offerOrderProduct);
  const [orderValue, setOrderValue] = useState(item._id.offerOrderAmount);
  const [pincodes, setPincodes] = useState(item.pincodes);
  const [searchQuery, setSearchQuery] = useState(
    item && item._id && item._id.offerOrderProduct && item._id.offerOrderProduct.name ? item._id.offerOrderProduct.name : ""
  );
  console.log(item);
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

  const handleSave = async () => {
    const data = {
      offerOrderProductId: product._id,
      offerOrderAmount: orderValue,
      pincodes: pincodes,
    };
    try {
      await saveDeliveryoffersApi(data);
      toast.success("Offer saved successfully");
    } catch (err) {
      console.error("Error saving delivery charges:", err);
      toast.error("Error saving delivery charges");
      throw err;
    }
  };

  useEffect(() => {
    console.log(product);
  }, [product]);
  return (
    <div style={{ backgroundColor: "rgb(238 238 238 / 49%)", padding: 10, borderRadius: 10, width: "100%", alignItems: "center" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "row", marginBottom: 10 }}>
        <div style={{ flex: 0.8 }}>
          <Autocomplete
            id="product-search"
            clearOnBlur
            options={searchedData}
            getOptionLabel={(option) => option.name}
            onChange={(_, value) => {
              setProduct(value);
              setSearchQuery(value.name);
            }}
            inputValue={searchQuery}
            onInputChange={(e, newInputValue) => {
              searchKeywordHandler(newInputValue);
              setSearchQuery(newInputValue);
            }}
            renderInput={(params) => <TextField {...params} label="Search Product" variant="standard" />}
          />{" "}
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
              setPincodes(e.target.value).split(",");
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
