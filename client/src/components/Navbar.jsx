import React from "react";

const Navbar = () => {
  return (
    <div className="max-w-5xl  z-[99999] mx-auto flex items-center justify-between">
      <h1 className="text-black text-[22px] ">CoPolish</h1>

      <div className="flex gap-7 items-center justify-center">
        <h1 className=" text-[14px] font-thin">Features</h1>
        <h1 className=" text-[14px] font-thin">How It Works</h1>
        <h1 className=" text-[14px] font-thin">Pricing</h1>
        <h1 className=" text-[14px] font-thin">FAQ</h1>
      </div>

      <button className="bg-black flex items-center justify-center text-[14px] px-4 py-1.5 rounded-full text-white">
        Login
      </button>
    </div>
  );
};

export default Navbar;
