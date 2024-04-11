import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../context/AuthContext";

const AddDoctorUser = () => {
  const [credentials, setCredential] = useState({
    doctor: "",
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCredential({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(credentials);
    if (
      !credentials.username ||
      !credentials.first_name ||
      !credentials.last_name ||
      !credentials.email ||
      !credentials.dob ||
      !credentials.password ||
      !credentials.confirmPassword
    ) {
      toast.error("Enter all fields");
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      toast.error("Password do not match");
    }
    // const Data = { ...credentials, confirmPassword: undefined };

    try {
      const newClinicUser = await axios({
        method: "POST",
        url: "http://localhost:8080/api/users/register",
        data: {
          ...credentials,
          confirmPassword: undefined,
          userType: "clinic",
        },
      });
      if (newClinicUser) {
        console.log(newClinicUser);
        toast.success("New Clinic User Added");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
        // window.location.reload();
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error("Request failed");
      }
    }
  };

  return (
    <>
      <div className="add-pages-container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
        <ToastContainer autoClose={2000} />
        <center />
        <h3> Add New Doctor User</h3>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Name" className="form-label mt-4">
              Name of Doctor
            </label>
            <input
              type="text"
              className="form-control"
              id="doctor"
              name="doctor"
              value={credentials.username}
              onChange={handleInput}
              placeholder="Enter doctor"
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="passwordInput" className="form-label mt-4">
              Password
            </label>
            <input
              type="password" //makes it dots
              className="form-control"
              id="passwordInput"
              name="password"
              value={credentials.password}
              onChange={handleInput}
              placeholder="Enter password"
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
              placeholder="Confirm Password"
            />
          </div>
          <input type="submit" value="Save" className="btn btn-primary mt-3" />
        </form>
      </div>
    </>
  );
};

export default AddDoctorUser;
