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
  // Parse the strings into Date objects
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(d1 - d2);

  // Calculate days, hours, and minutes
  const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));

  // Construct the formatted time difference string
  let formattedDifference = "";
  if (days > 0) {
    formattedDifference += `${days}d `;
  }
  if (hours > 0) {
    formattedDifference += `${hours}h `;
  }
  formattedDifference += `${minutes}m`;

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
      value: formatTo12HourTime(item.date),
      diff: calculateTimeDifference(item.date, item.confirmedStateTime ? item.confirmedStateTime : new Date()),
    },
    { title: "Checking", status: "confirmed", value: formatTo12HourTime(item.confirmedStateTime), diff: "5m " },
    { title: "Processed", status: "processed", value: formatTo12HourTime(item.processedStateTime), diff: "10m " },
    { title: "Dispatched", status: "dispatched", value: formatTo12HourTime(item.dispatchedStateTime), diff: "5m " },
    { title: "Delivered", status: "delivered", value: formatTo12HourTime(item.deliveredDate), diff: "20m " },
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
  return (
    <div
      style={{
        marginTop: 10,
        marginBottom: 10,
        boxShadow: "0px 0px 10px #ccc",
        padding: 10,
        borderRadius: 10,
      }}>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          gap: 20,
        }}>
        <div className="CELL 1" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <h6 style={{}}>{formatDate(item.date)}</h6>
        </div>

        <div className="CELL 2" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <h6 style={{}}>{formatDate(item.deliveryDate)}</h6>
          <h6 style={{}}>{item.deliveryTime?.slot}</h6>
        </div>

        <div className="CELL 3" style={{ display: "flex", flexDirection: "column", flex: 5 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <p style={{}}>
              {item.address?.line1} {item.address?.line2}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <span style={{ fontWeight: "normal", textAlign: "left", textTransform: "capitalize" }}>
              {item.address?.name} {item.address?.mobileNo}
            </span>
          </div>
        </div>
        {/* <div className="CELL 4" style={{ display: "flex", flexDirection: "column", flex: 2, justifyContent: "center", alignItems: "center" }}>
          {renderStatus(item)}
        </div> */}
        <div className="CELL 5" style={{ display: "flex", flexDirection: "row", flex: 2 }}>
          <div style={{}}>
            <p style={{ textTransform: "capitalize" }}>Payment Mode</p>
            <p style={{}}>Order Amount</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <p style={{ textTransform: "capitalize" }}>{item.paymentMode}</p>
            <p style={{}}>₹ {item.amount}</p>
          </div>
        </div>
        <div className="modifiedBtn CELL 6" style={{ flex: 1, flexDirection: "column", display: "flex", gap: 10 }}>
          {renderBtn(item.status, item._id)}
        </div>
      </div>
      <Divider />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 10, flex: 1, flexDirection: "row" }}>
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
                  {data[index].value}
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
                    <div style={{ marginBottom: 10, marginRight: 15 }}>{data[index].diff}</div>
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
