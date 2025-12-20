import React, { useState } from "react";
import Hero from "./pages/Hero";
import Cursor from "./components/Cursor";
import OnboardingSource from "./pages/OnboardingSource";
import { Route, Routes, useNavigate } from "react-router-dom";
import AprovePage from "./pages/AprovePage";
import Dashboard from "./pages/Dashboard";
import ResumeEditor from "./pages/ResumeEditor";
import MainNavbar from "./components/Navbars/MainNavbar";
import { useDispatch, useSelector } from "react-redux";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import ApprovePage from "./pages/AprovePage";
import { useEffect } from "react";
import axios from "axios";
import { setAuthFalse, setUser } from "./redux/slice/authSlice";

const App = () => {
  const auth = useSelector((state) => state.auth.isAuth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(false);
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/v1/is-auth`,
          {
            withCredentials: true,
          }
        );
        console.log(data);

        if (data.success) {
          console.log("calling setUser");

          dispatch(setUser(data));
          if (
            data?.user?.currentResumeId == "" ||
            data?.user?.currentResumeId == undefined
          ) {
            navigate("/onboarding");
          } else {
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.log(error);
        let data = {
          user: {},
          isAuth: false,
        };
        dispatch(setAuthFalse(false));
        dispatch(setUser(data));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="w-full relative min-h-screen">
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route index element={<Hero />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedLayout />}>
          <Route path="/onboarding" element={<OnboardingSource />} />
          <Route path="/approve" element={<ApprovePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor/resume/:id" element={<ResumeEditor />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
