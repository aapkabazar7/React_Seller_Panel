import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { useEffect, useState } from "react";
import { getOrderSourceReport } from "../../Apis/Dashboard";
import { formatDate, generateOptions } from "../../utils/DateHandler";

Chart.register(ArcElement);


const SemiDonut = ({ data, setDonutDates, donutDates }) => {

  const [options] = useState(generateOptions());
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleChange = (event) => {
    setSelectedMonth(event.target.value);
    const [month, year] = event.target.value.split("/").map((str) => str.trim());
    const parsedYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);

    const fromDate = new Date(parsedYear, parseInt(month) - 1, 1);
    const toDate = new Date(parsedYear, parseInt(month), 0);

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    setDonutDates({ fromDate: formattedFromDate, toDate: formattedToDate });
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: 450, flex: 1 , alignItems: 'center'}}>
      <div style={{ display: "flex", justifyContent: "flex-end", width: 350 }}>
        <select style={{  padding: "10px 5px", borderRadius: 8, border: '1px solid #eee'}} value={selectedMonth} onChange={handleChange}>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{width: '280px !important', height: '280px !important'}}>
      <Doughnut
      
        data={{
          datasets: [
            {
              data: [data.desktop, data.phone, data.tablet],
              backgroundColor: ["#2d9fec", "#f6ba2a", "red"],
              display: true,
              // borderColor: "rgb(227 227 227)"
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },

          rotation: -90,
          circumference: 180,
          cutout: "60%",
          maintainAspectRatio: true,
          responsive: true,
        }}
      />
      </div>
      <div
        style={{
          justifyContent: "flex-start",
          display: "flex",
          flexDirection: "column",
        }}>
        <div
          style={{
            display: "flex",
            border: "0px solid black",
            gap: 10,
            alignItems: "center",
            flex: 1,
            textTransform: "capitalize",
          }}>
          <div
            style={{
              borderRadius: "50%",
              width: 15,
              height: 15,
              backgroundColor: "#2d9fec",
            }}></div>
          Order received from {Object.keys(data)[0]} <strong>({Object.values(data)[0]})</strong>
        </div>
        <div
          style={{
            display: "flex",
            border: "0px solid black",
            gap: 10,
            alignItems: "center",
            flex: 1,
            textTransform: "capitalize",
          }}>
          <div
            style={{
              borderRadius: "50%",
              width: 15,
              height: 15,
              backgroundColor: "#f6ba2a",
            }}></div>
          Order received from {Object.keys(data)[1]}
          <strong>({Object.values(data)[1]})</strong>
        </div>
        <div
          style={{
            display: "flex",
            border: "0px solid black",
            gap: 10,
            alignItems: "center",
            flex: 1,
            textTransform: "capitalize",
          }}>
          <div
            style={{
              borderRadius: "50%",
              width: 15,
              height: 15,
              backgroundColor: "red",
            }}></div>
          Order received from {Object.keys(data)[2]}
          <strong>({Object.values(data)[2]})</strong>
        </div>
      </div>
    </div>
  );
};

export default SemiDonut;
