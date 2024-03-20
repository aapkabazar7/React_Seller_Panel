import { useEffect, useState } from "react";
import React from "react";
import { saveDeliveryChargesApi } from "../../Apis/DeliveryCharges";

export default function DeliveryChargeCard({ item, index }) {

    const [data,setData] = useState({
        deliveryCharges: item._id.deliveryCharges,
        minimumOrderValue: item._id.minimumOrderValue,
        pincodes: item.pincodes,
    });

    useEffect(() => {
        console.log(data);
    }, [data])

    const handleSaveCharge = async () => {
        try {
            const result = await saveDeliveryChargesApi(data);
            console.log(result);
        }
        catch (err) {
            console.error("Error saving delivery charges:", err);
            throw err;
        }
    }
    return (
        <div key={index} style={{ backgroundColor: "rgb(238 238 238 / 49%)", padding: 10, borderRadius: 10, width: "100%", alignItems: "center" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "row", marginBottom: 10 }}>
                <div style={{ flex: 0.8, flexDirection: "row", display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
                        <div style={{ justifyContent: "center", alignItems: "center" }}>Delivery Charge</div>
                        <div style={{ justifyContent: "center", alignItems: "center" }}>
                            {" "}
                            <input onChange={(e)=>{setData(prev=>({...prev,deliveryCharges: Number(e.target.value)}))}} defaultValue={item._id.deliveryCharges} type="text" placeholder="₹ 0" style={{ border: "none", backgroundColor: "white", width: "20%", paddingLeft: 5, borderRadius: 8, textAlign: 'center' }} />
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
                        <div style={{ justifyContent: "center", alignItems: "center" }}>Order Value</div>
                        <div style={{ justifyContent: "center", alignItems: "center" }}>
                            {" "}
                            <input onChange={(e)=>{setData(prev=>({...prev,minimumOrderValue: Number(e.target.value)}))}} type="text" defaultValue={item._id.minimumOrderValue} placeholder="₹ 0" style={{ border: "none", backgroundColor: "white", width: "20%", paddingLeft: 5, borderRadius: 8, textAlign: 'center' }} />
                        </div>
                    </div>
                </div>
                <div style={{ flex: 0.1, display: "flex", flexDirection: "row", justifyContent: 'right' }}>
                    <button
                        onClick={handleSaveCharge}
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
            <div style={{ flex: 1, display: "flex", flexDirection: "row" }}>
                <div style={{ flex: 1 }}>
                    <textarea onChange={(e)=>{setData(prev=>({...prev,pincodes: (e.target.value).split(',')}))}} defaultValue={item.pincodes.join(',')} placeholder="Pincodes" style={{ backgroundColor: "white", color: "#696969", minHeight: 100, border: "none", maxHeight: "auto", width: "100%", padding: 10, borderRadius: 8, resize: "none", "&onFocus": { backgroundColor: "red" } }} />
                </div>
            </div>
        </div>
    );
}