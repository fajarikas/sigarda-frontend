import React, { useState, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";
import Swal from "sweetalert2";
import api from "../../../API/api";

const EditPresenceModal = ({ presence, onClose, onEditPresence }) => {
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (presence) {
      setUserId(presence.user_id || "");
      setStatus(presence.status || "Hadir");
      setCheckIn(presence.check_in || "");
      setCheckOut(presence.check_out || "");
    }
  }, [presence]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedPresence = {
        user_id: userId,
        status,
        check_in: checkIn,
        check_out: checkOut,
      };
      const response = await api.put(
        `/presence/${presence.id}`,
        updatedPresence
      );

      onEditPresence(presence.id, response.data.presence);
      Swal.fire("Success", "Presence updated successfully", "success");
      onClose();
    } catch (err) {
      console.error("Error editing presence:", err);
      setError(err.message);
      Swal.fire("Error", "Failed to update presence", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Edit Presence</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <label className="font-medium">User ID</label>
            <input
              onChange={(e) => setUserId(e.target.value)}
              value={userId}
              type="text"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Status</label>
            <select
              onChange={(e) => setStatus(e.target.value)}
              value={status}
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
            >
              <option value="Hadir">Hadir</option>
              <option value="Tidak Hadir">Tidak Hadir</option>
            </select>
          </div>
          <div className="mt-3">
            <label className="font-medium">Check In</label>
            <input
              onChange={(e) => setCheckIn(e.target.value)}
              value={checkIn}
              type="time"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Check Out</label>
            <input
              onChange={(e) => setCheckOut(e.target.value)}
              value={checkOut}
              type="time"
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
              {loading ? "Loading..." : "Update Presence"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditPresenceModal;
