import React from "react";
import {
  Chart as ChartJs,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJs.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Title,
  Tooltip
);

const LineChart = ({ apiData }) => {
  const transformData = (data) => {
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    if (!data || typeof data !== "object") {
      console.warn("Data tidak valid:", data);
      return {
        labels: allMonths,
        datasets: [
          {
            label: "Jumlah Proyek per Bulan",
            data: new Array(12).fill(0),
            fill: true,
            backgroundColor: "#F9CDD0",
            borderColor: "#F9CDD0",
            tension: 0.1,
          },
        ],
      };
    }

    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key.trim(), value])
    );

    const months = Object.keys(cleanedData);
    const values = Object.values(cleanedData);

    const monthlyData = allMonths.map((month) => cleanedData[month] || 0);

    return {
      labels: allMonths,
      datasets: [
        {
          label: "Project ",
          data: monthlyData,
          fill: 2,
          backgroundColor: "#F9CDD0",
          //   pointBackgroundColor: "#9079E9",
          borderColor: "#9079E9",
          tension: 0.1,
        },
      ],
    };
  };

  const lineChartData = transformData(apiData);

  return (
    <div className="bg-white px-8 py-10 rounded-xl shadow-xl w-full">
      <p className="w-full text-center font-semibold text-lg mb-5">
        Project This Year
      </p>
      <Line data={lineChartData} />
    </div>
  );
};

export default LineChart;
