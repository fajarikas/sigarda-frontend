import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import Swal from "sweetalert2";
import "react-calendar/dist/Calendar.css";
import api from "../../API/api";

const UserShiftCalendar = ({ userId, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSchedule = async () => {
      try {
        const response = await api.get(`/user/${userId}/schedule`);
        setUserData(response.data.user);
        setShifts(
          response.data.schedules.flatMap((schedule) => schedule.details)
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user schedule:", error);
        Swal.fire("Error", "Failed to fetch user schedule", "error");
      }
    };

    fetchUserSchedule();
  }, [userId]);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const shift = shifts.find(
        (shift) => shift.date === date.toISOString().split("T")[0]
      );

      if (shift) {
        let bgColor;
        switch (shift.shift) {
          case "Pagi":
            bgColor = "bg-blue-600";
            break;
          case "Siang":
            bgColor = "bg-green-600";
            break;
          case "Fulltime":
            bgColor = "bg-yellow-600";
            break;
          case "Libur":
            bgColor = "bg-red-600";
            break;
          default:
            bgColor = "bg-gray-300";
            break;
        }

        return (
          <div
            className={`mt-1 font-medium text-[10px] ${bgColor} text-white `}
            title={`Shift: ${shift.shift}`}
          >
            <p>{shift.shift}</p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black w-full bg-opacity-50">
      <div className="fixed inset-0 z-50 w-3/4 lg:w-fit mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">{userData?.name} Schedules</h2>
          <button onClick={onClose} className="text-red-600 text-xl font-bold">
            X
          </button>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="mt-5">
            <Calendar tileContent={tileContent} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserShiftCalendar;
