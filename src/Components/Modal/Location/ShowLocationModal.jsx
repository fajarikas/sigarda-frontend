import React from "react";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";

const ShowLocationModal = ({ location, onClose }) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-3/4 lg:w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Location Details</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>
        <div className="mt-5">
          <p className="font-medium">Office Name:</p>
          <p>{location.office_name}</p>
        </div>
        <div className="mt-3">
          <p className="font-medium">Latitude:</p>
          <p>{location.latitude}</p>
        </div>
        <div className="mt-3">
          <p className="font-medium">Longitude:</p>
          <p>{location.longitude}</p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowLocationModal;
