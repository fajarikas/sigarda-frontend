import React, { useEffect, useState } from "react";
import Title from "../../Components/Title/Title";
import api from "../../API/api";
import CardData from "../../Components/CardData/CardData";
import { FaUser } from "react-icons/fa";
import PieChart from "../../Components/Chart/PieChart";
import { FaProjectDiagram } from "react-icons/fa";
import { FaBarsProgress } from "react-icons/fa6";
import { IoIosListBox } from "react-icons/io";
import LineChart from "../../Components/Chart/LineChart";

const Home = () => {
  const [countUser, setCountUser] = useState(null);
  const [countMen, setCountMen] = useState(null);
  const [countWomen, setCountWomen] = useState(null);
  const [countDoneProject, setCountDoneProject] = useState(null);
  const [countProgressProject, setCountProgressProject] = useState(null);
  const [countPlanningProject, setCountPlanningProject] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let retries = 3;
      let delay = 1000;

      while (retries > 0) {
        try {
          const response = await api.get("/dashboard");
          setCountUser(response.data.data.user);
          setCountMen(response.data.data.men);
          setCountWomen(response.data.data.women);
          setCountDoneProject(response.data.data.project.completed);
          setCountProgressProject(response.data.data.project.progress);
          setCountPlanningProject(response.data.data.project.planning);
          setLineChartData(response.data.data.projectsByMonth || {});
          setLoading(false);
          break;
        } catch (err) {
          if (err.response && err.response.status === 429) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2;
            retries -= 1;
          } else {
            setError(err);
            setLoading(false);
          }
        }
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const chartData = {
    men: countMen,
    women: countWomen,
  };

  return (
    <div className="min-h-screen pb-20 space-x-5 lg:space-x-0 z-20 w-10/12">
      <Title text="Home" />
      <div className="mt-7 block">
        <div className="block space-y-6 lg:space-y-0 lg:flex justify-between w-10/12">
          <CardData icon={<FaUser />} text="User" data={countUser} />
          <CardData
            icon={<FaProjectDiagram />}
            text="Project Completed"
            data={countDoneProject}
          />
          <CardData
            icon={<FaBarsProgress />}
            text="Project On Progress"
            data={countProgressProject}
          />
          <CardData
            icon={<IoIosListBox />}
            text="Project Planned"
            data={countPlanningProject}
          />
        </div>

        <div className="mt-16">
          <Title text="Charts" />
          <div className="block lg:flex gap-x-12 mt-7 items-center">
            <div className="w-full sm:w-1/2 lg:w-1/3">
              <PieChart data={chartData} />
            </div>
            <div className="mt-5 lg:mt-0 w-full sm:w-1/2 lg:w-2/3">
              <LineChart apiData={lineChartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
