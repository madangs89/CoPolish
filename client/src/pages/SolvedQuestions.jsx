import React, { useEffect, useState } from "react";
import axios from "axios";

const SolvedQuestions = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/progress/v1/solved/questions`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setQuestions(res.data.questions);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center pt-20 pb-24">
      <div className="w-full max-w-5xl bg-white border rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Solved Questions</h1>

        <div className="divide-y">
          {questions.map((q, i) => (
            <div key={i} className="flex justify-between py-4">
              <span className="font-medium">{q.title}</span>

              <span className="text-gray-500">{q.subject}</span>

              <span
                className={`text-xs px-2 py-1 rounded ${
                  q.difficulty === "Easy"
                    ? "bg-green-100 text-green-700"
                    : q.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {q.difficulty}
              </span>

              <span className="text-gray-400 text-sm">
                {new Date(q.solvedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>

        {questions.length === 0 && (
          <p className="text-gray-400 text-center py-6">
            No solved questions yet
          </p>
        )}
      </div>
    </div>
  );
};

export default SolvedQuestions;