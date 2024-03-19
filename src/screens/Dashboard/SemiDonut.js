import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { useEffect, useState } from "react";
import { getOrderSourceReport } from "../../Apis/Dashboard";

Chart.register(ArcElement);

const SemiDonut = ({ data, setDonutDates, donutDates }) => {
	return (
		<div>
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
						flex: 1, textTransform: "capitalize",
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
