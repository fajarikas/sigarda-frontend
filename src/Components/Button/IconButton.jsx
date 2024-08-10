import React from "react";

const IconButton = ({ onClick, color, text }) => {
  return (
    <button
      onClick={onClick}
      className={`${color} shadow-2xl px-6 py-3  text-xl rounded text-white font-base`}
    >
      {text}
    </button>
  );
};

export default IconButton;
