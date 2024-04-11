import "../App.css";
import React from "react";
// import { SidebarData } from "./SidebarData";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import AdminPanelButton from "./AdminPanelButton";
import LetterAvatars from "./Avatar";
import PersonIcon from "@mui/icons-material/Person";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PeopleIcon from "@mui/icons-material/People";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import UsersButton from "./UsersButton";

const AdminSidebar = () => {
  const { setUser } = useContext(AuthContext);
  const { setIsAdminLoggedin } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const username = user && user.username;
  // console.log(user.username);
  // const storedUser = JSON.parse(localStorage.getItem("user"));
  // const username = storedUser ? storedUser.username : "Null";
  const logout = async () => {
    await setUser(null);
    await setIsAdminLoggedin(false);
    localStorage.clear();
    navigate("/");
    toast.success("logged out");
  };
  const dashboardClick = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className="Sidebar">
      <div className="avatar" style={{}}>
        <LetterAvatars />
      </div>
      <div
        className="sidebar-user"
        style={{
          position: "relative",
          marginTop: "15px",
        }}
      >
        <h5 style={{ textAlign: "center", color: "white" }}>{username} </h5>
      </div>
      <div className="Sidebar-content">
        <ul className="list">
          {/* <li>
            <AdminPanelButton />
          </li> */}
          <li
            className="list-item"
            onClick={() => {
              navigate("/clinics");
            }}
          >
            <div>
              <MedicalInformationIcon />
            </div>
            <span className="title ">Clinics</span>
          </li>
          <li
            className="list-item"
            onClick={() => {
              navigate("/doctors");
            }}
          >
            <div>
              <FileCopyIcon />
            </div>
            <span className="title ">Doctors</span>
          </li>
          <li
            className="list-item"
            onClick={() => {
              navigate("/appointments");
            }}
          >
            <div>
              <BookOnlineIcon />
            </div>
            <span className="title ">Appointments</span>
          </li>
          <li
            className="list-item"
            onClick={() => {
              navigate("/specializations");
            }}
          >
            <div>
              <MoreHorizIcon />
            </div>
            <span className="title ">Specializations</span>
          </li>
          <li className="list-item">
            <div>
              <PeopleIcon />
            </div>
            <span className="title ">
              <UsersButton />
            </span>
          </li>
          <li
            className="list-item"
            onClick={() => {
              navigate("/edit-profile");
            }}
          >
            <div>
              <PersonIcon />
            </div>
            <div className="title">Edit Profile</div>
          </li>
          <li className="list-item">
            <div>
              <LogoutIcon />
            </div>
            <div className="title" onClick={logout}>
              Logout
            </div>
          </li>

          {/* {SidebarData.map((val, key) => {
            return (
              <li
                key={key}
                className="list-item"
                onClick={(window.location.pathname = val.link)}
              >
                <div>{val.icon}</div>
                <div className="val-title">{val.title}</div>
              </li>
            );
          })} */}
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
