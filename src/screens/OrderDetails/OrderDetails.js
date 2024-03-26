import React, { useEffect, useState } from "react"
import "./OrderDetails.css"
import { useLocation, useNavigate } from "react-router-dom"
import { orderDetailsApi } from "../../Apis/orders";
import { OrderDetailsProductCard } from "./OrderProductCard";
import BackSvg from '../../assets/back.svg';
import { printInvoice } from "../../utils/toast";
import {
    cancelOrder,
    confirmPendingOrder,
    deliverOrderApi,
    dispatchProcessedOrder,
    getOrders,
    processConfirmedOrder,
    restoreOrderApi,
} from "../../Apis/orders";


const OrderDetails = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");

    const id = queryParams.get('id');
    const refreshPage = () => {
        window.location.reload();
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
    const deliverOrder = async (id) => {
        await deliverOrderApi(id, otp);
        refreshPage();
    };

    const cancelorder = async (id) => {
        await cancelOrder(id);
        refreshPage();
    };

    const handleBackBtn = () => {
        navigate(-1);
    }
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

    const printOrder = async (id) => {
        const temp = orderData;
        const data = {
            invoice: {
                seller: {
                    phoneNo: temp.seller.phoneNo,
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
                date: temp ? formatDate(temp.date) : "",
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
        printInvoice(data);
    };

    useEffect(() => {
        const getData = async () => {
            if (!loading) {
                setLoading(true);
                const result = await orderDetailsApi(id);
                if (result.success) {
                    setOrderData(result.order);
                }
                else {
                    console.log(result.message)
                }
                setLoading(false);
            }
        }
        getData();
    }, [])
    function convertTimeToIST(zuluTime) {
        return new Date(zuluTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    }
    const renderBtn = (status, id) => {
        switch (status) {
            case "pending":
                return (
                    <>
                        <button onClick={() => acceptPendingOrder(id)}>
                            Accept Order
                        </button>
                        <button onClick={() => cancelorder(id)}>
                            Cancel order
                        </button>
                    </>
                );
            case "confirmed":
                return (
                    <>
                        <button onClick={() => processOrder(id)}>
                            Process Order
                        </button>
                        <button onClick={() => cancelorder(id)}>
                            Cancel order
                        </button>
                    </>
                );
            case "processed":
                return (
                    <>
                        <button onClick={() => dispatchOrder(id)}>
                            Dispatch Order
                        </button>
                        <button onClick={() => cancelorder(id)}>
                            Cancel order
                        </button>
                    </>
                );
            case "dispatched":
                return (
                    <>
                        <p>otp : {orderData.otp}</p>
                        <input style={{ backgroundColor: "white", boxShadow: '1px 1px 2px 0px rgba(0,0,0,0.126)', border: 0, padding: '0 20px' }} placeholder="Enter Otp" onChange={(e) => setOtp(e.target.value)} />
                        <button onClick={() => deliverOrder(id)}>
                            Order Deliver
                        </button>
                        <button onClick={() => cancelorder(id)}>
                            Order cancel
                        </button>
                    </>
                );
            case "cancelled":
                return (
                    <>
                        {orderData?.userCancelStatus ? null : (
                            <button onClick={() => restoreOrder(id)}>
                                Restore
                            </button>
                        )}
                    </>
                );
            case "delivered":
                return (
                    <>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div id="orderDetailsRootContainer">
            <div id="topBtnsDiv">
                <button id="backBtn" onClick={handleBackBtn}><img src={BackSvg} style={{ width: 20, height: 20 }} />Back</button>
                <div style={{ display: 'flex', gap: 20 }}>{renderBtn(orderData?.status, orderData?._id)}
                    <button id="DownloadOrderBtn" onClick={() => printOrder()}>Download Order</button>
                </div>
            </div>

            <div id="orderDetailsContainer">
                <div id="sellerDetails">
                    <h2>Seller Details</h2>
                    <div className="line"></div>
                    <h4>Aap ka Bazar</h4>
                    <span>{orderData?.seller.sellerInformation.fullAddress}</span>
                    <h4>Landmark: <span>{orderData?.seller.sellerInformation.landmark}</span></h4>
                    <span>{orderData?.seller.phoneNo}</span>
                    {orderData?.customerMessage ?
                        <span style={{ marginTop: 40, backgroundColor: '#ff00002e', border: '1px solid red', padding: '5px', borderRadius: 8 }}> Customer Message : {orderData.customerMessage}</span>
                        : null}
                </div>
                <div id="orderDetails">
                    <h2>Order Details</h2>
                    <div className="line"></div>
                    <h4>{orderData?.address.name}</h4>
                    <span>{orderData?.address.line1}</span>
                    <span>{orderData?.address.line2}</span>
                    <span>{orderData?.address.mobileNo}</span>
                    <div className="line"></div>
                    <h4>Order ID: <span>{orderData?.id}</span>        Payment Mode: <span>{orderData?.paymentMode}</span></h4>
                    <h4>Order Status: <span>{orderData?.status}</span></h4>
                </div>
            </div>

            <div id="dateDiv">
                <h4>Order Date: <span>{convertTimeToIST(orderData?.date)}</span></h4>
                <h4>Delivery Date: <span>{convertTimeToIST(orderData?.deliveryDate)}</span></h4>
                <h4>Delivery Slot: <span>{orderData?.deliveryTime.slot}</span></h4>
            </div>

            <div id="productList">
                <table>
                    <thead className="headerRow">
                        <tr>
                            <th>Sr</th>
                            <th>Item/SKU Code</th>
                            <th>Product Name</th>
                            <th>MRP(₹)</th>
                            <th>Sell Price(₹)</th>
                            <th>Total Qty</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orderData?.products.map((item, index) => (<OrderDetailsProductCard index={index} item={item} />))
                        }
                    </tbody>
                </table>
            </div>

            <div id="dateDiv">
                <h4>Total Items: <span>{orderData?.products.length}</span></h4>
                <h4>Delivery Charge: <span>{orderData?.deliveryCharge}</span></h4>
                <h4>Total Amount: <span>{orderData?.amount}</span></h4>
            </div>

        </div>
    );
}

export default OrderDetails