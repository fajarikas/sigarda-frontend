import React, { useState, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";
import Swal from "sweetalert2";
import api from "../../../API/api";

const EditScheduleModal = ({ schedule, onClose, onEditSchedule }) => {
  const [name, setNames] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (schedule) {
      setNames(schedule.name || schedule.name);
      setDate(schedule.date.split(" ")[0]); // Remove the time component, keep only the date
    }
  }, [schedule]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedSchedule = {
        name,
        date,
      };

      const response = await api.put(
        `/schedule/${schedule.id}`,
        updatedSchedule
      );

      onEditSchedule(schedule.id, response.data.data);
      Swal.fire("Success", "Schedule updated successfully", "success");
      onClose();
    } catch (err) {
      console.error("Error editing schedule:", err);
      setError(err.message);
      Swal.fire("Error", "Failed to update schedule", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-3/4 lg:w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Edit Schedule</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <label className="font-medium">name</label>
            <input
              onChange={(e) => setNames(e.target.value)}
              value={name}
              type="text"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Date</label>
            <input
              onChange={(e) => setDate(e.target.value)}
              value={date}
              type="date"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
          </div>

          <div className="mt-5 flex justify-end">
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Update Schedule"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditScheduleModal;
