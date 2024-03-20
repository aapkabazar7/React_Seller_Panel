import { useState } from "react";
import { cancelOrder, confirmPendingOrder, deliverOrderApi, dispatchProcessedOrder, getOrders, orderDetailsApi, processConfirmedOrder, restoreOrderApi } from "../../Apis/orders";
import { Navigate, useNavigate } from "react-router-dom";
import { liveURL } from "../../config/config";
// import './Orders.css'


const SingleOrderCard = ({ item, index }) => {

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
    }

    return (
        <tr key={index}>
            <td>{index + 1}</td>
            <td><span style={{ cursor: "pointer" }} >{item.id}</span></td>
            <td>
                <div style={{ paddingTop: '20px' }}>
                    <p className="greytext">Date & Time</p>
                    <h6 className="blacktext">{formatDate(item.createdAt)}</h6>
                </div>
            </td>
            <td>
                <div>
                    <p className="greytext">Name & Mobile</p>
                    <h6 className="boldtext">{item.name} {item.phoneNo}</h6>
                </div>
                <div className="spaceLine"></div>
                <div style={{ borderTopWidth: 1, marginTop: '10px' }}>
                    <p className="greytext">Delivery Address</p>
                    <p className="blacktext" style={{}}>{item.address} {item.address?.line2}</p>
                </div>
            </td>
            <td>
                <div style={{ paddingTop: '20px', display: 'flex', gap: 20 }}>
                    <img src={`${liveURL}/public/product/${item.productId.id}/${item.productId.images[0]}`} className="productImage" />
                    <h6 className="blacktext">{item.productId.name}</h6>
                </div>
            </td>
            <td>
                <div style={{ paddingTop: '20px' }}>
                    <h6 className="blacktext">{item.quantity}</h6>
                </div>
            </td>
        </tr>
    )

}
export default SingleOrderCard