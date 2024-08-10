import React from "react";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";

const ShowScheduleModal = ({ schedule, onClose }) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-3/4 lg:w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Schedule Details</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>
        <div className="mt-5">
          <p className="font-medium">Name:</p>
          <p>{schedule.name}</p>
        </div>
        <div className="mt-3">
          <p className="font-medium">Date:</p>
          <p>{schedule.date}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowScheduleModal;
