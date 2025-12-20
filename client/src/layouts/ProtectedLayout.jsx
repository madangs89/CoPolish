import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import MainNavbar from "../components/Navbars/MainNavbar";

const ProtectedLayout = () => {
  const auth = useSelector((state) => state.auth.isAuth);

  if (!auth) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-screen overflow-scroll">
      {/* <MainNavbar /> */}
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
