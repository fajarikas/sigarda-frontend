import React from "react";

const SmallIconButton = ({ onClick, color, text }) => {
  return (
    <button
      onClick={onClick}
      className={`${color} shadow-2xl p-2 text-xl rounded  text-white font-base`}
    >
      {text}
    </button>
  );
};

export default SmallIconButton;
