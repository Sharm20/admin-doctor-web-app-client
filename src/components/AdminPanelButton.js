import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PeopleIcon from "@mui/icons-material/People";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import "../App.css";
import { useNavigate } from "react-router-dom";
import UsersButton from "./UsersButton";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 20,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function AdminPanelButton() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const clinicsPage = () => {
    navigate("/clinics");
    handleClose();
  };
  const doctorsPage = () => {
    navigate("/doctors");
    handleClose();
  };

  const appointmentsPage = () => {
    navigate("/appointments");
    handleClose();
  };

  const usersPage = () => {
    navigate("/users");
    handleClose();
  };

  const specializationsPage = () => {
    navigate("/specializations");
    handleClose();
  };
  return (
    <div className="list-item">
      <AdminPanelSettingsIcon />
      <div
        className="title mb-1"
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="text"
        onClick={handleClick}
        // disableElevation
        // disableRipple
      >
        Admin Panel
      </div>
      <KeyboardArrowRightIcon />

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          position: "fixed",
          left: "200px",
          marginBottom: "250px",
        }}
      >
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={clinicsPage}>
          <MedicalInformationIcon />
          Clinics
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={doctorsPage}>
          <FileCopyIcon />
          Doctors
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={appointmentsPage}>
          <BookOnlineIcon />
          Appointments
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem>
          <PeopleIcon />
          <UsersButton />
        </MenuItem>
        <Divider sx={{ my: 0.9 }} />

        <MenuItem onClick={specializationsPage} sx={{ marginBottom: "5px" }}>
          <MoreHorizIcon />
          Specializations
          <Divider sx={{ my: 0.5 }} />
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
