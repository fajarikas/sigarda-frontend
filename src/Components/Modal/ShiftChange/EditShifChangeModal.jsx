import React, { useState, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import Swal from "sweetalert2";
import api from "../../../API/api";
import PrimaryButton from "../../Button/PrimaryButton";
import Select from "react-select";

const EditShiftChangeModal = ({ isOpen, onClose, shiftChange, onUpdate }) => {
  const [userOptions, setUserOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Define status options
  const statusOptionsData = [
    { value: "approved", label: "Approved" },
    { value: "requested", label: "Requested" },
    { value: "rejected", label: "Rejected" },
  ];

  // Fetch users, shifts and set default values
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const usersResponse = await api.get("/user");
        const shiftsResponse = await api.get("/shift");

        const userData = usersResponse.data.data.map((user) => ({
          value: user.id,
          label: user.name,
        }));
        const shiftData = shiftsResponse.data.data.map((shift) => ({
          value: shift.id,
          label: shift.name,
        }));

        setUserOptions(userData);
        setShiftOptions(shiftData);
        setStatusOptions(statusOptionsData);

        if (shiftChange) {
          setSelectedUser(
            userData.find((u) => u.value === shiftChange.user_id)
          );
          setSelectedShift(
            shiftData.find((s) => s.value === shiftChange.shift_id)
          );
          setSelectedStatus(
            statusOptionsData.find((s) => s.value === shiftChange.status)
          );
        }
      } catch (err) {
        console.error("Error fetching options:", err);
        setError("Failed to load options.");
      }
    };

    fetchOptions();
  }, [shiftChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.put(`/shift-change/${shiftChange.id}`, {
        user_id: selectedUser?.value,
        shift_id: selectedShift?.value,
        status: selectedStatus?.value,
      });

      if (response.status === 200) {
        Swal.fire("Success", "Shift change updated successfully", "success");
        onUpdate(response.data.data);
        onClose();
      }
    } catch (err) {
      console.error("Error updating shift change:", err);
      setError("Failed to update shift change.");
    } finally {
      setLoading(false);
    }

    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50  w-3/4 lg:w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Edit Shift Change</p>
          <button className="text-xl" onClick={onClose}>
            <MdOutlineClose />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <label className="font-medium">User</label>
            <Select
              options={userOptions}
              value={selectedUser}
              onChange={setSelectedUser}
              placeholder="Select a user"
              isClearable
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Shift</label>
            <Select
              options={shiftOptions}
              value={selectedShift}
              onChange={setSelectedShift}
              placeholder="Select a shift"
              isClearable
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Status</label>
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Select a status"
              isClearable
              required
            />
          </div>

          <div className="mt-5 flex justify-end space-x-4">
            <PrimaryButton
              text={loading ? "Updating..." : "Update"}
              color="bg-blue-600"
              type="submit"
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>
      </div>
    </>
  );
};

export default EditShiftChangeModal;
