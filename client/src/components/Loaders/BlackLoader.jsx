import React from "react";

const BlackLoader = () => {
  return (
    <div className="flex z-[10000000] items-center justify-center">
      {" "}
      <div
        className={`w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default BlackLoader;
