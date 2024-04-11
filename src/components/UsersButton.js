import Button, { buttonClasses } from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "../App.css";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Paper } from "@mui/material";

const UsersButton = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const adminUsers = () => {
    handleClose();
    navigate("/admin-users");
  };

  const doctorUsers = () => {
    handleClose();
    navigate("/doctor-users");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ marginLeft: "4px", height: "25px" }}>
      <MenuItem
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          backgroundColor: "transparent",
          color: "black",
          textTransform: "none",
          right: "20px",
          bottom: "7px",
          width: "100px",
        }}
      >
        Users
      </MenuItem>

      <Menu
        classes={{ paper: "user-dropdown" }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onMouseLeave={handleClose}
      >
        <MenuItem onClick={adminUsers}>Admin Users</MenuItem>
        <MenuItem onClick={doctorUsers}>Doctor Users</MenuItem>
      </Menu>
    </div>
  );
};

export default UsersButton;
