import { useState } from "react";
import {
  cancelOrder,
  confirmPendingOrder,
  deliverOrderApi,
  dispatchProcessedOrder,
  getOrders,
  orderDetailsApi,
  processConfirmedOrder,
  restoreOrderApi,
} from "../../Apis/orders";
import { Navigate, useNavigate } from "react-router-dom";
import { printInvoice } from "../../utils/toast";
import { toast } from "react-toastify";
import { Divider } from "@mui/material";

function formatTo12HourTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hours12 = hours % 12 || 12;
  const period = hours < 12 ? "AM" : "PM";
  const formattedTime = `${hours12}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
  return formattedTime;
}

function calculateTimeDifference(date1, date2) {
  if (!date1 || !date2) return "";
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const differenceMs = Math.abs(d1 - d2);
  const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
  let formattedDifference = "";
  if (days > 0) {
    formattedDifference += `${days}d `;
  }
  if (hours > 0) {
    formattedDifference += `${hours}h `;
  }
  formattedDifference += `${minutes}m`;
  console.log("Calculating for", date1, date2, formattedDifference);
  return formattedDifference;
}
const SingleOrderCard = ({ item, index, fetchData, setData, currentPage, setCurrentPageNumber, latestRequestTimestamp }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  function refreshPage() {
    latestRequestTimestamp.current = Date.now();
    setCurrentPageNumber(0);
    setData([]);
    fetchData().then();
  }

  const data = [
    {
      title: "Placed",
      status: "pending",
      value: item.date,
    },
    { title: "Checking", status: "confirmed", value: item.confirmedStateTime },
    { title: "Processed", status: "processed", value: item.processedStateTime },
    { title: "Dispatched", status: "dispatched", value: item.dispatchedStateTime },
    { title: "Delivered", status: "delivered", value: item.deliveredDate },
  ];

  const acceptPendingOrder = async (id) => {
    await confirmPendingOrder(id);
    refreshPage();
  };

  const processOrder = async (id) => {
    await processConfirmedOrder(id);
    refreshPage();
  };

  const dispatchOrder = async (id) => {
    await dispatchProcessedOrder(id);
    refreshPage();
  };

  const restoreOrder = async (id) => {
    await restoreOrderApi(id);
    refreshPage();
  };

  const printOrder = async (id) => {
    const result = await orderDetailsApi(item.id);
    console.log(result);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    const temp = result.order;
    const data = {
      invoice: {
        seller: {
          phoneNo: result.order.seller.phoneNo,
          sellerInformation: {
            name: temp.seller.sellerInformation.name,
            fullAddress: temp.seller.sellerInformation.fullAddress,
          },
        },
        deliveryCharge: temp.deliveryCharge,
        amount: temp.amount,
        orderAddress: {
          name: temp.address.name,
          line1: temp.address.line1,
          line2: temp.address.line2,
          fullAddress: temp.address.fullAddress,
          mobileNo: temp.address.mobileNo,
        },
        customerMessage: temp.customerMessage,
        deliveryDate: formatDate(temp.deliveryDate),
        deliveryTime: {
          slot: temp.deliveryTime.slot,
        },
        paymentMode: temp.paymentMode,
        id: temp.id,
        date: new Date(),
        invoiceId: `1-${temp.id}`,
      },
    };
    let tempArray = [];
    temp.products.forEach((element) => {
      tempArray.push({
        hsnCode: element.hsnCode,
        recommendedAttribute: element.recommendedAttribute,
        sellPrice: element.sellPrice,
        quantity: element.quantity,
        name: element.name,
      });
    });
    data.invoice.products = tempArray;
    console.log(data, id);
    printInvoice(data);
  };

  const deliverOrder = async (id) => {
    await deliverOrderApi(id, otp);
    refreshPage();
  };

  const cancelorder = async (id) => {
    await cancelOrder(id);
    refreshPage();
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  }

  const renderBtn = (status, id) => {
    switch (status) {
      case "pending":
        return (
          <>
            <button className="greenBtn" onClick={() => acceptPendingOrder(id)}>
              Order Accept
            </button>
            <button className="greyBtn" onClick={() => printOrder(id)}>
              Print
            </button>
            <button className="greyBtn">Edit</button>
            <button className="redBtn" onClick={() => cancelorder(id)}>
              Order cancel
            </button>
          </>
        );
      case "confirmed":
        return (
          <>
            <button className="greenBtn" onClick={() => processOrder(id)}>
              Process Order
            </button>
            <button className="greyBtn" onClick={() => printOrder(id)}>
              Print
            </button>
            <button className="greyBtn">Edit</button>
            <button className="redBtn" onClick={() => cancelorder(id)}>
              Order cancel
            </button>
          </>
        );
      case "processed":
        return (
          <>
            <button className="greenBtn" onClick={() => dispatchOrder(id)}>
              Dispatch Order
            </button>
            <button className="greyBtn" onClick={() => printOrder(id)}>
              Print
            </button>
            <button className="greyBtn">Edit</button>
            <button className="redBtn" onClick={() => cancelorder(id)}>
              Order cancel
            </button>
          </>
        );
      case "dispatched":
        return (
          <>
            <button className="greenBtn" onClick={() => deliverOrder(id)}>
              Order Deliver
            </button>
            <button className="redBtn" onClick={() => cancelorder(id)}>
              Order cancel
            </button>
          </>
        );
      case "cancelled":
        return (
          <>
            {item.userCancelStatus ? null : (
              <button className="greyBtn" onClick={() => restoreOrder(id)}>
                Restore
              </button>
            )}
          </>
        );
      case "delivered":
        return (
          <>
            <button className="greyBtn" onClick={() => printOrder(id)}>
              Print
            </button>
          </>
        );
      default:
        return null;
    }
  };

  const renderStatus = (item) => {
    switch (item.status) {
      case "pending":
        return (
          <>
            <p className="blacktext">Pending</p>
          </>
        );
      case "confirmed":
        return (
          <>
            <p className="blacktext">Confirmed</p>
          </>
        );
      case "processed":
        return (
          <>
            <p className="blacktext">Processed</p>
          </>
        );
      case "dispatched":
        return (
          <>
            <input className="otpInputBox" value={otp} placeholder="Enter Otp" onChange={(e) => setOtp(e.target.value)} />
            <span className="blacktext" style={{ textAlign: "center" }}>
              OTP : {item.otp}
            </span>
          </>
        );
      case "cancelled":
        return (
          <>
            <p className="blacktext">{item.userCancelStatus === true ? "Cancelled By User" : "Cancelled By Admin"}</p>
          </>
        );
      case "delivered":
        return (
          <>
            <p className="blacktext">Delivered</p>
          </>
        );
      default:
        return null;
    }
  };

  function renderDifferences(index) {
    if (index - 1 <= 0) return null; // No differences for the first item

    const currentItem = data[index - 1];
    const previousItem = data[index - 2];

    const timeDifference = calculateTimeDifference(currentItem.value, previousItem.value);

    return <span>{timeDifference}</span>;
  }

  return (
    <div
      style={{
        marginTop: 10,
        marginBottom: 10,
        boxShadow: "0px 0px 10px #ccc",
        padding: 20,
        borderRadius: 10,
      }}>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 20,
          marginBottom: 10,
        }}>
        <div className="CELL 1" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <p style={{}} className="greytext">
            Order Id
          </p>
          <p style={{}}>{item.id}</p>
        </div>
        <div className="CELL 1" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <p style={{}} className="greytext">
            Order Date
          </p>
          <p style={{}}>{formatDate(item.date)}</p>
        </div>

        <div className="CELL 2" style={{ display: "flex", flexDirection: "column", flex: 2 }}>
          <p style={{}} className="greytext">
            Time and Slot
          </p>
          <p style={{}}>{formatDate(item.deliveryDate)}</p>
          <p style={{ fontWeight: "bold" }}>{item.deliveryTime?.slot}</p>
        </div>

        <div className="CELL 3" style={{ display: "flex", flexDirection: "column", flex: 5 }}>
          <p style={{}} className="greytext">
            Address
          </p>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <span style={{ fontWeight: "bold", textAlign: "left", fontSize: 18, textTransform: "capitalize" }}>
              {item.address?.name} {item.address?.mobileNo}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <p style={{ textTransform: "capitalize" }}>
              {item.address?.line1} {item.address?.line2} <span style={{ fontWeight: "bold" }}> -{item.address?.pincode}</span>
            </p>
          </div>
        </div>

        <div className="CELL 5" style={{ display: "flex", flexDirection: "row", flex: 1 }}>
          <div style={{}}>
            <p style={{}} className="greytext">
              Payment
            </p>
            <p style={{ textTransform: "capitalize" }}>Mode: {item.paymentMode} </p>
            <p style={{ color: "black", fontWeight: "bold" }}>₹ {item.amount}</p>
          </div>
        </div>
        <div className="CELL 4" style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "flex-start", alignItems: "flex-start" }}>
          <p style={{}} className="greytext">
            Status
          </p>
          {renderStatus(item)}
        </div>
        <div className="modifiedBtn CELL 6" style={{ flex: 1, flexDirection: "column", display: "flex", gap: 10 }}>
          {renderBtn(item.status, item._id)}
        </div>
      </div>
      <Divider />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          flexDirection: "row",
        }}>
        {item.status !== "cancelled" ? (
          data.map((_, index) => (
            <div style={{ flex: index === data.length - 1 ? 0.5 : 1, display: "flex" }} key={index}>
              <div style={{ flex: 1, display: "flex" }}>
                <div style={{ fontSize: 15, flex: 1, justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontWeight: item.status === data[index].title.toLowerCase() ? "bold" : "normal",
                      color: item.status === data[index].title.toLowerCase() ? "green" : "black",
                      fontSize: item.status === data[index].title.toLowerCase() ? 18 : 14,
                    }}>
                    {data[index].title}
                  </span>
                  {formatTo12HourTime(data[index].value)}
                  {}
                </div>
              </div>
              {index !== data.length - 1 && (
                <div style={{ display: "flex", flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <div
                    style={{
                      flex: 1,
                      border: "0px solid red",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                    }}>
                    <div style={{ marginBottom: 10, marginRight: 15 }}>{renderDifferences(index)}</div>
                    <div>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ height: 45, width: 45 }}
                        transform="rotate(90)">
                        <path
                          d="M12 4V20M12 4L8 8M12 4L16 8"
                          stroke="#000000"
                          strokeWidth="0.672"
                          strokeLinecap="round"
                          strokeLinejoin="round"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Cancelled</p>
        )}
      </div>
    </div>
  );
};
export default SingleOrderCard;
