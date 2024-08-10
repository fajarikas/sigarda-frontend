import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import RequireAuth from "./Components/Auth/RequireAuth";
import Sidebar from "./Components/Sidebar/Sidebar";
import Home from "./Pages/Home/Home";
import PageAccent from "./Components/PageAccent/PageAccent";
import DashboardLayout from "./Components/Layout/DashboardLayout";
import User from "./Pages/User/User";
import Project from "./Pages/Project/Project";
import Meeting from "./Pages/Meeting/Meeting";
import Notification from "./Pages/Notification/Notification";
import Location from "./Pages/Location/Location";
import Schedule from "./Pages/Schedule/Schedule";
import ScheduledUser from "./Pages/ScheduledUser/ScheduledUser";
import Presence from "./Pages/Presence/Presence";
import Shift from "./Pages/Shift/Shift";
import ShiftChange from "./Pages/ShiftChange/ShiftChange";

function App() {
  return (
    <div className="font-rubik h-fit lg:h-full bg-[#F5F5F5] text-[#2D3845]">
      <div className="w-full">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/home"
              element={
                <DashboardLayout>
                  <RequireAuth>
                    <Home />
                  </RequireAuth>
                </DashboardLayout>
              }
            />
            <Route
              path="/user"
              element={
                <DashboardLayout>
                  <RequireAuth>
                    <User />
                  </RequireAuth>
                </DashboardLayout>
              }
            />
            <Route
              path="/project"
              element={
                <DashboardLayout>
                  <RequireAuth>
                    <Project />
                  </RequireAuth>
                </DashboardLayout>
              }
            />
            <Route
              path="/meeting"
              element={
                <DashboardLayout>
                  <RequireAuth>
                    <Meeting />
                  </RequireAuth>
                </DashboardLayout>
              }
            />
            <Route
              path="/notification"
              element={
                <DashboardLayout>
                  <RequireAuth>
                    <Notification />
                  </RequireAuth>
                </DashboardLayout>
              }
            />
            <Route
              path="/location"
              element={
                <DashboardLayout>
                  <RequireAuth>
                    <Location />
                  </RequireAuth>
                </DashboardLayout>
              }
            />
            <Route
              path="/schedule"
              element={
                <DashboardLayout>
                  <RequireAuth>
                    <Schedule />
                  </RequireAuth>
                </DashboardLayout>
              }
            />
            <Route
              path="/scheduled/user"
              element={
                <DashboardLayout>
                  <RequireAuth>
                    <ScheduledUser />
                  </RequireAuth>
                </DashboardLayout>
              }
            />
            <Route
              path="/presence"
              element={
                <DashboardLayout>
                  <RequireAuth>
                    <Presence />
                  </RequireAuth>
                </DashboardLayout>
              }
            />
            <Route
              path="/shift"
              element={
                <DashboardLayout>
                  <RequireAuth>
                    <Shift />
                  </RequireAuth>
                </DashboardLayout>
              }
            />
            <Route
              path="/shift-change"
              element={
                <DashboardLayout>
                  <RequireAuth>
                    <ShiftChange />
                  </RequireAuth>
                </DashboardLayout>
              }
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
