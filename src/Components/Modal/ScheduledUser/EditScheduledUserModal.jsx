import React, { useState, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";
import Swal from "sweetalert2";
import Select from "react-select";
import api from "../../../API/api";

const EditScheduledUserModal = ({
  scheduledUser,
  onClose,
  onEditScheduledUser,
}) => {
  const [scheduleOptions, setScheduleOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch schedule (project) and user options when component mounts
    const fetchSchedules = async () => {
      try {
        const response = await api.get("/schedule"); // Assuming your endpoint is /schedules
        const scheduleData = response.data.data.map((schedule) => ({
          value: schedule.id,
          label: schedule.name,
        }));
        setScheduleOptions(scheduleData);
      } catch (err) {
        console.error("Error fetching schedules:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await api.get("/user"); // Assuming your endpoint is /users
        const userData = response.data.data.map((user) => ({
          value: user.id,
          label: user.name,
        }));
        setUserOptions(userData);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchSchedules();
    fetchUsers();
  }, []);

  useEffect(() => {
    // Set the selected schedule and user based on the initial data
    if (scheduledUser) {
      setSelectedSchedule({
        value: scheduledUser.schedule_id,
        label: scheduledUser.schedule, // Assuming schedule_name is available
      });
      setSelectedUser({
        value: scheduledUser.user_id,
        label: scheduledUser.user, // Assuming user_name is available
      });
    }
  }, [scheduledUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedScheduledUser = {
        schedule_id: selectedSchedule.value,
        user_id: selectedUser.value,
      };

      const response = await api.put(
        `/scheduled/user/${scheduledUser.id}`,
        updatedScheduledUser
      );

      onEditScheduledUser(scheduledUser.id, response.data.data);
      Swal.fire("Success", "Scheduled User updated successfully", "success");
      onClose();
    } catch (err) {
      console.error("Error editing scheduled user:", err);
      setError(err.message);
      Swal.fire("Error", "Failed to update scheduled user", "error");
    } finally {
      setLoading(false);
    }

    window.location.reload();
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Assign User to Schedule</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <label className="font-medium">Schedule</label>
            <Select
              options={scheduleOptions}
              value={selectedSchedule}
              onChange={setSelectedSchedule}
              placeholder="Select a schedule"
              isClearable
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">User</label>
            <Select
              options={userOptions}
              value={selectedUser}
              onChange={setSelectedUser}
              placeholder="Select a user"
              isClearable
              required
              isDisabled={true}
            />
          </div>

          <div className="mt-5 flex justify-end">
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Assign User to Schedule"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditScheduledUserModal;
