import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { Button } from "@mui/material";

const UpdateAdminUser = () => {
  const { id } = useParams();
  const [changePass, setChangePass] = useState(false);
  const [credentials, setCredential] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/${id}`);
        const user = res.data;
        console.log(user);
        setCredential({
          ...credentials,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCredential({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(credentials);

    if (credentials.password !== credentials.confirmPassword) {
      toast.error("Password do not match");
    }

    // const Data = { ...credentials, confirmPassword: undefined };
    try {
      const newAdmin = await axios({
        method: "POST",
        url: "http://localhost:8080/api/users/register",
        data: {
          ...credentials,
          confirmPassword: undefined,
          userType: "admin",
        },
      });
      if (newAdmin) {
        console.log(newAdmin);
        toast.success("New Admin Added");
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
      <div className="add-pages-container ml-5 mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
        <ToastContainer autoClose={2000} />
        <center />
        <h3> Update Admin</h3>
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
            <>
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
                  name="password"
                  value={credentials.password}
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
            </>
          )}
          <div></div>
          <input type="submit" value="Save" className="btn btn-primary mt-3" />
        </form>
      </div>
    </>
  );
};

export default UpdateAdminUser;
