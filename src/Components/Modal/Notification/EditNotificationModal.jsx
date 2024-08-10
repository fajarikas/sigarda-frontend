import React, { useState, useEffect } from "react";
import api from "../../../API/api";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";
import Select from "react-select";
import Swal from "sweetalert2";

const EditNotificationModal = ({
  notification,
  onClose,
  onUpdateNotification,
}) => {
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

  useEffect(() => {
    if (notification) {
      setSelectedUser({
        value: notification.user_id,
        label: notification.user,
      });
      setType({
        value: notification.type.toLowerCase(),
        label:
          notification.type.charAt(0).toUpperCase() +
          notification.type.slice(1),
      });
      setMessage(notification.message);
    }
  }, [notification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const updatedNotification = {
      user_id: selectedUser ? selectedUser.value : notification.user_id,
      type: type ? type.value : notification.type.toLowerCase(),
      message,
    };

    try {
      const response = await api.put(
        `/notification/${notification.id}`,
        updatedNotification
      );
      onUpdateNotification(response.data.data);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Notification Updated",
        text: "The notification has been updated successfully.",
      });

      onClose(); // Close the modal
    } catch (err) {
      console.error("Error updating notification:", err);
      setError(err.response ? err.response.data.message : err.message);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Failed to Update Notification",
        text: "There was an error updating the notification. Please try again.",
      });
    } finally {
      setLoading(false);
    }

    window.location.reload();
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-3/4 lg:w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Edit Notification</p>
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
              {loading ? "Loading..." : "Update Notification"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditNotificationModal;
