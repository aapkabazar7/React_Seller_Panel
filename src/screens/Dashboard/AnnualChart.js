import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { getGraphData } from "../../Apis/Dashboard";

Chart.register(...registerables);

const MonthlyChart = ({ handleOptionChange, chartData, chartDuration, selectedOption, setChartData, setChartDuration }) => {
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
