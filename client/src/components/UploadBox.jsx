import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const UploadBox = ({
  title,
  subtitle,
  status,
  setIsStatusTrue,
  setstatus,
  errorStates,
  setErrorStates,
  operation
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleSelectFile = (e) => {
    console.log(e.target.files);

    const file = e.target.files[0];

    const { size } = file;
    if (size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }
    setSelectedFile(file);
  };

  const handleOnClick = async () => {
    if (!selectedFile) return;
    const formdata = new FormData();
    formdata.append("resume", selectedFile);
    formdata.append("operation", operation);

    setIsStatusTrue(true);
    try {
      const uploadData = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/parse/v1/parse`,
        formdata,
        {
          withCredentials: true,
        }
      );
      console.log(uploadData);

      if (uploadData?.data?.success) {
        toast.success("File uploaded successfully");
        setstatus((prev) => {
          const newStatus = [...prev];
          newStatus.push("uploaded");
          return newStatus;
        });
      }
    } catch (error) {
      setErrorStates((prev) => [
        ...prev,
        {
          type: "upload",
          message:
            error?.response?.data?.message ||
            "Something went wrong while uploading file",
        },
      ]);
      console.log("Error while uploading file:", error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while uploading file"
      );
      return;
    }
  };
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#e6e6e6] mt-3 p-8 shadow-sm">
      {selectedFile ? (
        <>
          <div className="flex flex-col  my-2 gap-2">
            <h2 className="text-2xl font-bold text-[#1f2430]">
              {selectedFile?.name}
            </h2>
            <p className="text-sm text-[#6b6b6b] mt-2">{selectedFile?.type}</p>
            <p className="text-sm text-[#6b6b6b] mt-2">
              {(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB
            </p>
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

          <div className="w-full h-[200px]">
            <iframe
              src={URL.createObjectURL(selectedFile)}
              className="w-full h-full object-fit"
              title="PDF"
            />
          </div>
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
        disabled={!selectedFile}
        onClick={handleOnClick}
        className={`mt-6 w-full rounded-full ${
          selectedFile
            ? "bg-black hover:scale-[1.02] cursor-pointer"
            : "bg-gray-500"
        } text-white py-3 text-sm font-medium  transition`}
      >
        Continue
      </button>
    </div>
  );
};
export default UploadBox;
