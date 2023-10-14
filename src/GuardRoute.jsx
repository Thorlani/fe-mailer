import { Navigate, Outlet } from "react-router-dom";

const GuardRoute = () => {
    
  let user = localStorage.getItem("isLoggedIn");

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default GuardRoute;
