import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedLayout = () => {
  const auth = useSelector((state) => state.auth.isAuth);

  if (!auth) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* <MainNavbar /> */}
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
