import React, { useState } from "react";
import { format } from "date-fns";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { toast } from "react-toastify";

const AppointmentActions = () => {
  const [openModal, setOpenModal] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);

  const cancelAppointment = async (id) => {
    try {
      const updatedApptStatus = await axios({
        method: "POST",
        url: `${process.env.SERVER_URL}/api/appointment-status/add`,
        data: { appointment_id: id, status: "Cancelled" },
      });

      console.log(updatedApptStatus.data);
      if (updatedApptStatus) {
        toast.success("Appointment Cancelled!");
        setChangeStatus(true);
        console.log(changeStatus);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  //   let status = { status };

  return <></>;
};

export default AppointmentActions;
