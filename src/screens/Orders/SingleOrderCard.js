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
// import './Orders.css'
const data = [
  { title: "Placed", value: "13:00pm", diff: "0m" },
  { title: "Confirmed", value: "13:05pm", diff: "5m " },
  { title: "Processed", value: "13:15pm", diff: "10m " },
  { title: "Dispatched", value: "13:20pm", diff: "5m " },
  { title: "Delivered", value: "13:40pm", diff: "20m " },
];
const SingleOrderCard = ({ item, index, fetchData, setData, currentPage, setCurrentPageNumber, latestRequestTimestamp }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  function refreshPage() {
    latestRequestTimestamp.current = Date.now();
    setCurrentPageNumber(0);
    setData([]);
    fetchData().then();
  }

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

  const fetchOrderDetails = async (id) => {
    navigate(`/orderdetails?id=${id}`);
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
            <p className="blacktext">OTP : {item.otp}</p>
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

  return (
    <tr key={index}>
      <td style={{ width: "5%" }}>{index + 1}</td>
      <td style={{ width: "5%" }}>
        <span style={{ cursor: "pointer" }} onClick={() => fetchOrderDetails(item.id)}>
          {item.id}
        </span>
      </td>
      <td style={{ width: "10%" }}>
        <div style={{ paddingTop: "20px" }}>
          <p className="greytext">Date & Time ({})</p>
          <h6 className="blacktext">{formatDate(item.date)}</h6>
        </div>
        <div className="spaceLine"></div>
        <div>
          <p className="greytext">Deliver Date & Time Slot</p>
          <h6 className="blacktext" style={{ width: "19ch" }}>
            {formatDate(item.deliveryDate)}
          </h6>
          <h6 className="blacktext">{item.deliveryTime?.slot}</h6>
        </div>
      </td>
      <td style={{ width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {data.map((item, index) => {
            return (
              <table>
                <tbody>
                  {data.map((item, index) => {
                    return (
                      <tr>
                        <td>{data[index].title}</td>
                        <td>{data[index].value}</td>
                        <td>{data[index].diff}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
          })}
        </div>

        <div className="spaceLine"></div>
        <div style={{ borderTopWidth: 1, marginTop: "10px" }}>
          <p className="greytext">Delivery Address</p>
          <p className="blacktext" style={{}}>
            {item.address?.line1} {item.address?.line2}
          </p>
        </div>
        <div className="spaceLine"></div>
        <div style={{ justifyContent: "center" }}>
          {/* <p className="greytext">Name & Mobile</p> */}
          <span style={{ fontWeight: "normal", textAlign: "left", textTransform: "capitalize" }}>
            {item.address?.name} {item.address?.mobileNo}
          </span>
        </div>
      </td>
      <td style={{ width: "40%" }}>
        <div>
          <p className="greytext">Payment Mode</p>
          <p className="blacktext">{item.paymentMode}</p>
        </div>
        <div className="spaceLine"></div>
        <div>
          <p className="greytext">Order Amount</p>
          <p className="blacktext">₹ {item.amount}</p>
        </div>
      </td>
      <td style={{ width: "20%" }}>{renderStatus(item)}</td>
      <td style={{ width: "10%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{renderBtn(item.status, item._id)}</div>
      </td>
    </tr>
  );
};
export default SingleOrderCard;
