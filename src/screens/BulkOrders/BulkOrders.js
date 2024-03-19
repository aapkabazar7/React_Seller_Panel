import React, { useEffect, useRef, useState } from "react"
import './BulkOrders.css'
// import ExportComponent from "./ExportComponent";
import SingleOrderCard from "./BulkOrderCard";
import { getBulkOrdersApi } from "../../Apis/BulkOrders";

const BulkOrders = () => {

    const [orders, setOrders] = useState('all');
    const [data, setData] = useState();
    const today = new Date().toISOString().split('T')[0];
    const [toDate, setToDate] = useState(today);
    const [fromDate, setFromDate] = useState(today);
    const [selectedDateOption, setSelectedDateOption] = useState()
    const [orderCount, setOrderCount] = useState();
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [noMoreOrders, setNoMoreOrders] = useState(false);
    const [currentPageNumber, setCurrentPageNumber] = useState(0);
    const [PhoneNumber, setPhoneNumber] = useState('')

    const handleButtonClick = (orderType) => {
        setOrders(orderType);
    };

    useEffect(() => {
        const today = new Date();
        let newToDate;
        let newFromDate;

        switch (selectedDateOption) {
            case 'today':
                newToDate = today.toISOString().split('T')[0];
                newFromDate = newToDate;
                break;
            case 'yesterday':
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                newToDate = yesterday.toISOString().split('T')[0];
                newFromDate = newToDate;
                break;
            case 'last7Days':
                const last7Days = new Date(today);
                last7Days.setDate(last7Days.getDate() - 6); // Go back 6 days to include today
                newFromDate = last7Days.toISOString().split('T')[0];
                newToDate = today.toISOString().split('T')[0];
                break;
            case 'custom':
                // If you want toDate and fromDate to be empty when custom is selected
                newToDate = '';
                newFromDate = '';
                break;
            default:
                // Handle default case here
                break;
        }

        // Update the state
        setToDate(newToDate);
        setFromDate(newFromDate);
    }, [selectedDateOption]);

    useEffect(() => {
        const loadMoreOrders = async () => {
            if (loadingOrders || !data) return;
            setLoadingOrders(true);
            try {
                // console.log('in fn ', orders,fromDate,toDate,start)
                const response = await getBulkOrdersApi(currentPageNumber);
                setCurrentPageNumber(currentPageNumber + 1)
                if (response.orders === undefined) {
                    setNoMoreOrders(true);
                } else {
                    setData(prevData => ({
                        ...prevData,
                        orders: [...prevData.orders, ...response.orders]
                    }));
                }
            } catch (error) {
                console.error("Error loading more orders:", error);
            }
            setLoadingOrders(false);
        };

        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (windowHeight + scrollTop >= documentHeight - 200 && !noMoreOrders) {
                loadMoreOrders();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadingOrders, data, orders, fromDate, toDate]);

    const fetchData = async () => {
        setNoMoreOrders(false);
        setData(null);
        setLoadingOrders(true);

        // Generate a unique timestamp for this request
        const requestTimestamp = Date.now();

        try {
            const result = await getBulkOrdersApi();

            // Check if the response is for the latest request
            if (requestTimestamp === latestRequestTimestamp.current) {
                setData(result.data);
                console.log(result)
                setCurrentPageNumber(1);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }

        setLoadingOrders(false);
    };



    // Define a ref to store the timestamp of the latest request
    const latestRequestTimestamp = useRef(null);


    useEffect(() => {
        // Update the latest request timestamp when dependencies change
        latestRequestTimestamp.current = Date.now();
        fetchData();
    }, [orders, toDate, fromDate]);


    const loadOrders = () => {

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
                    <button className="SearchButton" onClick={fetchData}>SEARCH</button>
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
                        {loadOrders()}
                    </tbody>
                </table>
                {noMoreOrders && <p style={{ textAlign: 'center' }}>❌No More Orders</p>}
                {loadingOrders && <div className="loader"></div>}
            </div>
        </div>
    )
}

export default BulkOrders