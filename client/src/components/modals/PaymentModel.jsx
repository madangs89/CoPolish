import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { setCredits } from "../../redux/slice/authSlice";
import { setIsPaymentModelOpen } from "../../redux/slice/paymentSlice";

const PaymentModel = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [payCredits, setPayCredits] = useState(10);
  const CREDIT_PRICE = import.meta.env.VITE_CREDIT_PRICE || 15;
  const totalCredits = useSelector(
    (state) => state.auth.user?.totalCredits || 0,
  );

  const userDetails = useSelector((state) => state.auth.user);
  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_ID;
  const dispatch = useDispatch();

  const plans = [
    {
      id: "standard",
      title: "Standard",
      subtitle: "Best for regular users",
      credits: "100 Credits",
      credit: 100,
      price: "₹1500",
      features: ["Save upto 10%", "Valid for 6 months", "Instant activation"],
    },
    {
      id: "pro",
      title: "Pro",
      subtitle: "For power users",
      credits: "250 Credits",
      credit: 250,
      price: "₹3750",
      popular: true,
      features: ["Save upto 15%", "Valid for 12 months", "Priority support"],
    },
  ];

  const handlePayment = async (credits) => {
    if (!credits) return;
    try {
      // 2️⃣ Create order from backend
      const { data: order } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/v1/create-payment`,
        { credits: credits, currency: "INR" },
        { withCredentials: true },
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
            console.log(response);

            const paymentDetails = await axios.post(
              `${
                import.meta.env.VITE_BACKEND_URL
              }/api/payment/v1/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                // amount:
              },
              { withCredentials: true },
            );

            if (paymentDetails?.data) {
              toast.success("Payment successful");
              dispatch(
                setCredits(totalCredits + (paymentDetails?.data?.credits || 0)),
              );

              dispatch(setIsPaymentModelOpen(false));
            }
          } catch (err) {
            console.log(err);
            alert("Verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            toast.error("Payment popup closed");
          },
        },

        prefill: {
          name: userDetails?.userName || "",
          email: userDetails?.email || "",
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

  return (
    <div className="fixed inset-0 z-[999999999999999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full relative max-w-6xl bg-white rounded-xl shadow-2xl p-6 md:p-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Choose a Credits Plan</h1>

          <span className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
            1 Credit = ₹15
          </span>
        </div>

        <button
          className="absolute top-4 cursor-pointer  right-3"
          onClick={() => dispatch(setIsPaymentModelOpen(false))}
        >
          X
        </button>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          <div
            onClick={() => setSelectedPlan("pay")}
            className={`flex flex-col justify-between border rounded-xl p-6 transition cursor-pointer

            ${
              selectedPlan === "pay"
                ? "border-black shadow-xl"
                : "border-gray-200"
            }

            hover:shadow-lg
            `}
          >
            <div>
              <h2 className="text-xl font-semibold">Pay As You Go</h2>

              <p className="text-gray-500 text-sm mb-6">
                Pay only when you need
              </p>

              {/* Credit Input */}
              <div className="mb-4">
                <label className="text-sm text-gray-500">Enter Credits</label>

                <input
                  type="number"
                  min={1}
                  value={payCredits}
                  onChange={(e) => setPayCredits(Number(e.target.value))}
                  className="w-full mt-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Price Calculation */}
              <div className="text-xl font-bold mb-4">
                ₹{payCredits * CREDIT_PRICE}
              </div>

              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>✓ No commitment</li>
                <li>✓ Buy anytime</li>
                <li>✓ Use immediately</li>
              </ul>
            </div>

            <button
              onClick={() => handlePayment(payCredits)}
              className="w-full py-2 rounded-full border border-gray-300 font-medium"
            >
              Buy Credits
            </button>
          </div>
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative flex flex-col justify-between border rounded-xl p-6 transition cursor-pointer

              ${
                selectedPlan === plan.id
                  ? "border-black shadow-xl"
                  : "border-gray-200"
              }

              hover:shadow-lg
              `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold">{plan.title}</h2>
                <p className="text-gray-500 text-sm mb-6">{plan.subtitle}</p>

                <h3 className="text-2xl font-bold">{plan.credits}</h3>
                <p className="text-lg font-medium mb-6">{plan.price}</p>

                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i}>✓ {f}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handlePayment(plan.credit)}
                className={`w-full py-2 rounded-full border font-medium

                ${
                  plan.popular
                    ? "bg-black text-white border-black"
                    : "border-gray-300"
                }
                `}
              >
                Buy Credits
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-center gap-8 text-sm text-gray-600 text-center">
          <div>
            🔒 <span className="font-medium">Secure Payments</span>
            <p className="text-xs">100% safe & encrypted</p>
          </div>

          <div>
            ⏱ <span className="font-medium">Credits Never Expire</span>
            <p className="text-xs">Use anytime</p>
          </div>

          <div>
            🎧 <span className="font-medium">Need Help?</span>
            <p className="text-xs">Contact support anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModel;
