import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../App.css";

const Admin = () => {
  const { user, setUser, loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser ? storedUser.username : "Null";

  // console.log(user);
  return (
    <>
      <div className="dashboard">
        <div className="dashboard-content">
          {" "}
          <h1> Hello {username}</h1>
          <h1></h1>
        </div>
      </div>
    </>
  );
};

export default Admin;
