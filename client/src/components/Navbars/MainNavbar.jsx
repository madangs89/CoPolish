import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useLocation } from "react-router-dom";
import axios from "axios";

const MainNavbar = () => {
  const location = useLocation();
  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_ID;

  const handlePayment = async () => {
    try {
      // 2️⃣ Create order from backend
      const { data: order } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/v1/create-payment`,
        { credits: 10 },
        { withCredentials: true }
      );

      // 3️⃣ Razorpay options
      const options = {
        key: order.key || RAZORPAY_KEY_ID, // prefer backend key
        amount: order.amount,
        currency: order.currency,
        name: "CoPolish",
        description: "Credit purchase",
        order_id: order.orderId,

        handler: async function (response) {
          try {
            await axios.post(
              `${
                import.meta.env.VITE_BACKEND_URL
              }/api/payment/v1/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            alert("Payment successful 🎉");
          } catch (err) {
            console.log(err);
            alert("Verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            console.log("Payment popup closed");
            alert("Payment cancelled");
          },
        },

        prefill: {
          name: "John Doe",
          email: "john@example.com",
       
        },

        theme: {
          color: "#111827",
        },
      };

      // 4️⃣ Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert(err.message || "Payment failed");
    }
  };


  useEffect(() => {
    gsap.fromTo(
      ".sc",
      { backgroundColor: "transparent", opacity: 0 },
      {
        backgroundColor: "white",
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      }
    );
  }, [location]);

  if (location.pathname.includes("editor/resume")) return null;

  return (
    <div className="fixed sc top-0 left-0 w-full z-[99999]">
      <div className="w-full mx-auto px-6 py-3 flex items-center justify-between">
        <h1 className="text-black text-[22px] font-medium">CoPolish</h1>

        {!location.pathname.includes("onboarding") &&
          !location.pathname.includes("approve") && (
            <div className="hidden md:flex gap-7 items-center">
              <span className="text-[14px] hover:underline cursor-pointer">
                Resume
              </span>
              <span className="text-[14px] hover:underline cursor-pointer">
                LinkedIn
              </span>
              <span className="text-[14px] hover:underline cursor-pointer">
                Post
              </span>
              <span className="text-[14px] hover:underline cursor-pointer">
                ATS Match
              </span>
            </div>
          )}

        <div className="flex gap-2">
          <button
            onClick={handlePayment}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[14px] 
              bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition"
          >
            <span className="font-medium">Credits</span>
            <span className="px-2 py-[2px] rounded-full text-[12px] bg-yellow-600 text-white">
              52
            </span>
          </button>

          <button className="bg-black text-white text-[14px] px-5 py-2 rounded-full">
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;
