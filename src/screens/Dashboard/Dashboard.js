import React, { useEffect } from "react";
import "./Dashboard.css";
import { useState } from "react";
import Reports from "./Reports";
import { getCardData, getDashboardDetails, getGraphData, getOrderSourceReport, getOrderWiseReport, getProductCount, getTopProduct } from "../../Apis/Dashboard";
import SemiDonut from "./SemiDonut";
import { Divider, Skeleton } from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import { formatIndian } from "../../utils/toast";
import MonthlyChart from "./AnnualChart";

const Dashboard = () => {
  const [fromDate, setFromDate] = useState("");
  const [topProducts, setTopProducts] = useState([]);
  const [toDate, setToDate] = useState("");
  const [stockData, setStockData] = useState();
  const [orderWiseData, setOrderWiseData] = useState();
  const [donutDates, setDonutDates] = useState({
    fromDate: "2024-01-15",
    toDate: "2024-02-15",
  });
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
    const result = await getOrderSourceReport(donutDates.fromDate, donutDates.toDate);
    let temp = [];
    console.log("RESULT", result.users);
    result.users.forEach((element) => {
      temp[element._id] = element.count;
    });

    setDonutData(temp);
    setLoading((e) => ({
      ...e,
      donutLoading: false,
    }));
  };

  const getCardDataSet = async () => {
    try {
      const res = await getCardData("2024-02-10", "2024-02-20");
      if (res) {
        setLoading((e) => ({ ...e, cardsLoading: false }));
        setCardData(res?.data?.report);
      }
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTopProductData = async () => {
    try {
      const res = await getTopProduct();
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
              data: [getCount(orderCount, "cancelled"), getCount(orderCount, "pending"), getCount(orderCount, "dispatched"), getCount(orderCount, "processed"), getCount(orderCount, "confirmed"), getCount(orderCount, "delivered")],
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
    getOrderData().then();
    getCardDataSet().then();
    getGraphs("monthly").then();
    getTopProductData().then();
    getDonutData().then();
    getStockData().then();
  }, []);

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
              onChange={setFromDate}
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
              onChange={setToDate}
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
              <Skeleton variant="rounded" style={{ borderRadius: 10, flex: 1, height: 60 }} />
              <Skeleton variant="rounded" style={{ borderRadius: 10, flex: 1, height: 60 }} />
              <Skeleton variant="rounded" style={{ borderRadius: 10, flex: 1, height: 60 }} />
              <Skeleton variant="rounded" style={{ borderRadius: 10, flex: 1, height: 60 }} />
              <Skeleton variant="rounded" style={{ borderRadius: 10, flex: 1, height: 60 }} />
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
          marginTop: 10,
        }}>
        {!loading.annualLoading ? (
          <Skeleton
            variant="rounded"
            style={{
              borderRadius: 10,
              flex: 0.7,
            }}
            height={400}
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
            <MonthlyChart />
          </div>
        )}
        {loading.donutLoading ? (
          <Skeleton
            variant="rounded"
            style={{
              borderRadius: 10,
              flex: 0.3,
            }}
            height={400}
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
          marginBottom: 15,
          justifyContent: "space-between",
          marginTop: 15,
          gap: 10,
        }}>
        {loading.orderWiseLoading ? (
          <Skeleton
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
              display: "flex",
              flexDirection: "column",
            }}>
            <h4>Top Products</h4>
            <div className="statCard2">
              {topProducts?.slice(0, 5).map((a, index) => (
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
        )}

        {loading.topCategoryLoading ? (
          <Skeleton
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
