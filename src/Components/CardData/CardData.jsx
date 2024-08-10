import React from "react";

const CardData = ({ icon, data, text }) => {
  return (
    <div className="flex items-center gap-x-4">
      <div className="bg-white rounded-md p-4 text-3xl shadow-xl text-[#9079E9]">
        {icon}
      </div>
      <div className="block space-y-1">
        <p className="text-[#BDBDBD]">{text}</p>
        <h1 className="text-3xl font-semibold">{data}</h1>
      </div>
    </div>
  );
};

export default CardData;
