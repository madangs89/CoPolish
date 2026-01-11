import React from "react";
import { Mail } from "lucide-react";
const DefaultResume = ({ data, settings }) => {
  const { fontSizes, primaryColor, textColor } = settings;

  return (
    <div
      style={{
        width: "794px",
        minHeight: "1123px",
        background: "#ffffff",
        padding: settings.margin,
        fontFamily: settings.fontFamily,
        color: textColor,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-2xl Cormorant-Garamond">MADANA G S</h1>
        <div className="flex gap-2 items-center justify-center">
          <div className="flex items-center justify-center">
            <Mail className="w-4 h-4" />
            <p>madan@gmail.com</p>
          </div>
          <div className="">
            <p>madan@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultResume;
