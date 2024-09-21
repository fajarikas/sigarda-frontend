import React, { useState, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import SmallIconButton from "../../Button/SmallIconButton";
import PrimaryButton from "../../Button/PrimaryButton";
import api from "../../../API/api";
import Swal from "sweetalert2";

const getNextDate = (currentDate) => {
  const date = new Date(currentDate);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
};

const ShowScheduleModal = ({ schedule, onClose }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [shift, setShift] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(null);

  const [addedSchedules, setAddedSchedules] = useState([]);
  const [nextDate, setNextDate] = useState(schedule.date);

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/schedule-detail/schedule/${schedule.id}`
        );
        if (response.status === 200 && Array.isArray(response.data.data)) {
          const details = response.data.data;
          setAddedSchedules(details);

          if (details.length > 0) {
            const lastDetail = details[details.length - 1];
            setNextDate(getNextDate(lastDetail.date));
          } else {
            setNextDate(schedule.date);
          }
        } else {
          setAddedSchedules([]);
          setNextDate(schedule.date);
        }
      } catch (error) {
        console.error("Error loading schedule details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleDetails();
  }, [schedule.id]);

  const handleShiftChange = (event) => {
    setShift(event.target.value);
  };

  const handleAddSchedule = async () => {
    if (!shift) {
      Swal.fire("Error", "Please select a shift", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/schedule-detail", {
        schedule_id: schedule.id,
        date: nextDate,
        shift: shift,
      });

      console.log("API Response Data:", response.data);
      if (
        response.status === 200 &&
        response.data &&
        response.data.data &&
        response.data.data.id
      ) {
        const newSchedule = {
          id: response.data.data.id,
          date: nextDate,
          shift: shift,
        };

        console.log("New Schedule added with ID:", newSchedule.id);

        setAddedSchedules((prevSchedules) => [...prevSchedules, newSchedule]);
        setNextDate(getNextDate(nextDate));

        Swal.fire(
          "Success",
          "Schedule has been added successfully!",
          "success"
        );
        setShift("");
        setShowAddForm(false);
      } else {
        console.error("Error: No ID found in the response");
        Swal.fire("Error", "Failed to add schedule. No ID returned.", "error");
      }
    } catch (error) {
      console.error("Error adding schedule:", error);
      Swal.fire(
        "Error",
        "An error occurred while adding the schedule",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      setLoading(true);
      const response = await api.delete(`/schedule-detail/${scheduleId}`);
      if (response.status === 200) {
        const updatedSchedules = addedSchedules.filter(
          (item) => item.id !== scheduleId
        );
        setAddedSchedules(updatedSchedules);
        Swal.fire("Deleted!", "The schedule has been deleted.", "success");

        if (updatedSchedules.length > 0) {
          const lastDetail = updatedSchedules[updatedSchedules.length - 1];
          setNextDate(getNextDate(lastDetail.date));
        } else {
          setNextDate(schedule.date);
        }
      } else {
        Swal.fire("Error", "Failed to delete schedule", "error");
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      Swal.fire(
        "Error",
        "An error occurred while deleting the schedule",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditSchedule = async (scheduleId) => {
    console.log("Editing schedule with ID:", scheduleId);

    if (!scheduleId || scheduleId === "undefined") {
      console.error("Schedule ID is undefined or invalid.");
      Swal.fire("Error", "Invalid schedule ID.", "error");
      return;
    }

    if (!shift) {
      Swal.fire("Error", "Please select a shift", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(`/schedule-detail/${scheduleId}`, {
        shift: shift,
      });

      if (response.status === 200) {
        const updatedSchedules = addedSchedules.map((item) =>
          item.id === scheduleId ? { ...item, shift: shift } : item
        );
        setAddedSchedules(updatedSchedules);
        setEditMode(null);
        Swal.fire("Success", "Shift has been updated successfully!", "success");
      } else {
        Swal.fire("Error", "Failed to update shift", "error");
      }
    } catch (error) {
      console.error("Error editing shift:", error);
      Swal.fire("Error", "An error occurred while updating the shift", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />

      <div className="fixed inset-0 z-50 w-3/4 lg:w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Schedule Details</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>

        <div className="mt-5">
          <p className="font-medium">Name:</p>
          <p>{schedule.name}</p>
        </div>
        <div className="mt-3">
          <p className="font-medium">Original Date:</p>
          <p>{schedule.date}</p>
        </div>

        {addedSchedules.length > 0 ? (
          <div className="mt-3">
            <p className="font-medium">Added Schedules:</p>
            <ul className="list-disc ml-5">
              {addedSchedules.map((item, index) => (
                <li key={item.id} className="flex items-center space-x-4">
                  {editMode === item.id ? (
                    <div className="flex space-x-2">
                      <select
                        className="border border-gray-300 rounded p-2"
                        value={shift}
                        onChange={handleShiftChange}
                      >
                        <option value="">Pilih Shift</option>
                        <option value="Libur">Libur</option>
                        <option value="Pagi">Pagi</option>
                        <option value="Siang">Siang</option>
                        <option value="Fulltime">Fulltime</option>
                      </select>
                      <PrimaryButton
                        text="Save"
                        color="bg-green-600"
                        onClick={() => handleEditSchedule(item.id)}
                      />
                      <SmallIconButton
                        color="bg-gray-500"
                        onClick={() => setEditMode(null)}
                        text="Cancel"
                      />
                    </div>
                  ) : (
                    <>
                      <span>
                        {item.date} - Shift: {item.shift}
                      </span>
                      <SmallIconButton
                        color="bg-blue-600"
                        onClick={() => {
                          console.log("Item ID before editing:", item.id);
                          setEditMode(item.id);
                          setShift(item.shift);
                        }}
                        text={<FiEdit />}
                      />
                      {index === addedSchedules.length - 1 && (
                        <SmallIconButton
                          color="bg-red-600"
                          onClick={() => handleDeleteSchedule(item.id)}
                          text={<FiTrash2 />}
                        />
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-5 text-gray-500">No schedules added yet.</p>
        )}

        {!showAddForm && (
          <div className="mt-5">
            <PrimaryButton
              text="Tambah Jadwal"
              color="bg-blue-600"
              onClick={() => setShowAddForm(true)}
            />
          </div>
        )}

        {showAddForm && (
          <div className="mt-5">
            <div className="mb-3">
              <label className="block font-medium mb-1">Tanggal</label>
              <p>{nextDate}</p>
            </div>
            <div className="mb-5">
              <label className="block font-medium mb-1">Shift</label>
              <select
                className="border border-gray-300 rounded p-2 w-full"
                value={shift}
                onChange={handleShiftChange}
              >
                <option value="">Pilih Shift</option>
                <option value="Libur">Libur</option>
                <option value="Pagi">Pagi</option>
                <option value="Siang">Siang</option>
                <option value="Fulltime">Fulltime</option>
              </select>
            </div>
            <div className="flex justify-end">
              <PrimaryButton
                text={loading ? "Loading..." : "Tambah Jadwal"}
                color="bg-green-600"
                onClick={handleAddSchedule}
                disabled={loading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowScheduleModal;
