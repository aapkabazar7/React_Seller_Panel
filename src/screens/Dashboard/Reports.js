import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import "chartjs-plugin-datalabels";

const Reports = ({ orders, products }) => {
  ChartJS.register(ArcElement, Tooltip, CategoryScale, LinearScale, BarElement);
  const data = {
    labels: ["New Orders", "Processed Orders", "Dispatched Orders", "Delivered Orders", "Confirmed Orders", "Cancelled Orders"],
    datasets: [
      {
        data: [orders.newOrder, orders.processedOrder, orders.dispatchedOrder, orders.deliveredOrder, orders.confirmOrder, orders.cancelledOrder],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0", "#FF9800"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0", "#FF9800"],
      },
    ],
  };

  const listItem = (data) => {
    return data?.labels?.map((name, index) => {
      const color = data.datasets[0].backgroundColor[index];
      const value = data.datasets[0].data[index];
      return (
        <div key={index} style={{ flexDirection: "row", display: "flex", alignItems: "center", gap: 15, padding: "5px 0px" }}>
          <div className="dot" style={{ backgroundColor: color }}></div>
          <p>{name}</p>
          <span>({value})</span>
        </div>
      );
    });
  };

  const chartData = {
    labels: ["Active Products", "Deactive Products", "Out of Stock Products", "Total Products"],
    datasets: [
      {
        label: "Product Count",
        data: [products.activeProduct, products.deactiveProduct, products.outofStockProduct, products.totalProduct],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
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
  };

  return (
    <div style={{ margin: "20px 0px", gap: "20px", display: "flex", flex: 1 }}>
      <div className="Container">
        <h3>Order Wise Report</h3>
        <div className="Row" style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "50%" }}>
            <Doughnut options={{ plugins: { legend: false } }} data={data} />
          </div>
          <div style={{ width: "50%", gap: 10 }}>{listItem(data)}</div>
        </div>
      </div>
      <div className="Container" style={{ flexDirection: "column", display: "flex" }}>
        <h3>Stock Wise Report</h3>
        <div className="Row" style={{ alignItems: "center", justifyContent: "center", display: "flex", flex: 1 }}>
          <div style={{ width: "50%" }}>
            <Bar data={chartData} options={options} />
          </div>
          <div style={{ width: "50%", gap: 10 }}>{listItem(chartData)}</div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
