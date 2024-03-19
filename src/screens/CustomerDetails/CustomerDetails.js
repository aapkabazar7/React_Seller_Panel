import React, { useEffect, useState } from "react"
import "./CustomerDetails.css"
import { useLocation, useNavigate } from "react-router-dom"
import { orderDetailsApi } from "../../Apis/orders";
import CustomerOrderCard from "./CustomerOrderCard";
import { getCustomerDetailsApi } from "../../Apis/Customer";
import BackSvg from '../../assets/back.svg';

const CustomerDetails = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false)
    const [totalSum, setTotalSum] = useState(0);
    const navigate = useNavigate()

    const id = queryParams.get('id');

    const handleBackBtn = () => {
        navigate(-1);
    }

    useEffect(() => {
        const getData = async () => {
            if (!loading) {
                setLoading(true);
                const result = await getCustomerDetailsApi(id);
                console.log(result)
                if (result.success) {
                    setUserData(result);
                    var sum = 0;
                    result.user?.orders?.forEach(element => {
                        sum += element.amount;
                    });
                    setTotalSum(Math.floor(sum))
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
        return new Date(zuluTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }).slice(0, 9);
    }

    return (
        <div id="CustomerDetailsRootContainer">
            <div id="topBtnsDiv">
                <button id="backBtn" onClick={handleBackBtn}><img src={BackSvg} style={{ width: 20, height: 20 }} /> Back</button>
                <button id="DownloadOrderBtn">Data Export</button>
            </div>

            <div id="CustomerDetailsContainer">
                <div style={{ display: "flex", justifyContent: 'space-between' }}>
                    <div style={{ display: "flex", gap: 20 }}>
                        <h2>{userData?.user.phoneNo}</h2>
                        <h2>{userData?.user.name ? userData.user.name : 'N/A'}</h2>
                    </div>
                    <span>Total Spends</span>
                </div>
                <div style={{ display: "flex", justifyContent: 'space-between' }}>
                    <div style={{ display: "flex", gap: 20 }}>
                        <h4>Total Orders: <span>{userData?.user?.orders?.length}</span></h4>
                        <h4>Account Created: <span>{convertTimeToIST(userData?.user.date)}</span></h4>
                    </div>
                    <h4> ₹ {totalSum}</h4>
                </div>
            </div>

            <div id="orderList">
                <table>
                    <thead className="headerRow">
                        <tr>
                            <th>Sr</th>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer Details</th>
                            <th>Transaction Details</th>
                            <th>Status</th>
                            <th>Pending</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userData?.user?.orders?.map((item, index) => (<CustomerOrderCard index={index} item={item} />))
                        }
                    </tbody>
                </table>
                {!userData?.user?.hasOwnProperty("orders") && <div>No orders found</div>}
            </div>

        </div>
    );
}

export default CustomerDetails