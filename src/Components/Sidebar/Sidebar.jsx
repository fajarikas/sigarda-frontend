import React from "react";
import Logo from "../../assets/images/logo.svg";
import { IoLogOut, IoPeopleSharp } from "react-icons/io5";
import { MdPeople } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { IoDocuments } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaClock, FaClockRotateLeft, FaLocationPin } from "react-icons/fa6";
import { FaCalendar, FaCalendarCheck } from "react-icons/fa";
import { AiFillSchedule } from "react-icons/ai";
import { FaClipboardList } from "react-icons/fa";
import { BsShift } from "react-icons/bs";
import IconButton from "../Button/IconButton";
import Swal from "sweetalert2";

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const userRole = localStorage.getItem("role");

  const confirmLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to log out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F5004F",
      cancelButtonColor: "#399918",
      confirmButtonText: "Yes, log out",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };
  return (
    <div className="z-10 hidden lg:inline w-2/12 h-fixed border-r border-[#BDBDBD] text-[#BDBDBD] pb-12">
      <div className="w-10/12 mx-auto pt-5">
        <a href="/home" className="flex">
          <img src={Logo} alt="logo" className=" w-1/3 mx-auto" />
        </a>

        <div className="mt-12 flex flex-col items-center space-y-4 text-left">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `text-sm p-3 w-full  ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl"
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <div className="flex items-center space-x-2">
              <AiFillHome />
              <span className="text-base font-medium">Home</span>
            </div>
          </NavLink>

          {userRole === "super admin" && (
            <NavLink
              to="/user"
              className={({ isActive }) =>
                `text-lg p-3  w-full ${
                  isActive
                    ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                    : "text-[rgb(189,189,189)]"
                }`
              }
            >
              <div className="flex items-center space-x-2">
                <MdPeople />
                <span className="text-base font-medium">User</span>
              </div>
            </NavLink>
          )}

          <NavLink
            to="/project"
            className={({ isActive }) =>
              `text-lg p-3  w-full ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <div className="flex items-center space-x-2">
              <IoDocuments />
              <span className="text-base font-medium">Project</span>
            </div>
          </NavLink>
          <NavLink
            to="/meeting"
            className={({ isActive }) =>
              `text-lg p-3  w-full ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <div className="flex items-center space-x-2">
              <MdGroups />
              <span className="text-base font-medium">Meeting</span>
            </div>
          </NavLink>
          <NavLink
            to="/notification"
            className={({ isActive }) =>
              `text-lg p-3  w-full ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <div className="flex items-center space-x-2">
              <IoNotifications />
              <span className="text-base font-medium">Notification</span>
            </div>
          </NavLink>
          <NavLink
            to="/location"
            className={({ isActive }) =>
              `text-lg p-3  w-full ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <div className="flex items-center space-x-2">
              <FaLocationPin />
              <span className="text-base font-medium">Location</span>
            </div>
          </NavLink>
          <NavLink
            to="/schedule"
            className={({ isActive }) =>
              `text-lg p-3  w-full ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <div className="flex items-center space-x-2">
              <FaCalendar />
              <span className="text-base font-medium">Schedule</span>
            </div>
          </NavLink>
          <NavLink
            to="/scheduled/user"
            className={({ isActive }) =>
              `text-lg p-3  w-full ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <div className="flex items-center space-x-2">
              <AiFillSchedule />
              <span className="text-base font-medium truncate w-3/4">
                Scheduled User
              </span>
            </div>
          </NavLink>
          <NavLink
            to="/presence"
            className={({ isActive }) =>
              `text-lg p-3  w-full ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <div className="flex items-center space-x-2">
              <FaClipboardList />
              <span className="text-base font-medium">Presence</span>
            </div>
          </NavLink>
          <NavLink
            to="/shift"
            className={({ isActive }) =>
              `text-lg p-3  w-full ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <div className="flex items-center space-x-2">
              <FaClock />
              <span className="text-base font-medium">Shift</span>
            </div>
          </NavLink>
          <NavLink
            to="/shift-change"
            className={({ isActive }) =>
              `text-lg p-3  w-full ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <div className="flex items-center space-x-2">
              <FaClockRotateLeft />
              <span className="text-base font-medium">Shift Change</span>
            </div>
          </NavLink>

          <IconButton
            color="bg-red-600"
            text={<IoLogOut />}
            onClick={confirmLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
