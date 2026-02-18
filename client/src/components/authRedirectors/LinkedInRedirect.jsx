import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setLinkedInConnectedTrue } from "../../redux/slice/linkedInSlice";

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
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/v1/linkedin/exchange`,
          { code },
          {
            withCredentials: true,
          },
        );
        if (data.success) {
          dispatch(setLinkedInConnectedTrue());

          const redirectPath = localStorage.getItem("redirect") || "/dashboard";
          localStorage.removeItem("redirect");
          navigate(redirectPath);
        }
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
