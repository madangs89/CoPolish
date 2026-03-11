import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/v1/history`,
          { withCredentials: true },
        );

        if (res.data.success) {
          setPayments(res.data.payments);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center pt-20 pb-24">
      <div className="w-full max-w-5xl bg-white border rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Payment History</h1>

        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Payment ID</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p, i) => (
              <tr key={i} className="border-b">
                <td className="p-3">{p.amount}</td>

                <td className="p-3 text-gray-500">{p.razorpayPaymentId}</td>

                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      p.status === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="p-3 text-gray-400">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <p className="text-gray-400 text-center py-6">
            No payment history found
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
