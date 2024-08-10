import React from "react";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";

const ShowMeetingModal = ({ meeting, onClose }) => {
  if (!meeting) return null;

  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Meeting Details</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>
        <div className="mt-5 space">
          <label className="font-medium">Project</label>
          <p className="mt-1">{meeting.project}</p>
        </div>
        <div className="mt-3">
          <label className="font-medium ">Participant</label>
          <p className="mt-1">{meeting.user}</p>
        </div>
        <div className="mt-3">
          <label className="font-medium ">Description</label>
          <p className="mt-1">{meeting.description}</p>
        </div>
        <div className="mt-3">
          <label className="font-medium">Date</label>
          <p className="mt-1">{meeting.date}</p>
        </div>
        <div className="mt-3">
          <label className="font-medium ">Type</label>
          <p className="mt-1">{meeting.type}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowMeetingModal;
