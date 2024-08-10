import React from "react";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";

const ShowScheduledUserModal = ({ scheduledUser, onClose }) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Scheduled User Details</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>
        <div className="mt-5">
          <p className="font-medium">Schedule :</p>
          <p>{scheduledUser.schedule}</p>
          <p className="font-medium mt-3">User ID :</p>
          <p>{scheduledUser.user}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowScheduledUserModal;
