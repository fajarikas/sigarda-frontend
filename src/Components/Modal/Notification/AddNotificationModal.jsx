import React, { useState, useEffect } from "react";
import api from "../../../API/api";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";
import Select from "react-select";
import Swal from "sweetalert2";

const AddNotificationModal = ({ onClose, onAddNotification }) => {
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [type, setType] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user");
        const userData = response.data.data.map((user) => ({
          value: user.id,
          label: user.name,
        }));
        setUserOptions(userData);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newNotification = {
      user_id: selectedUser ? selectedUser.value : null,
      type: type ? type.value : null,
      message,
    };

    try {
      const response = await api.post("/notification", newNotification);
      onAddNotification(response.data.data);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Notification Added",
        text: "The notification has been added successfully.",
      });

      onClose(); // Close the modal
      window.location.reload(); // Reload the page
    } catch (err) {
      console.error("Error adding notification:", err);
      setError(err.response ? err.response.data.message : err.message);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Failed to Add Notification",
        text: "There was an error adding the notification. Please try again.",
      });
    } finally {
      setLoading(false);
    }

    // Removed window.location.reload() to avoid unnecessary page reloads
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50  w-3/4 lg:w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Add Notification</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <label className="font-medium">User</label>
            <Select
              options={userOptions}
              value={selectedUser}
              onChange={setSelectedUser}
              placeholder="Select User"
              isClearable
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Type</label>
            <Select
              options={[
                { value: "notification", label: "Notification" },
                { value: "announcement", label: "Announcement" },
              ]}
              value={type}
              onChange={setType}
              placeholder="Select Type"
              isClearable
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Message</label>
            <textarea
              onChange={(e) => setMessage(e.target.value)}
              value={message}
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
              {loading ? "Loading..." : "Add Notification"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddNotificationModal;
