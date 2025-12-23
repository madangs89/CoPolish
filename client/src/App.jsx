import React, { useState, Suspense, lazy } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setAuthFalse, setUser } from "./redux/slice/authSlice";

const Hero = lazy(() => import("./pages/Hero"));
const Cursor = lazy(() => import("./components/Cursor"));
const OnboardingSource = lazy(() => import("./pages/OnboardingSource"));
const ApprovePage = lazy(() => import("./pages/AprovePage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ResumeEditor = lazy(() => import("./pages/ResumeEditor"));
const MainNavbar = lazy(() => import("./components/Navbars/MainNavbar"));
const PublicLayout = lazy(() => import("./layouts/PublicLayout"));
const ProtectedLayout = lazy(() => import("./layouts/ProtectedLayout"));

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
          data.isAuth = true;
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
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </div>
  );
};

export default App;
