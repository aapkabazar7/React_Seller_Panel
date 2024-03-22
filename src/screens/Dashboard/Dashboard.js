import React, { useEffect } from "react";
import "./Dashboard.css";
import { useState } from "react";
import Reports from "./Reports";
import {
  getCardData,
  getDashboardDetails,
  getGraphData,
  getOrderSourceReport,
  getOrderWiseReport,
  getProductCount,
  getTopProduct,
  refreshData,
} from "../../Apis/Dashboard";
import SemiDonut from "./SemiDonut";
import { Divider, Skeleton } from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import { formatIndian, printInvoice } from "../../utils/toast";
import MonthlyChart from "./AnnualChart";
import { toast } from "react-toastify";
import { formatDate, generateOptions } from "../../utils/DateHandler";

const FirstofCurrentMonth = new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, "0") + "-01";
const todaysDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, "0") + "-" + new Date().getDate();

const Dashboard = () => {
  const [options] = useState(generateOptions());
  const [selectedMonthForTopProd, setSelectedMonthForTopProd] = useState("");
  const [startDateTopProd, setStartDateTopProd] = useState(FirstofCurrentMonth);
  const [endDateTopProd, setEndDateTopProd] = useState(todaysDate);

  const [fromDate, setFromDate] = useState(todaysDate);
  const [topProducts, setTopProducts] = useState([]);
  const [toDate, setToDate] = useState(todaysDate);
  const [stockData, setStockData] = useState();
  const [orderWiseData, setOrderWiseData] = useState();
  const [donutDates, setDonutDates] = useState({
    fromDate: FirstofCurrentMonth,
    toDate: todaysDate,
  });
  const refreshRef = React.useRef();
  const [donutData, setDonutData] = useState([]);
  const [cardData, setCardData] = useState({});
  const [loading, setLoading] = useState({
    cardsLoading: true,
    annualLoading: true,
    donutLoading: true,
    orderWiseLoading: true,
    stockWiseLoading: true,
    topProductLoading: true,
    topCategoryLoading: true,
    topBrandLoading: true,
  });
  const getDonutData = async () => {
    setDonutData([]);
    const result = await getOrderSourceReport("2023-02-01", "2023-02-25");
    let temp = [];
    if (result.success === false) {
      toast.error("Error fetching Device reports");
    } else {
      result.users.forEach((element) => {
        temp[element._id] = element.count;
      });

      setDonutData(temp);
      setLoading((e) => ({
        ...e,
        donutLoading: false,
      }));
    }
  };

  const getCardDataSet = async () => {
    try {
      const res = await getCardData(fromDate, toDate);
      if (res) {
        setLoading((e) => ({ ...e, cardsLoading: false }));
        setCardData(res?.data?.report);
      }
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [chartData, setChartData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("sales");
  const [chartDuration, setChartDuration] = useState("monthly");

  const fetchData = async () => {
    try {
      const res = await getGraphData(chartDuration.toLowerCase());
      const apiData = res.data.report;
      const prevApiData = res.data.prevReport; // Extract data from prevReport
      if (apiData && prevApiData) {
        const months = apiData.map((data) => data._id.period);
        const totalAmounts = apiData.map((data) => data.totalAmount);
        const counts = apiData.map((data) => data.count);
        const prevTotalAmounts = prevApiData.map((data) => data.totalAmount); // Extract prevReport total amounts
        const prevCounts = prevApiData.map((data) => data.count); // Extract prevReport counts

        setChartData({
          labels: months,
          datasets: [
            {
              label: selectedOption === "sales" ? "Total Amount" : "Count",
              borderColor: "rgba(54, 162, 235, 0.8)",
              backgroundColor: "rgba(54, 162, 235, 0.8)",
              data: selectedOption === "sales" ? totalAmounts : counts,
            },
            {
              label: selectedOption === "sales" ? "Previous Total Amount" : "Previous Count", // Label for prevReport data
              borderColor: "rgba(255, 99, 132, 0.8)", // Red color for dotted line
              borderDash: [5, 5], // Set border dashes for a dotted line
              data: selectedOption === "sales" ? prevTotalAmounts : prevCounts, // Use prevReport data
            },
          ],
        });
        setLoading((e) => ({ ...e, annualLoading: false }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTopProductData = async () => {
    try {
      const res = await getTopProduct(startDateTopProd, endDateTopProd);
      if (res && res.success) {
        setTopProducts(res.products);
        setLoading((e) => ({ ...e, topProductLoading: false }));
      }
    } catch (error) {
      console.log("frontend 2 error line 49 Dashboard.js", error);
    }
  };

  const getGraphs = async (g) => {
    try {
      const res = await getGraphData(g);
      if (res) console.log("Graph:", res.data.report);
    } catch (error) {
      console.log("Err Dashboard.js getGraphs", error);
    }
  };

  const listItem = (data, type) => {
    return data?.labels?.map((name, index) => {
      const color = data.datasets[0].backgroundColor[index];
      const value = data.datasets[0].data[index];
      return (
        <div key={index} style={{ flexDirection: "row", display: "flex", alignItems: "center", padding: "10px 10px" }}>
          <div className="dot" style={{ backgroundColor: color, marginRight: 10 }}></div>
          <span style={{ fontSize: 16 }}>
            {name} <span style={{ fontStyle: "italic" }}>({value})</span>
          </span>
        </div>
      );
    });
  };

  const getOrderData = async () => {
    try {
      const res = await getOrderWiseReport();
      if (res) {
        console.log("RES", res);
        const orderCount = res.orderCount;

        const data = {
          labels: ["Cancelled Orders", "New Orders", "Dispatched Orders", "Processed Orders", "Confirmed Orders", "Delivered Orders"],
          datasets: [
            {
              data: [
                getCount(orderCount, "cancelled"),
                getCount(orderCount, "pending"),
                getCount(orderCount, "dispatched"),
                getCount(orderCount, "processed"),
                getCount(orderCount, "confirmed"),
                getCount(orderCount, "delivered"),
              ],
              backgroundColor: ["#e14f64", "#dda12c", "#846dd4", "#198ae0", "#ff96d5", "#19df9c"],
              hoverBackgroundColor: ["#e14f64", "#dda12c", "#846dd4", "#198ae0", "#ff96d5", "#19df9c"],
            },
          ],
        };

        function getCount(orderCount, status) {
          const order = orderCount.find((item) => item._id === status);
          return order ? order.count : 0;
        }
        setOrderWiseData(data);
        console.log(data);
        setLoading((e) => ({ ...e, orderWiseLoading: false }));
      }
    } catch (error) {
      console.log("error line 87 getORderData", error);
    }
  };

  const getStockData = async () => {
    try {
      const res = await getProductCount();
      if (res) {
        const stockData = {
          labels: ["Total Products", "Active Products", "Inactive Products", "In stock", "Out of stock"],
          datasets: [
            {
              label: "Stock Data",
              backgroundColor: ["#198ae0", "#cc69e4", "#726e82", "#19df9c", "#f7556d"],
              borderRadius: 10,
              data: [res.totalProducts, res.activeProducts, res.inactiveProducts, res.productsWithQuantityAboveZero, res.productsWithZeroQuantity],
            },
          ],
        };
        setStockData(stockData);
        setLoading((e) => ({ ...e, stockWiseLoading: false }));
      }
    } catch (error) {
      console.log("err getStockData" + error);
    }
  };

  useEffect(() => {
    const fetchDataAndFinishLoading = async () => {
      await fetchData();
    };

    fetchDataAndFinishLoading();
  }, [selectedOption, chartDuration]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    fetchData().then();
    getOrderData().then();
    getCardDataSet().then();
    getGraphs("monthly").then();
    getTopProductData().then();
    getDonutData().then();
    getStockData().then();
  }, []);

  useEffect(() => {
    getDonutData().then();
  }, [donutDates]);

  useEffect(() => {
    getTopProductData().then();
  }, [startDateTopProd]);

  const handleMonthChangeForTopProd = (event) => {
    setSelectedMonthForTopProd(event.target.value);
    console.log(event.target.value);
    const [month, year] = event.target.value.split("/").map((str) => str.trim());
    const parsedYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);

    const fromDate = new Date(parsedYear, parseInt(month) - 1, 1);
    const toDate = new Date(parsedYear, parseInt(month), 0);

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    setStartDateTopProd(formattedFromDate);
    setEndDateTopProd(formattedToDate);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        margin: "20px 20px",
      }}>
      <div
        style={{
          backgroundColor: "rgb(255, 255, 255)",
          padding: "15px",
          gap: 10,
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px #0000001A",
          display: "flex",
          flexDirection: "column",
        }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 20,
          }}>
          <div
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}>
            <span>Select Date</span>
          </div>
          {/* <select value={selectedOption} onChange={handleSelectChange}  >
                        <option value="option1">Today</option>
                        <option value="option2">Yesterday</option>
                        <option value="option3">Previous week</option>
                    </select>
                    <span>OR</span> */}
          <div
            style={{
              flex: 0.3,
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
              className={`date-picker-label ${fromDate ? "active" : ""}`}>
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
              flex: 0.3,
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
              className={`date-picker-label ${toDate ? "active" : ""}`}>
              End Date
            </label>
            <input
              style={{
                borderWidth: 0,
                outlineWidth: 1,
                padding: 0,
                textAlign: "center",
              }}
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
              }}
              className="date-picker-input"
              placeholder="Start date"
            />
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
            }}>
            <button
              ref={refreshRef}
              onClick={async () => {
                // setLoading({
                //   cardsLoading: true,
                //   annualLoading: true,
                //   donutLoading: true,
                //   orderWiseLoading: true,
                //   stockWiseLoading: true,
                //   topProductLoading: true,
                //   topCategoryLoading: true,
                //   topBrandLoading: true,
                // });
                const result = await refreshData();
                if (result.success) {
                  toast.success("Data refreshed");
                }
                refreshRef.current.blur();
              }}
              type="button"
              className="refreshButton">
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                <path
                  fillRule="evenodd"
                  d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                setLoading((e) => {
                  return { ...e, cardsLoading: true };
                });
                getCardDataSet().then();
              }}
              style={{
                backgroundColor: "#ffef03",
                padding: "10px 30px",
                fontSize: 14,
                width: "fit-content",
                borderRadius: 10,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#e3d400",
              }}>
              Search
            </button>
          </div>
        </div>

        <div
          style={{
            flexDirection: "row",
            display: "flex",
            gap: 10,
          }}>
          {loading.cardsLoading ? (
            <>
              <Skeleton animation={false} variant="rounded" style={{ borderRadius: 10, flex: 1, height: 60 }} />
              <Skeleton animation={false} variant="rounded" style={{ borderRadius: 10, flex: 1, height: 60 }} />
              <Skeleton animation={false} variant="rounded" style={{ borderRadius: 10, flex: 1, height: 60 }} />
              <Skeleton animation={false} variant="rounded" style={{ borderRadius: 10, flex: 1, height: 60 }} />
              <Skeleton animation={false} variant="rounded" style={{ borderRadius: 10, flex: 1, height: 60 }} />
            </>
          ) : (
            <>
              <div className="statCard">
                <p style={{ fontSize: 12 }}>Total Sale</p>
                <p style={{ fontSize: 16, fontWeight: "bold" }}>₹{formatIndian(Math.floor(cardData?.totalAmount))}</p>
              </div>
              <div className="statCard">
                <p style={{ fontSize: 12 }}>Delivery Charge</p>
                <p style={{ fontSize: 16, fontWeight: "bold" }}>₹{formatIndian(cardData?.deliveryCharges)}</p>
              </div>
              <div className="statCard">
                <p style={{ fontSize: 12 }}>Net Sale</p>
                <p style={{ fontSize: 16, fontWeight: "bold" }}>₹{formatIndian(Math.floor(cardData?.netSales))}</p>
              </div>
              <div className="statCard">
                <p style={{ fontSize: 12 }}>Total Orders</p>
                <p style={{ fontSize: 16, fontWeight: "bold" }}>{formatIndian(cardData?.orderCount)}</p>
              </div>
              <div className="statCard">
                <p style={{ fontSize: 12 }}>Average Order Amount</p>
                <p style={{ fontSize: 16, fontWeight: "bold" }}>₹{formatIndian(cardData?.AOV)}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        id="firstContainer"
        style={{
          marginTop: 20,
        }}>
        {loading.annualLoading ? (
          <Skeleton
            animation={false}
            variant="rounded"
            style={{
              borderRadius: 10,
              flex: 0.7,
            }}
            height={480}
          />
        ) : (
          <div
            style={{
              backgroundColor: "rgb(255, 255, 255)",
              padding: "15px",
              gap: 10,
              flex: 0.75,
              borderRadius: "10px",
              boxShadow: "0px 0px 10px 0px #0000001A",
              display: "flex",
              flexDirection: "column",
            }}>
            <MonthlyChart
              chartData={chartData}
              setChartData={setChartData}
              chartDuration={chartDuration}
              setChartDuration={setChartDuration}
              selectedOption={selectedOption}
              handleOptionChange={handleOptionChange}
            />
          </div>
        )}
        {loading.donutLoading ? (
          <Skeleton
            animation={false}
            variant="rounded"
            style={{
              borderRadius: 10,
              flex: 0.3,
            }}
            height={480}
          />
        ) : (
          <div id="sourceReport">
            <SemiDonut donutDates={donutDates} setDonutDates={setDonutDates} data={donutData} />
          </div>
        )}
      </div>
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          flex: 1,
          marginBottom: 20,
          justifyContent: "space-between",
          marginTop: 20,
          gap: 20,
        }}>
        {loading.orderWiseLoading ? (
          <Skeleton
            animation={false}
            variant="rounded"
            style={{
              borderRadius: 10,
              flex: 0.4,
            }}
            height={350}
          />
        ) : (
          <div className="Container" style={{ flexDirection: "column", display: "flex", flex: 0.6 }}>
            <span style={{ fontSize: 16, fontWeight: "bold" }}>Order Wise Report</span>
            <div className="Row" style={{ alignItems: "center", justifyContent: "space-around", border: "0px solid red" }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Doughnut height={200} options={{ plugins: { legend: false } }} data={orderWiseData} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", border: "0px solid green" }}>{listItem(orderWiseData, "doughnut")}</div>
            </div>
          </div>
        )}
        {loading.stockWiseLoading ? (
          <Skeleton
            animation={false}
            variant="rounded"
            style={{
              borderRadius: 10,
              flex: 0.6,
            }}
            height={350}
          />
        ) : (
          <div className="Container" style={{ flexDirection: "column", display: "flex", flex: 0.4 }}>
            <span style={{ fontSize: 16, fontWeight: "bold" }}>Stock Report</span>
            <div className="Row" style={{ alignItems: "center", flexDirection: "column", justifyContent: "space-around", display: "flex", flex: 1 }}>
              <div style={{ width: 350, flex: 1 }}>
                <Bar
                  data={stockData}
                  options={{
                    indexAxis: "y",
                    scales: {
                      x: {
                        ticks: {
                          beginAtZero: true,
                        },
                      },
                      y: {
                        display: false,
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
              <div style={{ flex: 1, gap: 5, flexDirection: "row", display: "flex", justifyContent: "space-around" }}>{listItem(stockData)}</div>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          flexDirection: "row",
          display: "flex",
          gap: 20,
        }}>
        {loading.topProductLoading ? (
          <Skeleton
            animation={false}
            variant="rounded"
            style={{
              borderRadius: 10,
              flex: 1,
            }}
            height={400}
          />
        ) : (
          <div style={{ height: 400, overflow: "hidden", backgroundColor: "white", borderRadius: 8, padding: "5px 0 10px 17px" }}>
            <div style={{ display: "flex", flex: 1, justifyContent: "space-between", margin: "10px 25px 10px 0px", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Top Products</h3>
              <select
                style={{ padding: "10px 5px", borderRadius: 8, border: "1px solid #eee" }}
                value={selectedMonthForTopProd}
                onChange={handleMonthChangeForTopProd}>
                {options.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div
              className=""
              style={{
                width: "100%",
                height: "100%",
                flex: 1,
                paddingRight: 17,
                boxSizing: "content-box",
                display: "flex",
                flexDirection: "column",
                maxHeight: 400,
                overflowY: "scroll",
                paddingBottom: 10,
              }}>
              <div className="statCard2">
                {topProducts?.map((a, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: 2,
                      marginBottom: 2,
                    }}>
                    <div
                      style={{
                        display: "flex",
                        flex: 1,
                        textTransform: "capitalize",
                      }}>
                      {a.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "row",
                        fontSize: 14,
                        color: "#808080",
                        marginBottom: 10,
                      }}>
                      <div
                        style={{
                          flex: 1,
                        }}>
                        Qty: <strong>{formatIndian(a.totalQuantity)}</strong>
                      </div>
                      <div
                        style={{
                          flex: 1,
                        }}>
                        {" "}
                        Sale :<strong>₹ {formatIndian(Math.floor(a.totalPrice))}</strong>
                      </div>
                    </div>
                    <Divider />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading.topCategoryLoading ? (
          <Skeleton
            animation={false}
            variant="rounded"
            style={{
              borderRadius: 10,
              flex: 1,
            }}
            height={400}
          />
        ) : (
          <div
            className="Container"
            style={{
              flex: 1,
            }}>
            <h4>Top Category</h4>
            <div className="statCard">
              {Array.from(
                {
                  length: 5,
                },
                () => ({
                  name: "Gauri Dubar Basmati Rice 5 Kg",
                  subcat: "Rice & Rice products",
                })
              ).map((a, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: 2,
                    marginBottom: 2,
                  }}>
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      textTransform: "capitalize",
                    }}>
                    {a.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "row",
                      fontSize: 14,
                      color: "#808080",
                      marginBottom: 10,
                    }}>
                    <div
                      style={{
                        flex: 1,
                      }}>
                      <strong> Sub Category:</strong> {a.subcat}
                    </div>
                  </div>
                  <Divider />
                </div>
              ))}
            </div>
          </div>
        )}

        {loading.topBrandLoading ? (
          <Skeleton
            animation={false}
            variant="rounded"
            style={{
              borderRadius: 10,
              flex: 1,
            }}
            height={400}
          />
        ) : (
          <div
            className="Container"
            style={{
              flex: 1,
            }}>
            <h4>Top Brand</h4>
            <div className="statCard">
              {Array.from(
                {
                  length: 8,
                },
                () => ({
                  name: "Gauri Rice",
                  count: "1500",
                })
              ).map((a, index) => (
                <>
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 2,
                      marginBottom: 10,
                    }}>
                    <div
                      style={{
                        display: "flex",
                        flex: 1,
                        textTransform: "capitalize",
                      }}>
                      {a.name}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        color: "#808080",
                        textAlign: "end",
                      }}>
                      {" "}
                      Products:
                      <strong>{a.count}</strong>
                    </div>
                  </div>
                  <Divider />
                </>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
