import { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { Button } from "@mui/material";
import { format } from "date-fns";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
const Login = ({}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const { loginDoctor } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credential, setCredential] = useState({ username: "", password: "" });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCredential({ ...credential, [name]: value });
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleSubmitAdmin = async (e) => {
    e.preventDefault();

    if (!credential.username || !credential.password) {
      toast.error("Enter all fields");
      return;
    }
    // loginUser(credential);
    const user = await loginUser(credential); //called loginUser function
    if (user && user.username) {
      toast.success("Logged in");
      console.log(user.username);
      navigate("/clinics");
    }
  };

  const handleSubmitDoctor = async (e) => {
    e.preventDefault();

    if (!credential.username || !credential.password) {
      toast.error("Enter all fields");
      return;
    }
    // loginUser(credential);
    const user = await loginDoctor(credential); //called loginDoctor function
    if (user && user.username) {
      const now = new Date().getTime();
      const CA = new Date(user?.createdAt).getTime();
      const createdAtDate = new Date(user?.createdAt);
      const halfHourPassed = new Date(createdAtDate.getTime() + 30 * 60 * 1000);
      toast.success("Logged in");

      if (now <= halfHourPassed) {
        toast.info(
          "You are advised to change your password immediately after the creation of your account. Please disregard this message if you already changed your password.",
          { autoClose: false }
        );
        navigate("/edit-doctor-profile");
      } else {
        navigate("/doctor-appointments");
      }
    }
  };

  return (
    <div className="d-flex flex-row">
      <div>
        <img
          src="/log_in.png"
          style={{
            width: "fit-content",
            height: "500px",
            position: "fixed",
            top: "17%",
            left: "10%",
          }}
        />
      </div>
      <div
        style={{
          position: "fixed",
          left: "57%",
          top: "25%",
        }}
      >
        <ToastContainer autoClose={2000} />
        <div className="login">
          <div id="login-form" style={{ width: "400px" }}>
            <h3> Login</h3>
            <form>
              <div className="form-group">
                <label htmlFor="Name" className="form-label mt-4">
                  Username
                </label>
                <Input
                  sx={{ height: "50px", width: "400px" }}
                  type="name"
                  className="form-control"
                  id="name"
                  name="username"
                  aria-describedby="name"
                  value={credential.username}
                  onChange={handleInput}
                  placeholder="Enter Name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="passwordInput" className="form-label mt-3">
                  Password
                </label>
                <Input
                  sx={{ height: "50px", width: "400px" }}
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="outlined-adornment-password"
                  name="password"
                  value={credential.password}
                  onChange={handleInput}
                  placeholder="Enter password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </div>

              {""}
              <div className="d-flex flex-row">
                <button
                  className="btn mt-4 mb-3"
                  // style={{ marginRight: "10px" }}
                  onClick={handleSubmitAdmin}
                >
                  Log in as Admin
                </button>
                <button
                  className="btn btn-primary mt-4 mb-3"
                  style={{ borderRadius: "5px", marginLeft: "35px" }}
                  onClick={handleSubmitDoctor}
                >
                  Log in as Doctor
                </button>
              </div>
              {/* <Link style={{ marginTop: "20px" }} className="mt-2">
                Forgot Password?
              </Link> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
