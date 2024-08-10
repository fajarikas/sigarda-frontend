import React, { useState, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";

const EditLocationModal = ({ location, onClose, onEditLocation }) => {
  const [officeName, setOfficeName] = useState(location.office_name);
  const [latitude, setLatitude] = useState(location.latitude);
  const [longitude, setLongitude] = useState(location.longitude);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location) {
      setOfficeName(location.office_name);
      setLatitude(location.latitude);
      setLongitude(location.longitude);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedLocation = {
        office_name: officeName,
        latitude,
        longitude,
      };

      await onEditLocation(location.id, updatedLocation);
      onClose();
    } catch (err) {
      console.error("Error editing location:", err);
      setError(err.message);
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
          <p className="font-semibold text-lg">Edit Location</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <label className="font-medium">Office Name</label>
            <input
              onChange={(e) => setOfficeName(e.target.value)}
              value={officeName}
              type="text"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Latitude</label>
            <input
              onChange={(e) => setLatitude(e.target.value)}
              value={latitude}
              type="number"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Longitude</label>
            <input
              onChange={(e) => setLongitude(e.target.value)}
              value={longitude}
              type="number"
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
              {loading ? "Loading..." : "Update Location"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditLocationModal;
