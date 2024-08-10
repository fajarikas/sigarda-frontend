import React, { useEffect, useState } from "react";
import api from "../../API/api";
import Title from "../../Components/Title/Title";
import Search from "../../Components/Search/Search";
import { MdDelete, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import PrimaryButton from "../../Components/Button/PrimaryButton";
import IconButton from "../../Components/Button/IconButton";
import { IoAddOutline } from "react-icons/io5";
import EditShiftChangeModal from "../../Components/Modal/ShiftChange/EditShifChangeModal";
import AddShiftChangeModal from "../../Components/Modal/ShiftChange/AddShiftChangeModal";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";

const ShiftChange = () => {
  const [shiftChanges, setShiftChanges] = useState([]);
  const [filteredShiftChanges, setFilteredShiftChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentShiftChange, setCurrentShiftChange] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const shiftChangesPerPage = 5;
  const indexOfLastShiftChange = currentPage * shiftChangesPerPage;
  const indexOfFirstShiftChange = indexOfLastShiftChange - shiftChangesPerPage;
  const currentShiftChanges = filteredShiftChanges.slice(
    indexOfFirstShiftChange,
    indexOfLastShiftChange
  );
  const totalPages = Math.ceil(
    filteredShiftChanges.length / shiftChangesPerPage
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/shift-change");
        setShiftChanges(response.data.data);
        setFilteredShiftChanges(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchItem(value);

    const filtered = shiftChanges.filter(
      (change) =>
        change.name.toLowerCase().includes(value) ||
        change.shift.toLowerCase().includes(value) ||
        change.status.toLowerCase().includes(value)
    );

    setFilteredShiftChanges(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/shift-change/${id}`);
      if (response.status === 200) {
        Swal.fire("Deleted!", "The shift change has been deleted.", "success");
        setShiftChanges((prev) => prev.filter((item) => item.id !== id));
        setFilteredShiftChanges((prev) =>
          prev.filter((item) => item.id !== id)
        );
      } else {
        Swal.fire("Error", "Error deleting shift change", "error");
      }
    } catch (err) {
      console.error("Error deleting shift change:", err);
      setError("Failed to delete shift change.");
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

  const handleAddShiftChange = (newShiftChange) => {
    setShiftChanges([...shiftChanges, newShiftChange]);
    setFilteredShiftChanges([...shiftChanges, newShiftChange]);
  };

  const handleUpdateShiftChange = (updatedShiftChange) => {
    setShiftChanges((prevChanges) =>
      prevChanges.map((change) =>
        change.id === updatedShiftChange.id ? updatedShiftChange : change
      )
    );
    setFilteredShiftChanges((prevChanges) =>
      prevChanges.map((change) =>
        change.id === updatedShiftChange.id ? updatedShiftChange : change
      )
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSkip = (direction) => {
    const skipPages = 5;
    if (direction === "next") {
      setCurrentPage((prev) => Math.min(prev + skipPages, totalPages));
    } else if (direction === "prev") {
      setCurrentPage((prev) => Math.max(prev - skipPages, 1));
    }
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
            onClick={() => handlePageChange(number)}
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
    <div className="z-30 w-10/12 h-screen lg:space-x-0 space-x-5 lg:h-fit">
      <Title text="Shift Changes" />

      <div className="mt-7 items-center w-full flex justify-between">
        <Search
          placeholder="Search shift changes here"
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
              <th className="py-3 text-left w-1/6">Name</th>
              <th className="py-3 text-center w-1/6">Shift</th>
              <th className="py-3 text-center w-1/6">Status</th>
              <th className="py-3 text-center w-1/6">Action</th>
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
              currentShiftChanges.map((change) => (
                <tr key={change.id} className="[1px] border-[#E1E1E1] border-b">
                  <td className="py-3 text-left">{change.name || "N/A"}</td>
                  <td className="py-3 text-center">{change.shift || "N/A"}</td>
                  <td className="py-3 text-center">{change.status || "N/A"}</td>
                  <td className="py-3 flex justify-center space-x-2">
                    <PrimaryButton
                      text={<MdEdit />}
                      color="bg-blue-600"
                      onClick={() => {
                        setCurrentShiftChange(change);
                        setShowEditModal(true);
                      }}
                    />
                    <PrimaryButton
                      text={<MdDelete />}
                      color="bg-red-600"
                      onClick={() => confirmDelete(change.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="py-5 flex justify-start">{renderPagination()}</div>
      </div>

      {showAddModal && (
        <AddShiftChangeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddShiftChange}
        />
      )}

      {showEditModal && currentShiftChange && (
        <EditShiftChangeModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          shiftChange={currentShiftChange}
          onUpdate={handleUpdateShiftChange}
        />
      )}
    </div>
  );
};

export default ShiftChange;
