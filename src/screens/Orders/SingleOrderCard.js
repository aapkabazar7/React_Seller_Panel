import { useState } from "react";
import { cancelOrder, confirmPendingOrder, deliverOrderApi, dispatchProcessedOrder, getOrders, orderDetailsApi, processConfirmedOrder, restoreOrderApi } from "../../Apis/orders";
import { Navigate, useNavigate } from "react-router-dom";
// import './Orders.css'


const SingleOrderCard = ({item,index}) => {

    const [otp,setOtp] = useState('');
    const navigate = useNavigate();

    const acceptPendingOrder = async (id) => {
        // alert("Are you sure you want to confirm the order");
        const response = await confirmPendingOrder(id);
        console.log(response)
    }

    const processOrder = async (id) => {
        const response = await processConfirmedOrder(id)
        console.log(response)
    }

    const dispatchOrder = async (id) => {
        const response = await dispatchProcessedOrder(id);
        console.log(response);
    }

    const restoreOrder = async (id) => {
        const response = await restoreOrderApi(id);
        console.log(response)
    }

    const printOrder = async(id) =>{

    }

    const deliverOrder = async (id) =>{
        const response = await deliverOrderApi(id,otp);
        console.log(response);
    }

    const cancelorder = async (id) =>{
        const response = await cancelOrder(id);
        console.log(response)
    } 
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

    const renderBtn = (status, id) => {
        switch (status) {
            case 'pending':
                return (
                    <>
                        <button className="greenBtn" onClick={() => acceptPendingOrder(id)}>Order Accept</button>
                        <button className="greyBtn" onClick={()=>printOrder(id)}>Print</button>
                        <button className="greyBtn">Edit</button>
                        <button className="redBtn" onClick={()=>cancelorder(id)}>Order cancel</button>
                    </>
                );
            case 'confirmed':
                return (
                    <>
                        <button className="greenBtn" onClick={() => processOrder(id)}>Process Order</button>
                        <button className="greyBtn" onClick={()=>printOrder(id)}>Print</button>
                        <button className="greyBtn">Edit</button>
                        <button className="redBtn" onClick={()=>cancelorder(id)}>Order cancel</button>
                    </>
                );
            case 'processed':
                return (
                    <>
                        <button className="greenBtn" onClick={() => dispatchOrder(id)}>Dispatch Order</button>
                        <button className="greyBtn" onClick={()=>printOrder(id)}>Print</button>
                        <button className="greyBtn">Edit</button>
                        <button className="redBtn" onClick={()=>cancelorder(id)}>Order cancel</button>
                    </>
                );
            case 'dispatched':
                return (
                    <>
                        <button className="greenBtn" onClick={()=>deliverOrder(id)}>Order Deliver</button>
                        <button className="redBtn" onClick={()=>cancelorder(id)}>Order cancel</button>
                    </>
                );
            case 'cancelled':
                return (
                    <>
                    {item.userCancelStatus ? null :
                        <button className="greyBtn" onClick={()=>restoreOrder(id)}>Restore</button> }
                    </>
                );
            case 'delivered':
                return (
                    <>
                        <button className="greyBtn" onClick={()=>printOrder(id)}>Print</button>
                    </>
                );
            default:
                return null;
        }
    }

    const fetchOrderDetails = async (id) =>{
        navigate(`/orderdetails?id=${id}`);
    }

    const renderStatus = (item) => {
        switch (item.status) {
            case 'pending':
                return (
                    <>
                        <p className="blacktext">Pending</p>
                    </>
                );
            case 'confirmed':
                return (
                    <>
                        <p className="blacktext">Confirmed</p>
                    </>
                );
            case 'processed':
                return (
                    <>
                        <p className="blacktext">Processed</p>
                    </>
                );
            case 'dispatched':
                return (
                    <>
                        <input 
                            className="otpInputBox"
                            value={otp}
                            placeholder="Enter Otp"
                            onChange={(e)=>setOtp(e.target.value)}
                        />
                        <p className="blacktext">OTP : {item.otp}</p>
                    </>
                );
            case 'cancelled':
                return (
                    <>
                    <p className="blacktext">{ item.userCancelStatus === true ? 'Cancelled By User' : 'Cancelled By Admin' }</p>
                    </>
                );
            case 'delivered':
                return (
                    <>
                    <p className="blacktext">Delivered</p>
                    </>
                );
            default:
                return null;
        }
    }

    return (
        <tr key={index}>
            <td>{index + 1}</td>
            <td><span style={{cursor: "pointer"}} onClick={()=>fetchOrderDetails(item.id)}>{item.id}</span></td>
            <td>
                <div style={{ paddingTop: '20px' }}>
                    <p className="greytext">Date & Time</p>
                    <h6 className="blacktext">{formatDate(item.date)}</h6>
                </div>
                <div className="spaceLine"></div>
                <div>
                    <p className="greytext">Deliver Date & Time Slot</p>
                    <h6 className="blacktext" style={{ width: '19ch' }}>{formatDate(item.deliveryDate)}</h6>
                    <h6 className="blacktext">{item.deliveryTime?.slot}</h6>
                </div>
            </td>
            <td>

                <div>
                    <p className="greytext">Name & Mobile</p>
                    <h6 className="boldtext">{item.address?.name} {item.address?.mobileNo}</h6>
                </div>
                <div className="spaceLine"></div>
                <div style={{ borderTopWidth: 1, marginTop: '10px' }}>
                    <p className="greytext">Delivery Address</p>
                    <p className="blacktext" style={{}}>{item.address?.line1} {item.address?.line2}</p>
                </div>
            </td>
            <td>
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
            <td>
                {renderStatus(item)}
            </td>
            <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {renderBtn(item.status, item._id)}
                </div>
            </td>
        </tr>
    )

}
export default SingleOrderCard