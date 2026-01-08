import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadBox = ({ title, subtitle, status, setIsStatusTrue }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleSelectFile = (e) => {
    console.log(e.target.files);

    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleOnClick = () => {
    setIsStatusTrue(true);
    // navigate("/approve");
  };
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#e6e6e6] p-8 shadow-sm">
      {selectedFile ? (
        <>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-[#1f2430]">
              {selectedFile?.name}
            </h2>
            <p className="text-sm text-[#6b6b6b] mt-2">{selectedFile?.type}</p>
            <label className="mt-6 w-[30%] flex items-center justify-center px-2  my-2 rounded-full bg-[#6640EA] cursor-pointer text-white py-3 text-sm font-medium hover:scale-[1.02] transition">
              <input
                onChange={handleSelectFile}
                type="file"
                accept=".pdf, .doc, .docx"
                className="hidden"
              />
              Change
            </label>
          </div>

          {/* <div className="w-full h-[300px]">
            <iframe
              src={URL.createObjectURL(selectedFile)}
              className="w-full h-full object-fit"
              title="PDF"
            />
          </div> */}
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-[#1f2430]">{title}</h2>
          <p className="text-sm text-[#6b6b6b] mt-2">{subtitle}</p>
          <p className="text-sm text-[#6b6b6b] mt-2">
            {selectedFile ? selectedFile.name : ""}
          </p>
          <p className="text-sm text-[#6b6b6b] mt-2">
            {selectedFile ? selectedFile?.mimeType : ""}
          </p>

          <label className="mt-8 flex flex-col items-center justify-center border-2 border-dashed border-[#d0d0d0] rounded-xl p-10 cursor-pointer hover:border-black transition">
            <input
              onChange={handleSelectFile}
              type="file"
              accept=".pdf, .doc, .docx"
              className="hidden"
            />
            <p className="text-sm font-medium text-[#1f2430]">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-[#6b6b6b] mt-1">Max size 5MB</p>
          </label>
        </>
      )}

      <button
        onClick={handleOnClick}
        className="mt-6 w-full rounded-full bg-black text-white py-3 text-sm font-medium hover:scale-[1.02] transition"
      >
        Continue
      </button>
    </div>
  );
};
export default UploadBox;
