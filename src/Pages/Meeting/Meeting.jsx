import React, { useEffect, useState } from "react";
import api from "../../API/api";
import Title from "../../Components/Title/Title";
import Search from "../../Components/Search/Search";
import IconButton from "../../Components/Button/IconButton";
import { IoAddOutline } from "react-icons/io5";
import PrimaryButton from "../../Components/Button/PrimaryButton";
import { GoDotFill } from "react-icons/go";
import { MdDelete, MdEdit } from "react-icons/md";
import { BiSolidShow } from "react-icons/bi";
import Swal from "sweetalert2";
import AddMeetingModal from "../../Components/Modal/Meeting/AddMeetingModal";
import EditMeetingModal from "../../Components/Modal/Meeting/EditMeetingModal";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import ShowMeetingModal from "../../Components/Modal/Meeting/ShowMeetingModal";

const Meeting = () => {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const meetingsPerPage = 5;
  const [searchItem, setSearchItem] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false); // State untuk modal detail
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null); // State untuk meeting yang dipilih untuk ditampilkan

  const indexOfLastMeeting = currentPage * meetingsPerPage;
  const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
  const currentMeetings = filteredMeetings.slice(
    indexOfFirstMeeting,
    indexOfLastMeeting
  );

  const totalPages = Math.ceil(filteredMeetings.length / meetingsPerPage);

  const handleClickPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSkip = (direction) => {
    const skipPages = 10;
    if (direction === "next") {
      const newPage = Math.min(currentPage + skipPages, totalPages);
      setCurrentPage(newPage);
    } else if (direction === "prev") {
      const newPage = Math.max(currentPage - skipPages, 1);
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/meeting");
        setMeetings(response.data.data);
        setFilteredMeetings(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/meeting/${id}`);
      if (response.status === 200) {
        Swal.fire("Deleted!", "Your meeting has been deleted.", "success");
        setMeetings((prevMeetings) =>
          prevMeetings.filter((meeting) => meeting.id !== id)
        );
        setFilteredMeetings((prevMeetings) =>
          prevMeetings.filter((meeting) => meeting.id !== id)
        );
      } else {
        Swal.fire("Error", "Error deleting meeting", "error");
      }
    } catch (err) {
      console.error("Error deleting meeting:", err);
      setError(err);
    }
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchItem(value);

    const filtered = meetings.filter((meeting) => {
      return (
        meeting.project.toLowerCase().includes(value) ||
        meeting.user.toLowerCase().includes(value) ||
        meeting.description.toLowerCase().includes(value) ||
        formattedDate(meeting.date).toLowerCase().includes(value) ||
        meeting.type.toLowerCase().includes(value) ||
        meeting.place.toLowerCase().includes(value)
      );
    });

    setFilteredMeetings(filtered);
    setCurrentPage(1);
  };

  const handleEditClick = (meeting) => {
    setCurrentMeeting(meeting);
    setShowEditModal(true);
  };

  const handleShowClick = (meeting) => {
    setSelectedMeeting(meeting);
    setShowDetailModal(true);
  };

  const renderPagination = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center space-x-2 mt-4">
        {currentPage > 1 && (
          <button
            onClick={() => handleSkip("prev")}
            className="px-3 py-1 rounded bg-gray-300"
          >
            <IoMdSkipBackward />
          </button>
        )}
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handleClickPage(number)}
            className={`px-3 py-1 rounded ${
              currentPage === number ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {number}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => handleSkip("next")}
            className="px-3 py-1 rounded bg-gray-300"
          >
            <IoMdSkipForward />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="lg:space-x-0 space-x-5 z-30 w-10/12 h-fit px-0 lg:pr-4 ">
      <Title text="Meeting" />

      <div className="mt-7 items-center w-full flex justify-between">
        <Search
          placeholder="Search meeting here"
          value={searchItem}
          onChange={handleSearch}
        />
        <IconButton
          text={<IoAddOutline />}
          color="bg-[#9079E9]"
          onClick={() => setShowAddModal(true)}
        />
      </div>

      <div className="bg-white px-10 py-2 mt-7 shadow-xl rounded-xl overflow-x-auto">
        {/* Added container for responsive table */}
        <table className="w-full min-w-max ">
          <thead className="border-b mb-5">
            <tr>
              <th className="py-3 text-left w-1/12">Project</th>
              <th className="py-3 text-center w-1/6">Participant</th>
              <th className="py-3 text-left w-1/6">Description</th>
              <th className="py-3 text-center w-1/6">Date</th>
              <th className="py-3 text-center w-1/12">Type</th>
              <th className="py-3 text-center w-1/6">Place</th>
              <th className="py-3 text-center w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody className="space-y-4">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-3">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="text-center py-3">
                  Error loading data
                </td>
              </tr>
            ) : (
              currentMeetings.map((meeting, index) => (
                <tr
                  key={index} // Changed key to index for simplicity
                  className="[1px] border-[#E1E1E1] border-b"
                >
                  <td className="py-3 text-left">{meeting.project}</td>
                  <td className="py-3 text-center">{meeting.user}</td>
                  <td className="py-3 text-left lg:w-1/12">
                    <p className="truncate" title={meeting.description}>
                      {meeting.description}
                    </p>
                  </td>
                  <td className="py-3 text-center">
                    {formattedDate(meeting.date)}
                  </td>
                  <td className="py-3 text-center">
                    <div
                      className={`flex items-center justify-center py-2 px-3 text-sm rounded-md shadow ${
                        meeting.type == "online" || meeting.type == "Online"
                          ? "bg-green-200 text-green-700 shadow-green-700"
                          : meeting.type == "offline" ||
                            meeting.type == "Offline"
                          ? "bg-blue-200 text-blue-700 shadow-blue-700"
                          : ""
                      }`}
                    >
                      <GoDotFill className="mr-1" />
                      {meeting.type == "online" || meeting.type == "Online"
                        ? (meeting.type = "Online")
                        : (meeting.type = "Offline")}
                    </div>
                  </td>
                  <td className="py-3 text-center">{meeting.place}</td>
                  <td className="py-3 flex justify-center space-x-2">
                    <PrimaryButton
                      text={<BiSolidShow />}
                      color="bg-blue-600"
                      onClick={() => handleShowClick(meeting)}
                    />
                    <PrimaryButton
                      text={<MdEdit />}
                      color="bg-green-600"
                      onClick={() => handleEditClick(meeting)}
                    />
                    <PrimaryButton
                      text={<MdDelete />}
                      color="bg-red-600"
                      onClick={() => confirmDelete(meeting.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* End of the responsive container */}
        <div className="py-5 flex justify-start">{renderPagination()}</div>
      </div>

      {showAddModal && (
        <AddMeetingModal
          onClose={() => setShowAddModal(false)}
          onAddMeeting={(newMeeting) => {
            setMeetings([...meetings, newMeeting]);
            setFilteredMeetings([...meetings, newMeeting]);
          }}
        />
      )}

      {showEditModal && currentMeeting && (
        <EditMeetingModal
          onClose={() => setShowEditModal(false)}
          onUpdateMeeting={(updatedMeeting) =>
            setMeetings((prevMeetings) =>
              prevMeetings.map((meeting) =>
                meeting.id === updatedMeeting.id ? updatedMeeting : meeting
              )
            ) &&
            setFilteredMeetings((prevMeetings) =>
              prevMeetings.map((meeting) =>
                meeting.id === updatedMeeting.id ? updatedMeeting : meeting
              )
            )
          }
          meeting={currentMeeting}
        />
      )}

      {showDetailModal && selectedMeeting && (
        <ShowMeetingModal
          onClose={() => setShowDetailModal(false)}
          meeting={selectedMeeting}
        />
      )}
    </div>
  );
};

export default Meeting;
