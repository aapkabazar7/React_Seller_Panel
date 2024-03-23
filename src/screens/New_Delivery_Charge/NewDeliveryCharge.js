import React from "react";
import { getServeAreasApi } from "../../Apis/Delivery";
import { codWhitelistApi, getDeliveryChargesApi, getDeliveryOffersApi, saveDeliveryChargesApi, setCodWhitelistApi } from "../../Apis/DeliveryCharges";
import { toast } from "react-toastify";
import ChargeCard from "./ChargeCard";
import { Divider } from "@mui/material";
import DeliveryOfferCard from "../DeliveryCharges/DeliveryOfferCard";

function NewDeliveryCharge() {
  const [allPincodes2, setAllPincodes] = React.useState([]);
  const [unsetPincodes, setUnsetPincodes] = React.useState([]);
  const [slots, setSlots] = React.useState([]);
  const [showUnset, setShowUnset] = React.useState(false);
  const [codWhitelist, setCodWhitelist] = React.useState([]);

  const handleCodSave = async () => {
    try {
      toast.loading("Saving changes");
      const result = await setCodWhitelistApi({
        pincodes: codWhitelist,
      });
      if (result) {
        toast.dismiss();
        toast.success("Pincodes updated successfully");
      }
    } catch (err) {
      console.error("Error saving delivery charges:", err);
      toast.dismiss();
      toast.error("Error saving delivery charges");
    }
  };

  const tempGet = async () => {
    try {
      const deliveryCharges = await getDeliveryChargesApi();
      var allPincodes = await getServeAreasApi();
      const codpincodes = await codWhitelistApi();
      setAllPincodes(allPincodes.areas);
      setCodWhitelist(codpincodes.result[0].pincodes);
      if (deliveryCharges && allPincodes) {
        setSlots(deliveryCharges.result);
      }
    } catch (err) {
      toast.error("Error fetching pincodes:");
      console.log(err);
      setUnsetPincodes([]);
    }
  };

  const [deliveryOffer, setDeliveryOffer] = React.useState([]);
  const getDeliveryOffers = async () => {
    try {
      const result = await getDeliveryOffersApi();
      setDeliveryOffer(result.result);
    } catch (err) {
      console.error("Error fetching delivery offers:", err);
      throw err;
    }
  };

  React.useEffect(() => {
    var allPincodesFromDelivery = slots.flatMap((item, index) => {
      return item.pincodes;
    });
    var remainingPincodes = allPincodes2.filter((item, index) => {
      return !allPincodesFromDelivery.includes(item.areaName.substring(0, 6));
    });
    setUnsetPincodes(remainingPincodes);
    setShowUnset(true);
  }, [slots]);
  React.useEffect(() => {
    tempGet();
    getDeliveryOffers().then();
  }, []);

  const handleSaveCharge = async (idx) => {
    var ap = allPincodes2;
    try {
      setShowUnset(false);
      setSlots([]);
      toast.loading("Saving changes");
      const result = await saveDeliveryChargesApi({
        deliveryCharges: slots[idx]._id.deliveryCharges,
        minimumOrderValue: slots[idx]._id.minimumOrderValue,
        pincodes: slots[idx].pincodes,
      });
      if (result) {
        tempGet().then();
        toast.dismiss();
        toast.success("Delivery charges saved successfully");
      }
    } catch (err) {
      console.error("Error saving delivery charges:", err);
      toast.dismiss();
      toast.error("Error saving delivery charges");
    } finally {
      setAllPincodes(ap);
    }
  };

  return (
    <div style={{ padding: 20, width: "95%", display: "flex", gap: 50, flexDirection: "column" }}>
      <div className="Container" style={{ flex: 1 }}>
        <div style={{ flex: 1, display: "flex", marginBottom: 10, gap: 20, justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 18, color: "black", fontWeight: "bold" }}>Slots List</span>
          </div>
          <div style={{ border: "0px solid red", alignItems: "flex-start", flex: 1 }}>
            {showUnset &&
              unsetPincodes.length > 0 &&
              unsetPincodes.map((item, index) => {
                return (
                  <span key={index + 5} style={{ color: "red" }}>
                    {item.areaName.substring(0, 6)}*{"   "}
                  </span>
                );
              })}
          </div>
          <div>
            <button
              onClick={() => {
                setSlots((prev) => {
                  return [...prev, { _id: { deliveryCharges: 0, minimumOrderValue: 0 }, pincodes: [] }];
                });
              }}
              style={{
                cursor: "pointer",
                backgroundColor: "#ffef03",
                color: "#000",
                borderWidth: 1,
                padding: 10,
                fontSize: 14,
                borderRadius: 10,
                borderStyle: "solid",
                borderColor: "#e3d400",
              }}>
              Create New Slot ➕
            </button>
          </div>
        </div>
        <Divider />
        <div style={{ overflowY: "auto", padding: 20 }}>
          {slots.length > 0 &&
            slots.map((item, index) => {
              return <ChargeCard slots={slots} setSlots={setSlots} idx={index} key={index} handleSaveCharge={handleSaveCharge} />;
            })}
        </div>
      </div>
      <div style={{}} className="Container">
        <div style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: "bold" }}>Cash on Delivery Allowed:</span>
          </div>
          <div>
            <button
              onClick={() => {
                handleCodSave().then();
              }}
              className="SaveBtn"
              style={{ fontSize: 16 }}>
              Save
            </button>
          </div>
        </div>
        <Divider />
        <div style={{ display: "flex", margin: 20 }}>
          <textarea
            onChange={(e) => {
              setCodWhitelist(e.target.value.split(","));
            }}
            defaultValue={codWhitelist.join(",")}
            style={{
              resize: "none",
              padding: 10,
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 10,
              color: "#696969",
              width: "100%",
              height: 100,
            }}
          />
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
          width: '100%'
        }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
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
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {deliveryOffer?.map((item, index) => {
            return <DeliveryOfferCard item={item} index={index} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default NewDeliveryCharge;
