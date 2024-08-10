import React from "react";
import PageAccent from "../PageAccent/PageAccent";
import Sidebar from "../Sidebar/Sidebar";
import BottomBar from "../BottomBar/BottomBar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="h-full ">
      <PageAccent />
      <div className=" lg:w-full space-x-0  lg:space-x-12 flex ">
        <Sidebar />
        {children}
        <BottomBar />
      </div>
    </div>
  );
};

export default DashboardLayout;
