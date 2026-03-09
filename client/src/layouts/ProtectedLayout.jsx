import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import MainNavbar from "../components/Navbars/MainNavbar";
import { useEffect, useRef, useState } from "react";
import PaymentModel from "../components/modals/PaymentModel";

const ProtectedLayout = () => {
  const auth = useSelector((state) => state.auth.isAuth);

  const paymentSlice = useSelector((state) => state.payment);

  const containerRef = useRef(null);

  if (!auth) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-full  relative overflow-hidden"
    >
      <MainNavbar />
      <div className="">
        <Outlet />
      </div>

      {paymentSlice.isPaymentModelOpen && <PaymentModel />}
    </div>
  );
};

export default ProtectedLayout;
