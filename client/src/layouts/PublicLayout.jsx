import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbars/Navbar";
import { useSelector } from "react-redux";

const PublicLayout = () => {
  const auth = useSelector((state) => state.auth.isAuth);
  if (auth) {
    return <Navigate to="/onboarding" replace />;
  }
  return (
    <div className="w-full relative  min-h-screen overflow-hidden">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
