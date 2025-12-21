import React from "react";

const ButtonLoader = ({ size = 18, color = "#ffffff" }) => {
  return (
    <div className="flex z-[1000] items-center justify-center">
      {" "}
      <div
        className={`w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default ButtonLoader;
