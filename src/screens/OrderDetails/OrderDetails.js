import React, { useEffect, useState } from "react"
import "./OrderDetails.css"
import { useLocation, useNavigate } from "react-router-dom"
import { orderDetailsApi } from "../../Apis/orders";
import { OrderDetailsProductCard } from "./OrderProductCard";
import BackSvg from '../../assets/back.svg';


const OrderDetails = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const id = queryParams.get('id');

    const handleBackBtn = () =>{
        navigate(-1);
    }

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

    return (
        <div id="orderDetailsRootContainer">
            <div id="topBtnsDiv">
                <button id="backBtn" onClick={handleBackBtn}><img src={BackSvg} style={{width: 20, height: 20}}/>Back</button>
                <button id="DownloadOrderBtn">Download Order</button>
            </div>

            <div id="orderDetailsContainer">
                <div id="sellerDetails">
                    <h2>Seller Details</h2>
                    <div className="line"></div>
                    <h4>Aap ka Bazar</h4>
                    <span>{orderData?.seller.sellerInformation.fullAddress}</span>
                    <h4>Landmark: <span>{orderData?.seller.sellerInformation.landmark}</span></h4>
                    <span>{orderData?.seller.phoneNo}</span>
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

        </div>
    );
}

export default OrderDetails