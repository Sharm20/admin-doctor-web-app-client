import React, { useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@mui/material";
import { format } from "date-fns";

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const userType = user && user.userType;
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("user"));
  const [changePass, setChangePass] = useState(false);
  const [credentials, setCredential] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  console.log(user);
  useEffect(() => {
    // console.log(user);
    // console.log(user._id);
    setCredential({
      ...credentials,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      dob: user.dob && format(user.dob, "yyyy-MM-dd"),
    });
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCredential({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credentials.newPassword !== credentials.confirmPassword) {
      toast.error("new password does not match");
    }
    console.log(credentials);
    try {
      const update = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_SERVER_URL}/api/users/${user._id}`,
        data: {
          username: credentials.username,
          first_name: credentials.first_name,
          last_name: credentials.last_name,
          email: credentials.email,
          dob: credentials.dob,
          password: credentials.password,
          newPassword: credentials.newPassword,
        },
      });

      if (update) {
        console.log(update.data);
        toast.success("CHANGES SAVED!");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.error);
      } else if (error.request) {
        toast.error("No response from the server");
      } else {
        toast.error("request Failed");
      }
    }
  };

  return (
    <>
      <h3 className="mt-3"> Edit Profile</h3>

      <div className="d-flex flex-row">
        <div className="add-pages-container mt-2 mb-5 col-10 col-sm-8 col-md-6 col-lg-5 ">
          <ToastContainer autoClose={2000} />
          <center />
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="Name" className="form-label mt-4">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInput}
                placeholder="username will be used for log in"
              />
            </div>
            <div className="form-group">
              <label htmlFor="Name" className="form-label mt-4">
                First name
              </label>
              <input
                type="text"
                className="form-control"
                id="firstname"
                name="first_name"
                value={credentials.first_name}
                onChange={handleInput}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="Name" className="form-label mt-4">
                Last name
              </label>
              <input
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                value={credentials.last_name}
                onChange={handleInput}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="Email" className="form-label mt-4">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleInput}
                placeholder="Enter Email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dob" className="form-label mt-4">
                Date of Birth
              </label>
              <input
                type="date"
                className="form-control"
                id="dob"
                name="dob"
                value={credentials.dob}
                onChange={handleInput}
                placeholder="Enter your Birthday"
              />
            </div>

            <div></div>

            <input
              type="submit"
              value="Save"
              className="btn btn-primary mt-3"
            />
          </form>
        </div>
        <div className="d-flex flex-column">
          <div className="mt-5" style={{ marginLeft: "30px", width: "400px" }}>
            <Button
              sx={{
                color: "black",
                outline: "black",
                border: "1px solid black",
                marginTop: "10px",
              }}
              variant="outlined"
              onClick={() => {
                setChangePass(true);
              }}
            >
              Change Password
            </Button>
            {changePass && (
              <Button
                sx={{
                  color: "red",
                  outline: "red",
                  border: "1px solid red",
                  marginTop: "10px",
                  left: "5%",
                }}
                variant="outlined"
                onClick={() => {
                  setChangePass(false);
                }}
              >
                Cancel
              </Button>
            )}
            {changePass && (
              <div>
                <div className="form-group">
                  <label htmlFor="passwordInput" className="form-label mt-2">
                    Old Password
                  </label>
                  <input
                    type="password" //makes it dots
                    className="form-control"
                    id="passwordInput"
                    name="password"
                    value={credentials.password}
                    onChange={handleInput}
                    placeholder="enter old password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="passwordInput" className="form-label mt-2">
                    New Password
                  </label>
                  <input
                    type="password" //makes it dots
                    className="form-control"
                    id="passwordInput"
                    name="newPassword"
                    value={credentials.newPassword}
                    onChange={handleInput}
                    placeholder="enter new password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label mt-4">
                    Confirm Password
                  </label>
                  <input
                    type="password" //makes it dots
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={credentials.confirmPassword}
                    onChange={handleInput}
                    placeholder="confirm new password"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
