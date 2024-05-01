import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Input } from "@mui/material";

const CancelAppointment = () => {
  const [reason, setReason] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({});
  // console.log(id);

  useEffect(() => {
    const fetchApptDetails = async () => {
      try {
        const appointmentData = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/appointments/` + id
        );

        // console.log(appointment.data);
        setAppointment(appointmentData.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchApptDetails();
  }, []);

  console.log("patient number: ", appointment?.patient?.contact_num);
  console.log(reason);

  const cancel = async () => {
    try {
      console.log(id);
      const updatedApptStatus = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/api/appointment-status/add`,
        data: { appointment_id: id, status: "Cancelled" },
      });

      if (reason === "") {
        const sms = await axios({
          method: "POST",
          url: `${process.env.REACT_APP_SERVER_URL}/api/sms/send-sms`,
          data: {
            phoneNumber: appointment?.patient.contact_num,
            message: `Good day Mr/Ms. ${appointment.patient.first_name} ${appointment.patient.last_name}, Your appointment with a reference number: ${appointment.reference_num} has been cancelled.`,
            sender_id: appointment?.doctor._id,
          },
        });
        console.log(sms.data);
      } else {
        const sms = await axios({
          method: "POST",
          url: `${process.env.REACT_APP_SERVER_URL}/api/sms/send-sms`,
          data: {
            phoneNumber: appointment?.patient.contact_num,
            message: `Good day Mr/Ms. ${appointment.patient.first_name} ${appointment.patient.last_name}, Your appointment with a reference number: ${appointment.reference_num} has been cancelled. Reason for cancellation: ${reason}`,
            sender_id: appointment?.doctor._id,
          },
        });
        console.log(sms.data);
      }

      if (updatedApptStatus) {
        toast.success("Appointment Cancelled!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };
  console.log(appointment);

  return (
    <div
      className="d-flex flex-column mt-3 ml-2"
      style={{
        left: "40%",
        top: "10%",
        position: " fixed",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "10px",
        textAlign: "center",
        alignItems: "center",
      }}
    >
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
            border: "1px solid #536872",
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

      <Input
        placeholder="Reason (Optional)"
        multiline
        sx={{
          marginTop: "10px",
          width: "300px",
          height: "fit-content",
          fontSize: "16px",
          lineHeight: "1.5",
          textAlign: "left",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "4px",
          resize: "none",
        }}
        onChange={(e) => setReason(e.target.value)}
      />
    </div>
  );
};

export default CancelAppointment;
