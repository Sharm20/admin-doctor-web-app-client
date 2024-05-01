import { useContext, useEffect } from "react";
import Chatlist from "../../components/Chatlist";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CommentIcon from "@mui/icons-material/Comment";
import IconButton from "@mui/material/IconButton";
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
  return <Chatlist />;
};

export default Inbox;
