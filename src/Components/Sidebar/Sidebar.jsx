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
    <div className="z-10 hidden lg:inline w-[10%] h-fixed border-r border-[#BDBDBD] text-[#BDBDBD] pb-12">
      <div className="w-10/12 mx-auto pt-5">
        <a href="/home" className="flex">
          <img src={Logo} alt="logo" className=" w-1/2 mx-auto" />
        </a>

        <div className="mt-12 flex flex-col items-center space-y-4">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `text-2xl p-3  ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl"
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <AiFillHome />
          </NavLink>

          {userRole === "super admin" && (
            <NavLink
              to="/user"
              className={({ isActive }) =>
                `text-2xl p-3 ${
                  isActive
                    ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                    : "text-[#BDBDBD]"
                }`
              }
            >
              <MdPeople />
            </NavLink>
          )}

          <NavLink
            to="/project"
            className={({ isActive }) =>
              `text-2xl p-3 ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <IoDocuments />
          </NavLink>
          <NavLink
            to="/meeting"
            className={({ isActive }) =>
              `text-2xl p-3 ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <MdGroups />
          </NavLink>
          <NavLink
            to="/notification"
            className={({ isActive }) =>
              `text-2xl p-3 ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <IoNotifications />
          </NavLink>
          <NavLink
            to="/location"
            className={({ isActive }) =>
              `text-2xl p-3 ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <FaLocationPin />
          </NavLink>
          <NavLink
            to="/schedule"
            className={({ isActive }) =>
              `text-2xl p-3 ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <FaCalendar />
          </NavLink>
          <NavLink
            to="/scheduled/user"
            className={({ isActive }) =>
              `text-2xl p-3 ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <AiFillSchedule />
          </NavLink>
          <NavLink
            to="/presence"
            className={({ isActive }) =>
              `text-2xl p-3 ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <FaClipboardList />
          </NavLink>
          <NavLink
            to="/shift"
            className={({ isActive }) =>
              `text-2xl p-3 ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <FaClock />
          </NavLink>
          <NavLink
            to="/shift-change"
            className={({ isActive }) =>
              `text-2xl p-3 ${
                isActive
                  ? "bg-white text-[#2D3845] rounded-lg shadow-xl "
                  : "text-[#BDBDBD]"
              }`
            }
          >
            <FaClockRotateLeft />
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
