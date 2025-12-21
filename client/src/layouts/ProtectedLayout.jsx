import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import MainNavbar from "../components/Navbars/MainNavbar";
import { useEffect, useRef, useState } from "react";

const ProtectedLayout = () => {
  const auth = useSelector((state) => state.auth.isAuth);

  const containerRef = useRef(null);
 
  if (!auth) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-full  relative overflow-y-auto"
    >
      <MainNavbar  />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
