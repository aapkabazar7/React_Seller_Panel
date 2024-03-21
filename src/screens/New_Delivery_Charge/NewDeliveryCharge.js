import React from "react";
import { getServeAreasApi } from "../../Apis/Delivery";
import { getDeliveryChargesApi } from "../../Apis/DeliveryCharges";
import { toast } from "react-toastify";

function NewDeliveryCharge() {
  const [pincodes, setPincodes] = React.useState([]);
  const [slots, setSlots] = React.useState([]);

  React.useEffect(() => {
    const tempGet = async () => {
      try {
        const deliveryCharges = await getDeliveryChargesApi();
        const allPincodes = await getServeAreasApi();
        if (deliveryCharges && allPincodes) {
          console.log(deliveryCharges.result);
          console.log(allPincodes.areas);
          var allPincodesFromDelivery = deliveryCharges.result.slice(1, 3).flatMap((item, index) => {
            return item.pincodes;
          });
          var remainingPincodes = allPincodes.areas.filter((item, index) => {
            return allPincodesFromDelivery.includes(item.areaName);
          });
          console.log(deliveryCharges.resultc.slice(1, 3));
        }
      } catch (err) {
        toast.error("Error fetching pincodes:");
        console.log(err);
        setPincodes([]);
      }
    };
    tempGet();
  }, []);

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "row", gap: 20, overflowY: "hidden" }}>
      <div className="Container" style={{ flex: 0.3 }}>
        <div>Pincodes List</div>
        <div>
          {pincodes.map((item, index) => {
            return <div>{item.areaName}</div>;
          })}
        </div>
      </div>
      <div className="Container" style={{ flex: 0.7 }}>
        <div>Slots List</div>
        <div>
          {slots.map((item, index) => {
            return (
              <div style={{ marginTop: 20, backgroundColor: "red" }}>
                {item.pincodes.map((pincodes, pincodeIndex) => {
                  return (
                    <div>
                      {pincodes} + {index}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default NewDeliveryCharge;
