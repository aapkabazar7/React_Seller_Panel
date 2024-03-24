import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { getGraphData } from "../../Apis/Dashboard";

Chart.register(...registerables);

const MonthlyChart = ({ handleOptionChange, chartData, chartDuration, selectedOption, setChartData, setChartDuration }) => {
  return (
    <div style={{ height: 450 }}>
      <div style={{ justifyContent: "center", width: "100%", display: "flex", flex: 1 }}>
        <div style={{ flex: 1, display: 'flex' }}></div>
        <div className="radio-button-container" style={{flex: 1, justifyContent: 'center'}}>
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
        </div>
        <div style={{ marginTop: 0 , flex : 1, justifyContent: 'flex-end', display: 'flex'}}>
          <select
            style={{ borderRadius: 8, padding: '10px 5px' , border: '1px solid #eee', margin: '0 15px'}}
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
              tooltips: {
                callbacks: {
                  label: function(tooltipItem, data) {
                    var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                    if (datasetLabel) {
                      datasetLabel += ': ';
                    }
                    var value = tooltipItem.yLabel;
                    // If the tooltip is for the second dataset (prevReport), add "Previous" to the label
                    if (tooltipItem.datasetIndex === 1) {
                      datasetLabel = "Previous Period" + datasetLabel;
                    }else{
                      datasetLabel = "Current Period" + datasetLabel;
                    }
                    return datasetLabel + value;
                  }
                }
              },
              plugins: {
                legend: {
                  display: true,
                  position  : 'bottom',

                },
              },
              animation: {
                duration: 1000,
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MonthlyChart;
