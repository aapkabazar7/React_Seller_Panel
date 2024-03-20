import React, { useEffect, useRef, useState } from "react";
import "./Orders.css";
import { confirmPendingOrder, dispatchProcessedOrder, getOrders, processConfirmedOrder } from "../../Apis/orders";
import { getDashboardDetails, getOrderWiseReport } from "../../Apis/Dashboard";
import ExportComponent from "./ExportComponent";
import SingleOrderCard from "./SingleOrderCard";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

const Orders = () => {
  const [searchDisable, searchDisable_] = useState(false);
  const [orders, setOrders] = useState("all");
  const [data, setData] = useState();
  const today = new Date().toISOString().split("T")[0];
  const [toDate, setToDate] = useState(today);
  const [fromDate, setFromDate] = useState(today);
  const [selectedDateOption, setSelectedDateOption] = useState();
  const [orderCount, setOrderCount] = useState();
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [noMoreOrders, setNoMoreOrders] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [PhoneNumber, setPhoneNumber] = useState("");

  const handleButtonClick = (orderType) => {
    setOrders(orderType);
  };

  useEffect(() => {
    const today = new Date();
    let newToDate;
    let newFromDate;

    switch (selectedDateOption) {
      case "today":
        newToDate = today.toISOString().split("T")[0];
        newFromDate = newToDate;
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        newToDate = yesterday.toISOString().split("T")[0];
        newFromDate = newToDate;
        break;
      case "last7Days":
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 6);
        newFromDate = last7Days.toISOString().split("T")[0];
        newToDate = today.toISOString().split("T")[0];
        break;
      case "custom":
        newToDate = "";
        newFromDate = "";
        break;
      default:
        break;
    }
    setToDate(newToDate);
    setFromDate(newFromDate);
  }, [selectedDateOption]);
  const getOrderCount = async () => {
    try {
      const response = await getOrderWiseReport();
      if (response) {
        let temp = response.orderCount;
        let allOrders = 0;
        temp.forEach((a) => {
          allOrders += a.count;
        });
        temp.push({
          _id: "all_orders",
          count: allOrders,
        });
        temp.sort((a, b) => {
          return a._id.localeCompare(b._id);
        });
        setOrderCount(temp);
        console.log(temp);
      }
    } catch (error) {
      console.error("Error fetching order count:", error);
    }
  };
  useEffect(() => {
    getOrderCount().then();
  }, []);

  useEffect(() => {
    const loadMoreOrders = async () => {
      if (loadingOrders || !data) return;
      setLoadingOrders(true);
      try {
        // console.log('in fn ', orders,fromDate,toDate,start)
        const response = await getOrders(orders, fromDate, toDate, PhoneNumber, currentPageNumber);
        setCurrentPageNumber(currentPageNumber + 1);
        if (response.orders === undefined) {
          setNoMoreOrders(true);
        } else {
          setData((prevData) => ({
            ...prevData,
            orders: [...prevData.orders, ...response.orders],
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingOrders, data, orders, fromDate, toDate]);
  const fetchData = async () => {
    setNoMoreOrders(false);
    setData(null);
    setLoadingOrders(true);
    const requestTimestamp = Date.now();
    try {
      const result = await getOrders(orders, fromDate, toDate, PhoneNumber);
      if (requestTimestamp === latestRequestTimestamp.current) {
        if (!result.success) {
          setNoMoreOrders(true);
        } else {
          setData(result);
          setCurrentPageNumber(1);
        }
      } else {
        console.log("validation failed", result);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }

    getOrderCount().then();

    setLoadingOrders(false);
  };

  // Define a ref to store the timestamp of the latest request
  const latestRequestTimestamp = useRef(null);
  useEffect(() => {
    latestRequestTimestamp.current = Date.now();
    setCurrentPageNumber(0);
    setData([]);
    fetchData().then();
  }, [orders]);

  const loadOrders = () => {
    console.log("Data: ", data);
    if (!data || !data.orders || data.orders.length === 0) {
      return null;
    }

    return data.orders.map((item, index) => <SingleOrderCard key={index} setCurrentPageNumber={setCurrentPageNumber} setData={setData} latestRequestTimestamp={latestRequestTimestamp} fetchData={fetchData} item={item} index={index} />);
  };

  return (
    <div>
      <div id="FilterOrdersDiv">
        <div id="dateNav">
          <div style={{ display: "flex", gap: 20, width: "60%", justifyContent: "center", alignItems: "center" }}>
            <div style={{ flex: 1 }}>Select Date Range</div>
            <div
              style={{
                flex: 0.2,
                flexDirection: "column",
                display: "flex",
                paddingLeft: 5,
                paddingRight: 5,
                border: "2px solid #e6e6e6",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                paddingBottom: 5,
              }}>
              <label
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  justifyContent: "flex-start",
                }}>
                Start Date
              </label>
              <input
                style={{
                  borderWidth: 0,
                  outlineWidth: 1,
                  padding: 0,
                  textAlign: "center",
                }}
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                }}
                className="date-picker-input"
                placeholder="Start date"
              />
            </div>
            <div
              style={{
                flex: 0.2,
                flexDirection: "column",
                display: "flex",
                border: "2px solid #e6e6e6",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                paddingLeft: 5,
                paddingRight: 5,
                paddingBottom: 5,
              }}>
              <label
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  justifyContent: "flex-start",
                }}>
                End Date
              </label>
              <input
                style={{
                  borderWidth: 0,
                  padding: 0,
                  outlineWidth: 0,
                  textAlign: "center",
                }}
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                }}
                className="date-picker-input"
                placeholder="End date"
              />
            </div>
            <button
              onClick={async () => {
                latestRequestTimestamp.current = Date.now();
                await fetchData();
              }}
              style={{
                cursor: !searchDisable ? "pointer" : "default",
                backgroundColor: searchDisable ? "#ddd" : "#ffef03",
                color: searchDisable ? "#aaa" : "#000",
                borderWidth: searchDisable ? 0 : 1,
                padding: 10,
                fontSize: 14,
                flex: 0.7,
                borderRadius: 10,
                borderStyle: "solid",
                borderColor: "#e3d400",
                overflow: "hidden",
                textAlign: "center",
                alignItems: "center",
              }}>
              Search
            </button>
          </div>
          <ExportComponent orderType={orders} />
        </div>
        <div id="filterNav">
          <p>Filters</p>
          <input className="searchOrder" placeholder="Search By product name, sku , barcode and hsn code" type="text" />
          <input className="searchOrder" placeholder="Search by customer name" type="text" />
          <input className="searchOrder" value={PhoneNumber} placeholder="Search by Mobile" type="text" onChange={(e) => setPhoneNumber(e.target.value)} />
          <button
            onClick={fetchData}
            style={{
              cursor: !searchDisable ? "pointer" : "default",
              backgroundColor: searchDisable ? "#ddd" : "#ffef03",
              color: searchDisable ? "#aaa" : "#000",
              borderWidth: searchDisable ? 0 : 1,
              padding: 10,
              fontSize: 14,
              flex: 0.7,
              borderRadius: 10,
              borderStyle: "solid",
              borderColor: "#e3d400",
              overflow: "hidden",
              textAlign: "center",
              alignItems: "center",
            }}>
            Search
          </button>
        </div>
      </div>

      <div id="OrdersListDiv">
        <div className="orderNav">
          <h5>All Orders</h5>
          <div className="orderNavButtons">
            <button style={{ width: 140 }} className={orders === "all" ? "active" : ""} onClick={() => handleButtonClick("all")}>
              All orders ({orderCount && orderCount[0].count})
            </button>
            <button style={{ width: 140 }} className={orders === "pending" ? "active" : ""} onClick={() => handleButtonClick("pending")}>
              New orders ({orderCount && orderCount[5].count})
            </button>
            <button style={{ width: 140 }} className={orders === "confirmed" ? "active" : ""} onClick={() => handleButtonClick("confirmed")}>
              Confirmed ({orderCount && orderCount[2].count})
            </button>
            <button style={{ width: 140 }} className={orders === "processed" ? "active" : ""} onClick={() => handleButtonClick("processed")}>
              Processed ({orderCount && orderCount[6].count})
            </button>
            <button style={{ width: 140 }} className={orders === "dispatched" ? "active" : ""} onClick={() => handleButtonClick("dispatched")}>
              Dispatched ({orderCount && orderCount[4].count})
            </button>
            <button style={{ width: 140 }} className={orders === "delivered" ? "active" : ""} onClick={() => handleButtonClick("delivered")}>
              Delivered ({orderCount && orderCount[3].count})
            </button>
            <button style={{ width: 140 }} className={orders === "cancelled" ? "active" : ""} onClick={() => handleButtonClick("cancelled")}>
              Cancelled ({orderCount && orderCount[1].count})
            </button>
          </div>
        </div>
        <div></div>

        <table>
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
          <tbody>{loadOrders()}</tbody>
        </table>
        {noMoreOrders && <p style={{ textAlign: "center" }}>❌No More Orders</p>}
        {loadingOrders && <div className="loader"></div>}
      </div>
    </div>
  );
};

export default Orders;
