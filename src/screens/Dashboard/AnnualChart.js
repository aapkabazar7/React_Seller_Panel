import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { getGraphData } from "../../Apis/Dashboard";

Chart.register(...registerables);

const MonthlyChart = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("sales");
  const [chartDuration, setChartDuration] = useState("monthly");

  const formatDateToMonthNames = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "long", year: "2-digit" });
  };

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
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData().then();
  }, [selectedOption, chartDuration]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  return (
    <div style={{ height: 450 }}>
      <div style={{ justifyContent: "center", width: "100%", display: "flex" }}>
        <div className="radio-button-container">
          <div style={{ marginTop: 4 }} className="radio-button">
            <input type="radio" className="radio-button__input" id="radio1" name="radio-group" value="orders" checked={selectedOption === "orders"} onChange={handleOptionChange} />
            <label className="radio-button__label" htmlFor="radio1">
              <span className="radio-button__custom" />
              Orders
            </label>
          </div>
          <div style={{ marginTop: 4 }} className="radio-button">
            <input type="radio" className="radio-button__input" id="radio2" name="radio-group" value="sales" checked={selectedOption === "sales"} onChange={handleOptionChange} />
            <label className="radio-button__label" htmlFor="radio2">
              <span className="radio-button__custom" />
              Sales
            </label>
          </div>
          <div style={{ marginTop: 0 }}>
            <select
              style={{ borderRadius: 5, padding: 5 }}
              value={chartDuration}
              onChange={(e) => {
                setChartDuration(e.target.value);
                setChartData(null);
              }}>
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Daily">Daily</option>
            </select>
          </div>
          <div style={{ flexDirection: "row", display: chartDuration === "Custom" ? "none" : "none", gap: 20 }}>
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
                value={"2024-02-12"}
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
                }}>
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
                value={"2024-02-12"}
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
                  padding: "2px 5px",
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
        </div>
      </div>
      <div style={{ border: "0px solid red", height: "90%", display: "flex", justifyContent: "center" }}>
        {chartData && (
          <Line
            data={chartData}
            options={{
              scales: {
                x: {
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 12,
                  },
                },
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
              animation: {
                duration: 0,
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MonthlyChart;
