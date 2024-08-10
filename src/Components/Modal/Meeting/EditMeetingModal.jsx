import React, { useState, useEffect } from "react";
import api from "../../../API/api";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";
import Select from "react-select";
import Swal from "sweetalert2";

const EditMeetingModal = ({ meeting, onClose, onUpdateMeeting }) => {
  const [projectOptions, setProjectOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState(null);
  const [place, setPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/project");
        const projectData = response.data.data.map((project) => ({
          value: project.id,
          label: project.name,
        }));
        setProjectOptions(projectData);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

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

    fetchProjects();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (meeting) {
      setSelectedProject({
        value: meeting.project_id,
        label: meeting.project,
      });
      setSelectedUser({
        value: meeting.user_id,
        label: meeting.user,
      });
      setDescription(meeting.description);

      const formattedDate = meeting.date ? meeting.date.split(" ")[0] : "";
      setDate(formattedDate);

      setType({
        value: meeting.type.toLowerCase(),
        label: meeting.type.charAt(0).toUpperCase() + meeting.type.slice(1),
      });
      setPlace(meeting.place);
    }
  }, [meeting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const updatedMeeting = {
      project_id: selectedProject ? selectedProject.value : meeting.project_id,
      user_id: selectedUser ? selectedUser.value : meeting.user_id,
      description,
      date,
      type: type ? type.value : meeting.type.toLowerCase(),
      place,
    };

    console.log("Updated Meeting Data:", updatedMeeting);

    try {
      const response = await api.put(`/meeting/${meeting.id}`, updatedMeeting);
      onUpdateMeeting(response.data.data);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Meeting Updated",
        text: "The meeting has been updated successfully.",
      });

      onClose(); // Close the modal
      window.location.reload();
    } catch (err) {
      console.error("Error updating meeting:", err);
      setError(err.response ? err.response.data.message : err.message);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Failed to Update Meeting",
        text: "There was an error updating the meeting. Please try again.",
      });
    } finally {
      setLoading(false);
    }

    // Removed window.location.reload() to avoid unnecessary page reloads
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Edit Meeting</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <label className="font-medium">Project</label>
            <Select
              options={projectOptions}
              value={selectedProject}
              onChange={setSelectedProject}
              placeholder="Select a project"
              isClearable
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
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Description</label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
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
          <div className="mt-3">
            <label className="font-medium">Type</label>
            <Select
              options={[
                { value: "online", label: "Online" },
                { value: "offline", label: "Offline" },
              ]}
              value={type}
              onChange={setType}
              placeholder="Select a type"
              isClearable
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Place</label>
            <input
              onChange={(e) => setPlace(e.target.value)}
              value={place}
              type="text"
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
              {loading ? "Loading..." : "Update Meeting"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditMeetingModal;
