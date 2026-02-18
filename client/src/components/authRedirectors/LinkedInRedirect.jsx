import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setLinkedInConnectedTrue } from "../../redux/slice/linkedInSlice";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
const LinkedInRedirect = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    console.log("LinkedIn Code:", code);
    if (code) {
      (async () => {
        const currentLinkedInId = localStorage.getItem("currentLinkedInData");
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/v1/linkedin/exchange`,
          { code, _id: currentLinkedInId },
          {
            withCredentials: true,
          },
        );

        console.log(data);
        localStorage.removeItem("currentLinkedInData");
        if (data.success) {
          dispatch(setLinkedInConnectedTrue());
          const redirectPath = localStorage.getItem("redirect") || "/dashboard";
          localStorage.removeItem("redirect");
          toast.success("LinkedIn connected successfully!");
          navigate(redirectPath);
        } else {
          toast.error("Failed to connect LinkedIn. Please try again.");
          const redirectPath = localStorage.getItem("redirect") || "/dashboard";
          localStorage.removeItem("redirect");
          navigate(redirectPath);
        }

        navigate("/dashboard");
      })();
    }
  }, [location]);

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <div className="">Redirecting</div>
    </div>
  );
};

export default LinkedInRedirect;
