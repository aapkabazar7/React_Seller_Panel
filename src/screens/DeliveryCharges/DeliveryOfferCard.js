import React, { useEffect, useState } from 'react';
import { saveDeliveryoffersApi, searchProductApi } from '../../Apis/DeliveryCharges';
import { liveURL } from '../../config/config';
import { toast } from 'react-toastify';

export default function DeliveryOfferCard({ item, index }) {

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchedData, setSearchedData] = useState([]);
  const [product, setProduct] = useState(item._id.offerOrderProduct);
  const [orderValue, setOrderValue] = useState(item._id.offerOrderAmount);
  const [pincodes, setPincodes] = useState(item.pincodes);

  const searchKeywordHandler = async (e) => {
    setSearchKeyword(e.target.value);
    try {
      if (e.target.value.length > 3) {
        const response = await searchProductApi(e.target.value);
        setSearchedData(response.products);
      }
    }
    catch (err) {
      console.error("Error searching product:", err);
      throw err;
    }
  }
  const handleSave = async () => {
    const data = {
      offerOrderProductId: product._id,
      offerOrderAmount: orderValue,
      pincodes: pincodes
    }
    try {
      const response = await saveDeliveryoffersApi(data);
      toast.success("Offer saved successfully");
    }
    catch (err) {
      console.error("Error saving delivery charges:", err);
      toast.error("Error saving delivery charges");
      throw err;
    }
  }

  useEffect(() => {
    console.log(product)
  },[product])
  return (
    <div style={{ backgroundColor: "rgb(238 238 238 / 49%)", padding: 10, borderRadius: 10, width: "100%", alignItems: "center" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "row", marginBottom: 10 }}>
        <div style={{ flex: 0.8 }}>
          <input type="text" defaultValue={product?.name} onChange={searchKeywordHandler} placeholder="Search by Product" style={{ border: "none", backgroundColor: "white", width: "100%", paddingLeft: 5, borderRadius: 8 }} />
          <div style={{ flex: 1, maxHeight: 300, overflow: 'scroll', overflowX: 'hidden', backgroundColor: 'white', position: 'absolute', width: 700 }}>
            {searchedData?.map((item, index) => {
              return (
                <button onClick={() => { setProduct(item._id) }} key={index} style={{
                  padding: 10, backgroundColor: "#fff", border: 0, marginTop: 10, 
                }}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ flex: 0.2 }}>
                      <img src={`${liveURL}/public/product/${item.id}/${item.images[0]}`} alt={item.name} style={{ width: 50, height: 50, borderRadius: 50 }} />
                    </div>
                    <div style={{ flex: 0.8 }}>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>{item.name}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
        <div style={{ flex: 0.1, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <div style={{ justifyContent: "center", alignItems: "center" }}>Order Value</div>
        </div>
        <div style={{ flex: 0.1, display: "flex", flexDirection: "row" }}>
          <input onChange={(e)=>{setOrderValue(e.target.value)}} defaultValue={item._id.offerOrderAmount} type="text" placeholder="Minimum Order value" style={{ border: "none", backgroundColor: "white", width: "100%", paddingLeft: 5, borderRadius: 8 }} />
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "row" }}>
        <div style={{ flex: 0.8 }}>
          <textarea onChange={(e)=>{setPincodes(e.target.value).split(',')}} defaultValue={item.pincodes.join(',')} placeholder="Pincodes" style={{ border: "none", backgroundColor: "white", color: "#696969", width: "100%", minHeight: 100, maxHeight: "auto", padding: 10, borderRadius: 8, resize: "none", "&onFocus": { backgroundColor: "red" } }} />
        </div>
        <div style={{ flex: 0.2, display: "flex", flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
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
  )
}