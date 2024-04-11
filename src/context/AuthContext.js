// require("dotenv").config();
import { createContext, useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isAdminLoggedin, setIsAdminLoggedin] = useState(false);
  const [isDoctorLoggedin, setIsDoctorLoggedin] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [specializations, setSpecializations] = useState(
    JSON.parse(localStorage.getItem("specializations"))
  );
  const [clinics, setClinics] = useState(
    JSON.parse(localStorage.getItem("clinics"))
  );
  const [error, setError] = useState(null);
  //   login request
  const loginUser = async (userData) => {
    try {
      console.log(process.env.REACT_APP_SERVER_URL);
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...userData }),
        }
      );
      const result = await res.json();
      if (!result.error) {
        // console.log(result.user);
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);
        setIsAdminLoggedin(true);
        return result.user; // returns user data
      } else {
        // console.log(result);
        setError(result.error);
        toast.error(result.error);
      }
      console.log(`token: ${result.token}`);
    } catch (error) {
      console.log(error);
      toast.error("Login Failed");
    }
    // console.log(user);
  };

  const loginDoctor = async (userData) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/doctors/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...userData }),
        }
      );
      const result = await res.json();
      if (!result.error) {
        // console.log(result.user);
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem(
          "specializations",
          JSON.stringify(result.specializations)
        );
        localStorage.setItem("clinics", JSON.stringify(result.clinics));
        localStorage.setItem(
          "specializations",
          JSON.stringify(result.specializations)
        );
        setUser(result.user);
        setIsDoctorLoggedin(true);
        setSpecializations(result.specializations);
        setClinics(result.clinics);

        return result.user; // returns user data
      } else {
        // console.log(result);
        setError(result.error);
        toast.error(result.error);
      }
      console.log(`token: ${result.token}`);
    } catch (error) {
      console.log(error);
      toast.error("Login Failed");
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        logout,
        setUser,
        loginDoctor,
        setIsAdminLoggedin,
        setIsDoctorLoggedin,
        user,
        specializations,
        clinics,
        isAdminLoggedin,
        isDoctorLoggedin,
      }}
    >
      <ToastContainer autoClose={2000} />
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
