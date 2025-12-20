import React, { useState } from "react";
import Hero from "./pages/Hero";
import Cursor from "./components/Cursor";
import OnboardingSource from "./pages/OnboardingSource";
import { Route, Routes } from "react-router-dom";
import AprovePage from "./pages/AprovePage";
import Dashboard from "./pages/Dashboard";
import ResumeEditor from "./pages/ResumeEditor";
import MainNavbar from "./components/Navbars/MainNavbar";
import { useSelector } from "react-redux";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import ApprovePage from "./pages/AprovePage";

const App = () => {
  const auth = useSelector((state) => state.auth.isAuth);

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
