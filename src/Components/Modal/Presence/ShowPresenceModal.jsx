import React from "react";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";

const ShowPresenceModal = ({ presence, onClose }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Presence Details</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>
        <div className="mt-5">
          <p className="font-medium">User ID:</p>
          <p>{presence.user_id}</p>
        </div>
        <div className="mt-3">
          <p className="font-medium">Check In:</p>
          <p>{presence.check_in}</p>
        </div>
        <div className="mt-3">
          <p className="font-medium">Check Out:</p>
          <p>{presence.check_out}</p>
        </div>
        <div className="mt-3">
          <p className="font-medium">Date:</p>
          <p>{formatDate(presence.created_at)}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowPresenceModal;
