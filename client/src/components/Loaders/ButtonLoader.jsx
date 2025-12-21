import React from "react";

const ButtonLoader = ({ size = 18, color = "black" }) => {
  return (
    <div className="flex z-[1000] items-center justify-center">
      {" "}
      <div
        className={`w-4 h-4 border-2 border-[${color}] border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default ButtonLoader;
