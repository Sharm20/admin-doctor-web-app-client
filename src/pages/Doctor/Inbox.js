import { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import SendMessage from "../../functions/sendSMS";

const Inbox = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser ? storedUser.username : "Null";
  useEffect(() => {
    // SendMessage();
  });

  // console.log(user);
  return (
    <div className="mt-3">
      <h1>{username}'s Inbox</h1>
    </div>
  );
};

export default Inbox;
