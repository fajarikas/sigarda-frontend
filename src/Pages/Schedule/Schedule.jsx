import React, { useEffect, useState } from "react";
import api from "../../API/api";
import Title from "../../Components/Title/Title";
import Search from "../../Components/Search/Search";
import IconButton from "../../Components/Button/IconButton";
import { IoAddOutline } from "react-icons/io5";
import PrimaryButton from "../../Components/Button/PrimaryButton";
import { MdEdit, MdDelete } from "react-icons/md";
import { BiSolidShow } from "react-icons/bi";
import Swal from "sweetalert2";
import AddScheduleModal from "../../Components/Modal/Schedule/AddScheduleModal";
import EditScheduleModal from "../../Components/Modal/Schedule/EditScheduleModal";
import ShowScheduleModal from "../../Components/Modal/Schedule/ShowScheduleModal";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get("/schedule");
        setSchedules(response.data.data);
        setFilteredSchedules(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = schedules.filter((schedule) =>
      schedule.name.toLowerCase().includes(value)
    );
    setFilteredSchedules(filtered);
    setCurrentPage(1);
  };

  const handleAddSchedule = (newSchedule) => {
    const updatedSchedules = [...schedules, newSchedule];
    setSchedules(updatedSchedules);
    setFilteredSchedules(updatedSchedules);
  };

  const handleEditSchedule = (id, updatedSchedule) => {
    const updatedSchedules = schedules.map((sch) =>
      sch.id === id ? updatedSchedule : sch
    );
    setSchedules(updatedSchedules);
    setFilteredSchedules(updatedSchedules);
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/schedule/${id}`);
      if (response.status === 200) {
        Swal.fire("Deleted!", "Schedule has been deleted.", "success");
        const updatedSchedules = schedules.filter(
          (schedule) => schedule.id !== id
        );
        setSchedules(updatedSchedules);
        setFilteredSchedules(updatedSchedules);
      } else {
        Swal.fire("Error", "Error deleting schedule", "error");
      }
    } catch (err) {
      console.error("Error deleting schedule:", err);
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

  const handleEditClick = (schedule) => {
    setCurrentSchedule(schedule);
    setShowEditModal(true);
  };

  const handleShowClick = (schedule) => {
    setCurrentSchedule(schedule);
    setShowDetailModal(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSchedules.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
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
            onClick={() => paginate(currentPage - 1)}
            className="px-3 py-1 rounded bg-gray-300"
          >
            <IoMdSkipBackward />
          </button>
        )}
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 rounded ${
              currentPage === number ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {number}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => paginate(currentPage + 1)}
            className="px-3 py-1 rounded bg-gray-300"
          >
            <IoMdSkipForward />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="lg:space-x-0 space-x-5 z-30 w-10/12 h-screen lg:h-fit">
      <Title text="Schedules" />

      <div className="mt-7 items-center w-full flex justify-between">
        <Search
          placeholder="Search schedule here"
          value={searchTerm}
          onChange={handleSearch}
        />
        <IconButton
          text={<IoAddOutline />}
          color="bg-[#9079E9]"
          onClick={() => setShowAddModal(true)}
        />
      </div>

      <div className="bg-white px-10 py-2 mt-7 shadow-xl rounded-xl overflow-x-auto">
        <table className="w-full min-w-max lg:table-fixed">
          <thead className="border-b mb-5">
            <tr>
              <th className="py-3 text-left ">Name</th>
              <th className="py-3 text-center">Date</th>
              <th className="py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="space-y-4">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-3">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center py-3">
                  Error loading data
                </td>
              </tr>
            ) : (
              currentItems.map((schedule, index) => (
                <tr key={index} className="[1px] border-[#E1E1E1] border-b">
                  <td className="py-3 text-left">{schedule.name}</td>
                  <td className="py-3 text-center">
                    {formattedDate(schedule.date)}
                  </td>
                  <td className="py-3 flex justify-center space-x-2">
                    <PrimaryButton
                      text={<BiSolidShow />}
                      color="bg-blue-600"
                      onClick={() => handleShowClick(schedule)}
                    />
                    <PrimaryButton
                      text={<MdEdit />}
                      color="bg-green-600"
                      onClick={() => handleEditClick(schedule)}
                    />
                    <PrimaryButton
                      text={<MdDelete />}
                      color="bg-red-600"
                      onClick={() => confirmDelete(schedule.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="my-2 flex justify-left">{renderPagination()}</div>
      </div>

      {showAddModal && (
        <AddScheduleModal
          onClose={() => setShowAddModal(false)}
          onAddSchedule={handleAddSchedule}
        />
      )}

      {showEditModal && currentSchedule && (
        <EditScheduleModal
          schedule={currentSchedule}
          onClose={() => setShowEditModal(false)}
          onEditSchedule={handleEditSchedule}
        />
      )}

      {showDetailModal && currentSchedule && (
        <ShowScheduleModal
          schedule={currentSchedule}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default Schedule;
