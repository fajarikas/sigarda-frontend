import React from "react";
import { Chart as ChartJs, ArcElement, Legend, Title, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJs.register(Title, Tooltip, Legend, ArcElement);

const PieChart = ({ data }) => {
  const chartData = {
    labels: ["Men", "Women"],
    datasets: [
      {
        label: "",
        data: [data.men, data.women],
        backgroundColor: ["#9079E9", "#F9CDD0"],
        borderColor: ["#F9CDD0", "#9079E9"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="bg-white px-6 py-10 rounded-xl shadow-xl w-full">
      <p className="text-center font-semibold text-lg mb-5">
        Users Total By Gender
      </p>
      <div className="w-full h-1/2">
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default PieChart;
