import React, { useState, useContext, useEffect } from "react";
import ".././App.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HomeIcon from "@mui/icons-material/Home";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import LetterAvatars from "./Avatar";
import AuthContext from "../context/AuthContext";
import fetchSpecializations from "./fetchSpecializations";
import { set } from "date-fns";

const DoctorSidebar = () => {
  const { setUser } = useContext(AuthContext);
  const { setIsDoctorLoggedin } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const { specializations } = useContext(AuthContext);
  const navigate = useNavigate();

  const name = user && user.first_name + " " + user.last_name;

  const logout = async () => {
    await setUser(null);
    await setIsDoctorLoggedin(false);
    localStorage.clear();
    navigate("/");
    toast.success("logged out");
  };

  return (
    <div>
      <div className="Sidebar-doctor d-flex flex-column">
        <div className="Sidebar-doctor-user-content">
          <div className="avatar">
            <LetterAvatars />
          </div>
          <h5 style={{ marginTop: "10px" }}>Dr. {name}</h5>
          <span
            style={{ textAlign: "center", display: "block", fontSize: "11pt" }}
          >
            {specializations?.map((s) => s.specialty_name + " ")}
          </span>
          <div
            className="sidebar-user"
            style={{
              position: "relative",
              marginTop: "15px",
            }}
          ></div>
        </div>
        <div className="Sidebar-doctor-content">
          <ul
            className="mt-5"
            style={{
              listStyle: "none",
              alignContent: "center",
              alignSelf: "center",

              // cursor: "pointer"
            }}
          >
            {" "}
            <li
              className="list-item d-flex flex-row "
              onClick={() => {
                navigate("/doctor-appointments");
              }}
            >
              <div>
                <BookOnlineIcon />
              </div>
              <span className="title">Appointments</span>
            </li>
            <li
              className="list-item d-flex flex-row "
              onClick={() => {
                navigate("/patients");
              }}
            >
              <div>
                <GroupsIcon />
              </div>
              <span className="title">Patients</span>
            </li>
            <li
              className="list-item d-flex flex-row "
              onClick={() => {
                navigate("/edit-doctor-profile");
              }}
            >
              <div>
                {" "}
                <ManageAccountsIcon />
              </div>
              <span className="title">Account Settings</span>
            </li>
            <li
              className="list-item d-flex flex-row"
              onClick={() => {
                navigate("/doctor-inbox");
              }}
            >
              <div>
                <MailIcon color="black" />
              </div>
              <span className="title">Inbox</span>
            </li>
            <li className="list-item d-flex flex-row ">
              <div>
                {" "}
                <LogoutIcon />
              </div>
              <span className="title" onClick={logout}>
                Logout
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorSidebar;
