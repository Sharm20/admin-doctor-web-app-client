import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const CancelAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({});
  console.log(id);

  useEffect(() => {
    const fetchApptDetails = async () => {
      try {
        const appointmentData = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/appointments/` + id
        );

        console.log(appointment.data);
        setAppointment(appointmentData.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchApptDetails();
  }, []);

  const cancel = async () => {
    try {
      console.log(id);
      const updatedApptStatus = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/api/appointment-status/add`,
        data: { appointment_id: id, status: "Cancelled" },
      });

      // console.log(updatedApptStatus.data);
      if (updatedApptStatus) {
        toast.success("Appointment Cancelled!");

        // console.log(changeStatus);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };
  console.log(appointment);

  return (
    <div className="d-flex flex-column mt-3 ml-2">
      <h4>Cancel {appointment.patient?.first_name}'s appointment</h4>
      <div className="d-flex flex-wrap mt-5">
        <div
          className="d-flex flex-column"
          style={{
            width: "300px",
            height: "fit-content",
            textAlign: "left",
            padding: "20px",
            boxShadow: "0 2px 2px",
            borderRadius: "10px",
            border: "1px solid black",
            marginLeft: "10px",
            marginBottom: "10px",
          }}
        >
          {" "}
          <h5>
            {appointment.patient?.first_name} {appointment.patient?.last_name}
          </h5>
          <>{appointment.reference_num}</>
          <a>CLINIC: {appointment.clinic?.clinic_code}</a>
          <a>TIMESLOT: {appointment.timeslot}</a>
          {/* <a>BOOKED AT: {format(appointment.createdAt, "MMMM d, yyyy")}</a> */}
          <a> Patient Notes: {appointment.appointment_notes}</a>
        </div>
      </div>
      {/* sms integration */}
      <div>
        <Button
          onClick={() => {
            cancel().then(navigate("/doctor-appointments"));
          }}
          sx={{
            color: "white",
            width: "fit-content",
            backgroundColor: "#2C7865",
            marginLeft: "10px",
            marginTop: "10px",
          }}
        >
          Confirm cancellation
        </Button>
      </div>
    </div>
  );
};

export default CancelAppointment;
