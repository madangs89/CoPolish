// import { useRef, useCallback } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// export const useAutoSave = () => {
//   const timer = useRef(null);

//   const saveToServer = async (resumeData) => {
//     try {
//       await axios.put(
//         `${import.meta.env.VITE_BACKEND_URL}/api/resume/v1/update/${resumeData._id}`,
//         { resumeData },
//         { withCredentials: true },
//       );
//       console.log("Auto saved");
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to save changes");
//     }
//   };
//   const debounceSave = useCallback((data, delay = 3000) => {
//     if (timer.current) clearTimeout(timer.current);
//     timer.current = setTimeout(() => {
//       saveToServer(data);
//     }, delay);
//   }, []);

//   return { debounceSave, saveToServer };
// };
