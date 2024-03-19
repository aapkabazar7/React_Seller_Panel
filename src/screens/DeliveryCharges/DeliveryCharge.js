import { Divider } from '@mui/material'
import React, { useEffect , useState} from 'react'
import { getDeliveryChargesApi, getDeliveryOffersApi, saveDeliveryChargesApi } from '../../Apis/DeliveryCharges'
import DeliveryChargeCard from './DeliveryChargeCard';
import DeliveryOfferCard from './DeliveryOfferCard';

function DeliveryCharge() {

  const [deliveryOffer, setDeliveryOffer] = useState([]);
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  useEffect(()=>{
    const getDeliveryCharges = async() =>{

      try{
        const result = await getDeliveryChargesApi();
        setDeliveryCharges(result.result);

      }
      catch(err)
      {
        console.error("Error fetching delivery charges:", err);
        throw err;}
    }
    getDeliveryCharges();
    const getDeliveryOffers = async() =>{
  
      try{
        const result = await getDeliveryOffersApi();
        setDeliveryOffer(result.result);
      }
      catch(err)
      {
        console.error("Error fetching delivery offers:", err);
        throw err;}
    }
    getDeliveryOffers();
  },[])

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
        <div style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: "bold" }}>Cart Value/Pin Code Wise Offers </div>
          <div>
            <button
              style={{
                backgroundColor: "#eee",
                padding: "10px 30px",
                fontSize: 14,
                width: "fit-content",
                borderRadius: 10,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#aaa",
              }}>
              Add New
            </button>
          </div>
        </div>
        <Divider />
        <div style={{ flex: 1, display: "flex", flexDirection: 'column', gap: 10 }}>
          {deliveryOffer?.map((item, index) => {
            return <DeliveryOfferCard item={item} index={index} />;
          })}
        </div>
      </div>
      <div
        style={{
          backgroundColor: "rgb(255, 255, 255)",
          padding: "15px",
          gap: 10,
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px #0000001A",
          display: "flex",
          flexDirection: "column",
        }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: "bold" }}>Pin Code Wise Delivery Charges </div>
          <div>
            <button
              style={{
                backgroundColor: "#eee",
                padding: "10px 30px",
                fontSize: 14,
                width: "fit-content",
                borderRadius: 10,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#aaa",
              }}>
              Add New
            </button>
          </div>
        </div>
        <Divider />
        {deliveryCharges?.map((item, index) => {
          return (
            <DeliveryChargeCard item={item} index={index} />
          );
        })}
      </div>
    </div>
  );
}

export default DeliveryCharge