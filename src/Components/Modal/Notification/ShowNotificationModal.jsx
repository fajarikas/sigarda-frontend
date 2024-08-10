import React from "react";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";

const ShowNotificationModal = ({ notification, onClose }) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Notification Details</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>
        <div className="mt-5">
          <label className="font-medium">User:</label>
          <p className="mt-1">{notification.user}</p>
        </div>
        <div className="mt-3">
          <label className="font-medium">Type:</label>
          <p className="mt-1">{notification.type}</p>
        </div>
        <div className="mt-3">
          <label className="font-medium">Message:</label>
          <p className="mt-1">{notification.message}</p>
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

export default ShowNotificationModal;
