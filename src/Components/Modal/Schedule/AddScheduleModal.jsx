import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";
import Swal from "sweetalert2";
import api from "../../../API/api";

const AddScheduleModal = ({ onClose, onAddSchedule }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newSchedule = { name, date };
      const response = await api.post("/schedule", newSchedule);
      const addedSchedule = {
        ...response.data.data,
        formattedDate: new Date(response.data.data.date).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ),
      };

      Swal.fire("Success", "Schedule added successfully", "success");
      onAddSchedule(addedSchedule);
      onClose();
    } catch (err) {
      console.error("Error adding schedule:", err);
      setError(err.message);
      Swal.fire("Error", "Failed to add schedule", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-3/4 lg:w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Add New Schedule</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <label className="font-medium">Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
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
              {loading ? "Loading..." : "Add Schedule"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddScheduleModal;
