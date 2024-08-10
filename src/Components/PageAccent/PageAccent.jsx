import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Accent from "../../assets/images/accent.svg";

const PageAccent = () => {
  return (
    <div className="h-full z-0 ">
      <img
        src={Accent}
        alt="accent"
        className="absolute w-1/4 -top-20 right-0 blur-xl"
      />

      <img
        src={Accent}
        alt="accent"
        className="absolute w-1/4 bottom-5 left-0 blur-xl"
      />
    </div>
  );
};

export default PageAccent;
