import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { exportCsvApi, getCustomerByPhoneApi, getCustomersApi } from "../../Apis/Customer";
import { pageLimit } from "../../config/config";
import "./Customers.css";
import PopupComponent from "./FilterPopUp";

const Customers = () => {
  const tableHeaderStyle = { padding: "10px", fontSize: 12, fontWeight: 500, textTransform: "capitalize", textAlign: "left", };
  const handleStartChange = (event) => { console.log(event.target.value); setStartDate(event.target.value); };
  const handleEndChange = (event) => { setEndDate(event.target.value); };
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [sortFilterBody, setSortFilterBody] = useState({});
  const [searchDisable, searchDisable_] = useState(true);
  const [disableExport, setDisableExport] = useState(false);
  const hidePopup = () => { setShowPop(false); };
  const [showPop, setShowPop] = useState(false);
  const [showErr, setShowErr] = useState("");
  const showPopup = () => { setShowPop(true); };
  const [num, setNum] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const snf = location.state.snf
  const page = location.state.page

  const [startDate, setStartDate] = useState(snf.startDate);
  const [endDate, setEndDate] = useState(snf.endDate);
  React.useEffect(() => {
    if (startDate && endDate)
      searchDisable_(false)
    else
      searchDisable_(true)
  }, [startDate, endDate])

  const getData = async () => {
    if (!loadingProducts) {
      setLoadingProducts(true);
      try {
        console.log("Fetching data at page" + page + " and body:", snf)
        const result = await getCustomersApi(snf, page, pageLimit);
        if (result.success === true) {
          setLoadingProducts(false)
          return result
        } else {
          setLoadingProducts(false)
          setShowErr(true);
          console.error(result.message);
          return {}
        }
      } catch (error) {
        console.log("Error fetching data", error, error.message);
        setLoadingProducts(false)
        throw new Error('Throwing error: ' + error.message);

      }
    }
  }

  React.useEffect(() => {
    if (Object.keys(sortFilterBody).length !== 0) {
      navigate('/customers', { state: { page, snf: sortFilterBody } });
    }
  }, [sortFilterBody])

  const { data, isLoading, isError, error } = useQuery(`customer+${page}+${JSON.stringify(snf)}`, getData, { staleTime: 10 * 60 * 1000 });

  React.useEffect(() => {
    console.log("Data", data, "isLoading", isLoading, "isError", isError, "error", error, "customLoader", loadingProducts)
  }, [data, isError, isLoading, error, loadingProducts])

  useEffect(() => {
    if (showPop) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showPop]);


  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: "#f3f9f7",
        padding: 20,
        flexDirection: "column",
      }}>
      <PopupComponent
        showPop={showPop}
        hidePopup={hidePopup}
        setSortFilterBody={setSortFilterBody}
      />
      <div
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          display: "flex",
          padding: 15,
          borderRadius: 15,
          gap: 10,
          boxShadow: "1px 1px 2px 0px rgba(0,0,0,0.4)"
        }}>
        <div
          style={{
            flexDirection: "row",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <div style={{ flex: 0.5, borderWidth: 1 }}>Search</div>
          <div
            style={{
              flex: 1,
              borderWidth: 1,
              display: "flex",
              marginRight: 10,
            }}>
            <input
              style={{ width: "100%", paddingLeft: 20 }}
              placeholder="Search by Mobile number"
              value={num}
              maxLength={10}
              aria-autocomplete="none"
              onChange={(e) => {
                setNum(e.target.value);
              }}
            />
          </div>
          <div style={{ flex: 1, display: "flex" }}>
            <button
              onClick={async () => {
                if (num.length === 10) {
                  try {
                    const res = await getCustomerByPhoneApi(num);
                    if (res && res.users && res.users._id)
                      navigate(`/customerdetails?id=${res.users._id}`)
                    else {
                      setNum("");
                      alert("Not found.")
                    }
                  } catch (error) {
                    console.log(error)
                    setNum("");
                    alert("Not found.")
                  }
                }
                else
                  alert("Enter 10 digit numeber.")
              }}
              style={{
                cursor: num.length === 10 ? "pointer" : "default",
                backgroundColor: num.length < 10 ? "#ddd" : "#ffef03",
                color: num.length < 10 ? "#aaa" : "#000",
                borderWidth: num.length < 10 ? 0 : 1,
                padding: 10,
                fontSize: 14,
                width: "50%",
                borderRadius: 10,
                borderStyle: "solid",
                borderColor: "#e3d400",
              }}>
              Search
            </button>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}>
          <button
            disabled={disableExport}
            onClick={async () => {
              try {
                setDisableExport(true)
                const res = await exportCsvApi(snf);
                if (res) {
                  const blob = new Blob([res], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'users-dump.csv');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                }
                setDisableExport(false)
              } catch (error) {
                console.log(error, "at Customer.js")
              }
            }}
            style={{
              backgroundColor: disableExport ? "#f2f2f2" : "#ffef03",
              padding: 15,
              fontSize: 14,
              borderRadius: 10,
              borderWidth: !disableExport ? 1 : 0,
              width: "8vw",
              borderStyle: "solid",
              borderColor: "#aaa",
            }}>
            {disableExport ? "Please wait" : "Export"}
          </button>
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          padding: 15,
          borderRadius: 15,
          gap: 10,
          boxShadow: "1px 1px 2px 0px rgba(0,0,0,0.4)",
        }}>
        <div
          className="header"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            maxHeight: '6vh',
            gap: 20,
          }}>
          <div style={{ flex: 1 }}>
            Users found: <span style={{ fontWeight: 'bold' }}>{data?.totalCount || 0}</span>
          </div>
          <div style={{ flex: 0.5 }}>
            <button
              onClick={() => {
                showPopup();
              }}
              style={{
                backgroundColor: "#eee",
                padding: 10,
                fontSize: 14,
                width: "50%",
                borderRadius: 10,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#aaa",
                textOverflow: 'clip',
                overflow: 'hidden',
              }}>
              Filters
            </button>
          </div>
          <div>
            <select
              onChange={(e) => {
                if (e.target.value !== "none") {
                  const bdy = JSON.parse(e.target.value)
                  navigate('/customers', { state: { page: 1, snf: { ...snf, ...bdy } } })
                }
              }}
              style={{ padding: 10, borderRadius: 10, flex: 1 }}
              value={JSON.stringify({ sortField: snf.sortField, sortOrder: snf.sortOrder })}>
              <option className="sortOptions" value={JSON.stringify({ "sortField": "totalOrders", sortOrder: -1 })}>
                Total Orders (High to Low)
              </option>
              <option className="sortOptions" value={JSON.stringify({ "sortField": "totalOrders", sortOrder: 1 })}>
                Total Orders (Low to High)
              </option>
              <option className="sortOptions" value="none"></option>
              <option className="sortOptions" value={JSON.stringify({ "sortField": "avgOrderAmount", sortOrder: -1 })}>
                Avg Order Amount (High to Low)
              </option>
              <option className="sortOptions" value={JSON.stringify({ "sortField": "avgOrderAmount", sortOrder: 1 })}>
                Avg Order Amount (Low to High)
              </option>
              <option className="sortOptions" value="none"></option>
              <option className="sortOptions" value={JSON.stringify({ "sortField": "totalAmount", sortOrder: -1 })}>
                Total Spend Amt (High to Low)
              </option>
              <option className="sortOptions" value={JSON.stringify({ "sortField": "totalAmount", sortOrder: 1 })}>
                Total Spend Amt (Low to High)
              </option>
              <option className="sortOptions" value="none"></option>
              <option className="sortOptions" value={JSON.stringify({ "sortField": "latestOrderAmount", sortOrder: -1 })}>
                Last Order Amnt (High to Low)
              </option>
              <option className="sortOptions" value={JSON.stringify({ "sortField": "latestOrderAmount", sortOrder: 1 })}>
                Last Order Amnt (Low to High)
              </option>
              <option className="sortOptions" value="none"></option>
              <option className="sortOptions" value={JSON.stringify({ "sortField": "latestOrderDate", sortOrder: -1 })}>
                Last Order Date (New to Old)
              </option>
              <option className="sortOptions" value={JSON.stringify({ "sortField": "latestOrderDate", sortOrder: 1 })}>
                Last Order Date (Old to New)
              </option>
            </select>
          </div>

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
              }}
              className={`date-picker-label ${startDate ? "active" : ""}`}>
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
              value={startDate}
              onChange={handleStartChange}
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
              }}
              className={`date-picker-label ${startDate ? "active" : ""}`}>
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
              value={endDate}
              onChange={handleEndChange}
              className="date-picker-input"
              placeholder="End date"
            />
          </div>
          <div style={{ flex: 0.4, display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => {
              if (searchDisable)
                alert("Choose Start Date and End Date first.")
              else
                setSortFilterBody((e) => ({
                  ...e,
                  startDate: startDate,
                  endDate: endDate,
                }));
            }}

              style={{
                cursor: !searchDisable ? "pointer" : "default",
                backgroundColor: searchDisable ? "#ddd" : "#ffef03",
                color: searchDisable ? "#aaa" : "#000",
                borderWidth: searchDisable ? 0 : 1,
                padding: 10,
                fontSize: 14,
                width: "50%",
                borderRadius: 10,
                borderStyle: "solid",
                borderColor: "#e3d400",
                overflow: 'hidden',
                textAlign: 'center',
                alignItems: 'center'
              }}>
              Search
            </button>
          </div>
        </div>

        <div className="datatable" style={{ flex: 5, display: "flex", maxWidth: '85vw', overflow: 'clip' }}>
          <table
            cellSpacing={1}
            style={{ border: "1px", width: "100%", overflowY: 'scroll' }}>
            <thead
              style={{
                backgroundColor: "#eee",
              }}>
              <tr>
                <th style={tableHeaderStyle}>Sr</th>
                <th style={tableHeaderStyle}> Mobile Number</th>
                <th style={tableHeaderStyle}>Customer Name</th>
                <th style={tableHeaderStyle}>Last Active</th>
                <th style={tableHeaderStyle}>Last Order Date</th>
                <th style={tableHeaderStyle}>Last Order Amount</th>
                <th style={tableHeaderStyle}>Total Orders</th>
                <th style={tableHeaderStyle}>Avg Order Amount</th>
                <th style={tableHeaderStyle}>Total Spends Amount</th>
              </tr>
            </thead>
            {!isLoading && !isError && data?.users?.length > 0 && (
              <tbody >
                {data.users.map((customer, index) => (
                  <tr className="tablerow" onClick={() => {
                    navigate(`/customerdetails?id=${customer._id}`)
                  }}
                    key={((page - 1) * pageLimit) + index}>
                    <td
                      style={{
                        textTransform: "capitalize",
                        textAlign: "left",
                      }}>
                      {((page - 1) * pageLimit) + index + 1}
                    </td>
                    <td
                      style={{
                        textTransform: "capitalize",
                        textAlign: "left",
                      }}>
                      {customer.phoneNo}
                    </td>
                    <td
                      style={{
                        textTransform: "capitalize",
                        textAlign: "left",
                      }}>
                      {customer.userName ? customer.userName : "N/a"}
                    </td>
                    <td
                      style={{
                        textTransform: "capitalize",
                        textAlign: "left",
                      }}>
                      {"n/a"}
                    </td>
                    <td
                      style={{
                        textTransform: "capitalize",
                        textAlign: "left",
                      }}>
                      {new Date(customer.latestOrderDate).toLocaleDateString(
                        "en-IN",
                        { timeZone: "Asia/Kolkata" }
                      )}
                    </td>
                    <td
                      style={{
                        textTransform: "capitalize",
                        textAlign: "left",
                      }}>
                      ₹ {parseInt(customer.latestOrderAmount)}
                    </td>
                    <td
                      style={{
                        textTransform: "capitalize",
                        textAlign: "left",
                      }}>
                      {parseInt(customer.totalOrders)}
                    </td>
                    <td
                      style={{
                        textTransform: "capitalize",
                        textAlign: "left",
                      }}>
                      ₹ {parseInt(customer.avgOrderAmount)}
                    </td>
                    <td
                      style={{
                        textTransform: "capitalize",
                        textAlign: "left",
                      }}>
                      ₹ {parseInt(customer.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            )
            }
          </table>
        </div>
        {!(loadingProducts) && <div style={{ border: "1px solid #ddd", borderRadius: 20, padding: 10, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
          <Pagination page={Number(page)} onChange={(event, p) => {
            navigate('/customers', { state: { page: p, snf } })
          }} count={data?.hasOwnProperty('totalCount') ? Math.ceil(data.totalCount / pageLimit) : 1} variant="outlined" shape="rounded" />

        </div>}
        {showErr && <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No Users found.</p>}
        {(loadingProducts) && <div className="loader" />}

      </div >
    </div >
  );
};

export default Customers;
