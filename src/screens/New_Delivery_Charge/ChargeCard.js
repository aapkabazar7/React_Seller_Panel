import React, { useState } from "react";

function ChargeCard({ handleSaveCharge, setSlots, slots, idx }) {
  return (
    <div style={{ marginTop: 20, gap: 20, display: "flex", flexDirection: "column", boxShadow: "0px 0px 10px #ccc", padding: 10, borderRadius: 10 }}>
      <div style={{ display: "flex", flex: 1, gap: 10, flexDirection: "row" }}>
        <div style={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "center" }}>
          Delivery Charge:{" "}
          <input
            onChange={(e) => {
              console.log(e.target.value);
              setSlots((prev) => {
                const updatedSlots = [...prev];
                updatedSlots[idx]._id.deliveryCharges = e.target.value;
                return updatedSlots;
              });
            }}
            style={{ marginLeft: 20 }}
            defaultValue={slots[idx]._id.deliveryCharges}
          />
        </div>
        <div style={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "center" }}>
          Min Order Value:
          <input onChange={(e) => {}} style={{ marginLeft: 20 }} defaultValue={slots[idx]._id.minimumOrderValue} />
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <button
            onClick={() => {
              handleSaveCharge(idx);
            }}
            style={{ cursor: "pointer" }}
            className="SaveBtn">
            Save
          </button>
        </div>
      </div>
      <textarea
        onChange={(e) => {
          console.log(e.target.value);
          setSlots((prev) => {
            const updatedSlots = [...prev]; // Create a copy of the array
            if (Array.isArray(updatedSlots[idx].pincodes)) {
              // If pincodes is an array
              updatedSlots[idx].pincodes = e.target.value.split(",");
            } else {
              // If pincodes is a string
              updatedSlots[idx].pincodes = e.target.value;
            }
            return updatedSlots;
          });
        }}
        defaultValue={slots[idx].pincodes}
        style={{ resize: "none", padding: 10, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10, color: "#696969", width: "95%", height: 100 }}
      />
    </div>
  );
}

export default ChargeCard;
