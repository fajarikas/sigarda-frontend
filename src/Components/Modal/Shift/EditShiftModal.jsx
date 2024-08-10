import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import PrimaryButton from "../../Button/PrimaryButton";
import api from "../../../API/api";

const EditShiftModal = ({ onClose, onUpdateShift, shift }) => {
  const [name, setName] = useState(shift.name);
  const [start, setStart] = useState(shift.start);
  const [end, setEnd] = useState(shift.end);

  const handleSubmit = async () => {
    try {
      const response = await api.put(`/shift/${shift.id}`, {
        name,
        start,
        end,
      });
      onUpdateShift(response.data.data);
      onClose();
    } catch (err) {
      console.error("Error updating shift:", err);
    }

    window.location.reload();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-xl w-3/4 lg:w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Shift</h2>
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
            text="Save"
            color="bg-blue-600"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default EditShiftModal;
