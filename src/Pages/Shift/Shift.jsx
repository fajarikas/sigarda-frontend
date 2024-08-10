import React, { useEffect, useState } from "react";
import api from "../../API/api";
import Title from "../../Components/Title/Title";
import Search from "../../Components/Search/Search";
import IconButton from "../../Components/Button/IconButton";
import { IoAddOutline } from "react-icons/io5";
import PrimaryButton from "../../Components/Button/PrimaryButton";
import { MdDelete, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import AddShiftModal from "../../Components/Modal/Shift/AddShiftModal";
import EditShiftModal from "../../Components/Modal/Shift/EditShiftModal";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";

const Shift = () => {
  const [shifts, setShifts] = useState([]);
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const shiftsPerPage = 5;
  const [searchItem, setSearchItem] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentShift, setCurrentShift] = useState(null);

  const indexOfLastShift = currentPage * shiftsPerPage;
  const indexOfFirstShift = indexOfLastShift - shiftsPerPage;
  const currentShifts = filteredShifts.slice(
    indexOfFirstShift,
    indexOfLastShift
  );

  const totalPages = Math.ceil(filteredShifts.length / shiftsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/shift");
        console.log("Data fetched:", response.data.data); // Debugging line
        setShifts(response.data.data);
        setFilteredShifts(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/shift/${id}`);
      if (response.status === 200) {
        Swal.fire("Deleted!", "Your shift has been deleted.", "success");
        setShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== id)
        );
        setFilteredShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== id)
        );
      } else {
        Swal.fire("Error", "Error deleting shift", "error");
      }
    } catch (err) {
      console.error("Error deleting shift:", err);
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

    const filtered = shifts.filter((shift) =>
      shift.name.toLowerCase().includes(value)
    );

    setFilteredShifts(filtered);
    setCurrentPage(1);
  };

  const handleEditClick = (shift) => {
    setCurrentShift(shift);
    setShowEditModal(true);
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
    <div className="space-x-5 z-30 w-10/12 h-screen">
      <Title text="Shifts" />

      <div className="mt-7 items-center w-full flex justify-between">
        <Search
          placeholder="Search shifts here"
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
        <table className="w-full min-w-max lg:table-fixed">
          <thead className="border-b mb-5">
            <tr>
              <th className="py-3 text-left w-1/4">Name</th>
              <th className="py-3 text-center w-1/4">Start Time</th>
              <th className="py-3 text-center w-1/4">End Time</th>
              <th className="py-3 text-center w-1/4">Actions</th>
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
            ) : currentShifts.length > 0 ? (
              currentShifts.map((shift) => (
                <tr key={shift.id} className="[1px] border-[#E1E1E1] border-b">
                  <td className="py-3 text-left">{shift.name}</td>
                  <td className="py-3 text-center">{shift.start}</td>
                  <td className="py-3 text-center">{shift.end}</td>
                  <td className="py-3 flex justify-center space-x-2">
                    <PrimaryButton
                      text={<MdEdit />}
                      color="bg-green-600"
                      onClick={() => handleEditClick(shift)}
                    />
                    <PrimaryButton
                      text={<MdDelete />}
                      color="bg-red-600"
                      onClick={() => confirmDelete(shift.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-3">
                  No shifts available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="py-5 flex justify-start">{renderPagination()}</div>
      </div>

      {showAddModal && (
        <AddShiftModal
          onClose={() => setShowAddModal(false)}
          onAddShift={(newShift) => {
            setShifts([...shifts, newShift]);
            setFilteredShifts([...shifts, newShift]);
          }}
        />
      )}

      {showEditModal && currentShift && (
        <EditShiftModal
          onClose={() => setShowEditModal(false)}
          onUpdateShift={(updatedShift) => {
            setShifts((prevShifts) =>
              prevShifts.map((shift) =>
                shift.id === updatedShift.id ? updatedShift : shift
              )
            );
            setFilteredShifts((prevShifts) =>
              prevShifts.map((shift) =>
                shift.id === updatedShift.id ? updatedShift : shift
              )
            );
          }}
          shift={currentShift}
        />
      )}
    </div>
  );
};

export default Shift;
