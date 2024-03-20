import React, { useEffect, useRef, useState } from "react"
import './BulkOrders.css'
// import ExportComponent from "./ExportComponent";
import SingleOrderCard from "./BulkOrderCard";
import { getBulkOrdersApi } from "../../Apis/BulkOrders";

const BulkOrders = () => {

    const [data, setData] = useState({
        bulkOrders: []
    });
    const today = new Date().toISOString().split('T')[0];
    const [toDate, setToDate] = useState(today);
    const [fromDate, setFromDate] = useState(today);
    const [selectedDateOption, setSelectedDateOption] = useState()
    const [orderCount, setOrderCount] = useState();
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [noMoreOrders, setNoMoreOrders] = useState(false);
    const [currentPageNumber, setCurrentPageNumber] = useState(0);
    const [PhoneNumber, setPhoneNumber] = useState('')

   
    const loadOrders = async () => {
        if (loadingOrders ) return;
        setLoadingOrders(true);
        try {
            const response = await getBulkOrdersApi(currentPageNumber + 1);
            setCurrentPageNumber(prev =>(prev +1) )
            if (response.data.bulkOrders === undefined) {
                setNoMoreOrders(true);
            } else {
                setData(prevData => ({
                    ...prevData,
                    bulkOrders: [...prevData.bulkOrders, ...response.data.bulkOrders]
                }));
            }
        } catch (error) {
            console.error("Error loading more orders:", error);
        }
        setLoadingOrders(false);
    };

    useEffect(() => {loadOrders().then();},[])

    useEffect(() => {

        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (windowHeight + scrollTop >= documentHeight - 200 && !noMoreOrders) {
                loadOrders();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadingOrders, data, fromDate, toDate]);

    const renderOrders = () => {

        if (!data || !data.bulkOrders || data.bulkOrders.length === 0) {
            return null;
        }

        return data.bulkOrders.map((item, index) => (
            <SingleOrderCard item={item} index={index} />
        ));
    };

    return (
        <div>
            <div id="FilterOrdersDiv">
                <div id="dateNav">
                    <div style={{ display: 'flex' }}>
                        <p>Select Date</p>
                        <select value={selectedDateOption} onChange={(e) => setSelectedDateOption(e.target.value)}  >
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="last7Days">Last 7 Days</option>
                            <option value="custom">Custom</option>
                        </select>
                        {selectedDateOption === 'custom' ?
                            <>
                                <input type="date" placeholder="from" onChange={(e) => setFromDate(e.target.value)} />
                                <input type="date" placeholder="to" onChange={(e) => setToDate(e.target.value)} />
                            </>
                            : <></>}
                    </div>
                    {/* <ExportComponent orderType={orders} /> */}
                </div>
                <div id="filterNav">
                    <p>Filters</p>
                    <input className="searchOrder" placeholder="Search By product name, sku , barcode and hsn code" type="text" />
                    <input className="searchOrder" placeholder="Search by customer name" type="text" />
                    <input className="searchOrder" value={PhoneNumber} placeholder="Search by Mobile" type="text" onChange={(e) => setPhoneNumber(e.target.value)} />
                    <button className="SearchButton" >SEARCH</button>
                </div>
            </div>

            <div id="OrdersListDiv">
                <div className="orderNav">
                    <h5>All Orders</h5>
                </div>


                <table >
                    <thead>
                        <tr className="headerRow">
                            <th>Sr</th>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer Details</th>
                            <th>Transaction Details</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderOrders()}
                    </tbody>
                </table>
                {noMoreOrders && <p style={{ textAlign: 'center' }}>❌No More Orders</p>}
                {loadingOrders && <div className="loader"></div>}
            </div>
        </div>
    )
}

export default BulkOrders