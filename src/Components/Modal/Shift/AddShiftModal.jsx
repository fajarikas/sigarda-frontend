import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import PrimaryButton from "../../Button/PrimaryButton";
import api from "../../../API/api";

const AddShiftModal = ({ onClose, onAddShift }) => {
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await api.post("/shift", { name, start, end });
      onAddShift(response.data.data);
      onClose();
    } catch (err) {
      console.error("Error adding shift:", err);
    }

    window.location.reload();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-xl w-3/4 lg:w-1/2 ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Shift</h2>
          <PrimaryButton
            text={<MdClose />}
            color="bg-red-600"
            onClick={onClose}
          />
        </div>
        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2">Start Time</label>
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2">End Time</label>
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <PrimaryButton
            text="Add"
            color="bg-blue-600"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default AddShiftModal;
