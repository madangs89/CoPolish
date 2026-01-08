import { Check } from "lucide-react";

export function ProgressItem({ title, description, completed}) {
  return (
    <div className="flex gap-4 mt-6">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center
          ${completed ? "bg-green-500" : "bg-gray-300"}`}
      >
        <Check className="text-white" size={20} />
      </div>

      <div>
        <h3
          className={`text-lg font-semibold ${
            completed ? "text-green-600" : "text-gray-500"
          }`}
        >
          {title}
        </h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
