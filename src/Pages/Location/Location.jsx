import React, { useEffect, useState } from "react";
import api from "../../API/api";
import Title from "../../Components/Title/Title";
import Search from "../../Components/Search/Search";
import IconButton from "../../Components/Button/IconButton";
import { IoAddOutline } from "react-icons/io5";
import PrimaryButton from "../../Components/Button/PrimaryButton";
import { MdEdit, MdDelete } from "react-icons/md";
import { BiSolidShow } from "react-icons/bi";
import { SiGooglemaps } from "react-icons/si"; // Import Google Maps icon
import Swal from "sweetalert2";
import AddLocationModal from "../../Components/Modal/Location/AddLocationModal";
import EditLocationModal from "../../Components/Modal/Location/EditLocationModal";
import ShowLocationModal from "../../Components/Modal/Location/ShowLocationModal";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const [searchTerm, setSearchTerm] = useState(""); // State for search
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/location");
        setLocations(response.data.data);
        setFilteredLocations(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Handle Search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = locations.filter((location) =>
      location.office_name.toLowerCase().includes(value)
    );
    setFilteredLocations(filtered);
    setCurrentPage(1); // Reset to first page after search
  };

  // Handle Add Location
  const handleAddLocation = async (newLocation) => {
    try {
      const response = await api.post("/location", newLocation);
      const updatedLocations = [...locations, response.data.data];
      setLocations(updatedLocations);
      setFilteredLocations(updatedLocations);
      Swal.fire("Success", "Location added successfully", "success");
    } catch (err) {
      console.error("Error adding location:", err);
      setError(err.message);
      Swal.fire("Error", "Failed to add location", "error");
    }
  };

  // Handle Edit Location
  const handleEditLocation = async (id, updatedLocation) => {
    try {
      const response = await api.put(`/location/${id}`, updatedLocation);
      const updatedLocations = locations.map((loc) =>
        loc.id === id ? response.data.data : loc
      );
      setLocations(updatedLocations);
      setFilteredLocations(updatedLocations);
      Swal.fire("Success", "Location updated successfully", "success");
    } catch (err) {
      console.error("Error editing location:", err);
      setError(err.message);
      Swal.fire("Error", "Failed to update location", "error");
    }
  };

  // Handle Delete Location
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/location/${id}`);
      if (response.status === 200) {
        Swal.fire("Deleted!", "Location has been deleted.", "success");
        const updatedLocations = locations.filter(
          (location) => location.id !== id
        );
        setLocations(updatedLocations);
        setFilteredLocations(updatedLocations);
      } else {
        Swal.fire("Error", "Error deleting location", "error");
      }
    } catch (err) {
      console.error("Error deleting location:", err);
      setError(err);
    }
  };

  // Confirm Delete Location
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

  // Handle Open Google Maps
  const handleOpenGoogleMaps = (lat, lng) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  // Handle Edit Click
  const handleEditClick = (location) => {
    setCurrentLocation(location);
    setShowEditModal(true);
  };

  // Handle Show Click
  const handleShowClick = (location) => {
    setCurrentLocation(location);
    setShowDetailModal(true);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLocations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render Pagination
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
    <div className="lg:space-x-0 space-x-5 z-30 w-10/12  h-screen">
      <Title text="Locations" />

      <div className="mt-7 items-center w-full flex justify-between">
        <Search
          placeholder="Search location here"
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
              <th className="py-3 text-left">Office Name</th>
              <th className="py-3 text-center">Latitude</th>
              <th className="py-3 text-center">Longitude</th>
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
              currentItems.map((location, index) => (
                <tr key={index} className="[1px] border-[#E1E1E1] border-b">
                  <td className="py-3 text-left">{location.office_name}</td>
                  <td className="py-3 text-center">{location.latitude}</td>
                  <td className="py-3 text-center">{location.longitude}</td>
                  <td className="py-3 flex justify-center space-x-2">
                    <PrimaryButton
                      text={<SiGooglemaps />}
                      color="bg-gray-600"
                      onClick={() =>
                        handleOpenGoogleMaps(
                          location.latitude,
                          location.longitude
                        )
                      }
                    />
                    <PrimaryButton
                      text={<BiSolidShow />}
                      color="bg-blue-600"
                      onClick={() => handleShowClick(location)}
                    />
                    <PrimaryButton
                      text={<MdEdit />}
                      color="bg-green-600"
                      onClick={() => handleEditClick(location)}
                    />
                    <PrimaryButton
                      text={<MdDelete />}
                      color="bg-red-600"
                      onClick={() => confirmDelete(location.id)}
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
        <AddLocationModal
          onClose={() => setShowAddModal(false)}
          onAddLocation={handleAddLocation}
        />
      )}

      {showEditModal && currentLocation && (
        <EditLocationModal
          location={currentLocation}
          onClose={() => setShowEditModal(false)}
          onEditLocation={handleEditLocation}
        />
      )}

      {showDetailModal && currentLocation && (
        <ShowLocationModal
          location={currentLocation}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default Location;
