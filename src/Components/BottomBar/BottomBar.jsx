import React, { useState } from "react";
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
import { RiMenu3Fill } from "react-icons/ri";

const BottomBar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

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
    <div className="inline lg:hidden">
      <div className="z-50 py-4 left-0 shadow fixed bg-white w-full bottom-0 text-[#BDBDBD]">
        <div className="w-11/12 mx-auto flex items-center justify-between">
          <img src={Logo} className="w-1/12" />
          <button onClick={handleOpenMenu} className="text-black">
            <RiMenu3Fill />
          </button>
        </div>
      </div>

      {openMenu && (
        <div className="bg-white border-t-black border border-opacity-60 w-full bottom-16 absolute left-0 shadow-lg z-40">
          <div className="p-4">
            <NavLink to="/home" className="flex items-center">
              <AiFillHome className="mr-2" /> Home
            </NavLink>
            <NavLink to="/user" className="flex items-center mt-4">
              <MdPeople className="mr-2" /> User
            </NavLink>
            <NavLink to="/project" className="flex items-center mt-4">
              <IoDocuments className="mr-2" /> Project
            </NavLink>
            <NavLink to="/meeting" className="flex items-center mt-4">
              <MdGroups className="mr-2" /> Meeting
            </NavLink>
            <NavLink to="/notification" className="flex items-center mt-4">
              <IoNotifications className="mr-2" /> Notification
            </NavLink>
            <NavLink to="/location" className="flex items-center mt-4">
              <FaLocationPin className="mr-2" /> Location
            </NavLink>
            <NavLink to="/schedule" className="flex items-center mt-4">
              <FaCalendar className="mr-2" /> Schedule
            </NavLink>
            <NavLink to="/scheduled/user" className="flex items-center mt-4">
              <AiFillSchedule className="mr-2" /> Scheduled User
            </NavLink>
            <NavLink to="/presence" className="flex items-center mt-4">
              <FaClipboardList className="mr-2" /> Presence
            </NavLink>
            <NavLink to="/shift" className="flex items-center mt-4">
              <FaClock className="mr-2" /> Shift
            </NavLink>
            <NavLink to="/shift-change" className="flex items-center mt-4">
              <FaClockRotateLeft className="mr-2" /> Shift Changes
            </NavLink>
            <button
              onClick={confirmLogout}
              className="flex items-center mt-4 text-red-600"
            >
              <IoLogOut className="mr-2" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomBar;
