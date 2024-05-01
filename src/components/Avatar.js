import * as React from "react";
import { useState, useEffect } from "react";
import { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import AuthContext from "../context/AuthContext";
import { deepOrange, deepPurple, blueGrey } from "@mui/material/colors";

const LetterAvatars = () => {
  const { user } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("Null");
  const [lastName, setLastName] = useState("Null");

  useEffect(() => {
    // const storedUser = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name.split(" ")[0]);
      console.log("last name: ", user.last_name.split(" ")[0]);

      // if (user.last_name.split(" ") !== 0) {
      //   setLastName(user.last_name.split(" ")[0]);
      // } else if (user.last_name.split(" " == 0)) {
      //   setFirstName(user.first_name);
      // }
    }
  }, []);

  const name = firstName + " " + lastName;

  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: "#536872",
        height: "150px",
        width: "150px",
        fontSize: "70px",
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  // console.log(username);
  return (
    <Avatar
      sx={{
        position: "fixed",
        bgcolor: blueGrey[500],
      }}
      {...stringAvatar(name ? name : "U")}
    />
  );
};

export default LetterAvatars;
