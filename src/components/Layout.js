import Navbar from "./Navbar";
import AdminSidebar from "./AdminSidebar";
import DoctorSidebar from "./DoctorSidebar";
import "../App.css";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

const Layout = ({ navbar = true, children }) => {
  const { user } = useContext(AuthContext);
  const userType = user && user.userType;
  return (
    <>
      {userType == "admin" ? <AdminSidebar /> : <DoctorSidebar />}
      <div className="container">{children}</div>
    </>
  );
};

export default Layout;
