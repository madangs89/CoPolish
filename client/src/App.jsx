import React, { useState } from "react";
import Hero from "./pages/Hero";
import Cursor from "./components/Cursor";
import OnboardingSource from "./pages/OnboardingSource";
import { Route, Routes } from "react-router-dom";
import AprovePage from "./pages/AprovePage";

const App = () => {
  const [auth, isAuth] = useState(true);

  if (!auth) {
    return (
      <div className="w-full relative  min-h-screen overflow-x-hidden bg-red-500">
        <Routes>
          <Route index element={<Hero />} />
        </Routes>
      </div>
    );
  } else {
    return (
      <div className="w-full relative  min-h-screen overflow-x-hidden bg-red-500">
        <Routes>
          <Route index element={<OnboardingSource />} />
          <Route path="/approve" element={<AprovePage />} />
        </Routes>
      </div>
    );
  }
};

export default App;
