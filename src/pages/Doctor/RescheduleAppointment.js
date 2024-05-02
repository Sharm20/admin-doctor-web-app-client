import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Input, useColorScheme } from "@mui/material";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { format } from "date-fns";
import { dateCalendarClasses } from "@mui/x-date-pickers/DateCalendar";

const RescheduleAppointment = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [appointment, setAppointment] = useState({});
  const [otherFields, setOtherFields] = useState({
    date: "",
    timeslot: "",
    start: "",
    end: "",
  });

  const [chosenDate, setChosenDate] = useState();
  const [timeslots, setTimeSlots] = useState([]);

  useEffect(() => {
    console.log("doctor: ", user);
    const fetchApptDetails = async () => {
      try {
        const appointmentData = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/appointments/` + id
        );
        console.log(appointmentData.data);
        setAppointment(appointmentData.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchApptDetails();
  }, []);

  useEffect(() => {
    const getBookingAndWalkInTimeSlots = async () => {
      if (chosenDate) {
        console.log("chosen date: ", chosenDate);
        const url = `${process.env.REACT_APP_SERVER_URL}/api/calendar/doctor-daily-schedule/${user._id}?date=${chosenDate}`;
        console.log("url: ", url);
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/calendar/doctor-daily-schedule/${user._id}?date=${chosenDate}`
          );
          if (response && response.data) {
            setTimeSlots(response.data);
            console.log(response.message);
            return;
          }
        } catch (err) {
          if (err.response) {
            // const errorMessage = err.response.data.message;
            toast.info(errorMessage);
          } else if (err.request) {
            toast.error("No response from server");
          } else {
            toast.error("Request failed");
          }
          return;
        }
      }
    };
    getBookingAndWalkInTimeSlots();
  }, [chosenDate]);

  // console.log("appointment: ", appointment);
  const handleTimeslot = (e) => {
    const selectedTime = e.target.value;
    console.log("timeslot id: ", selectedTime);
    const timeslotData = timeslots.bookable.find(
      (ts) => ts.timeslot_id === selectedTime
    );
    console.log("chosen timeslot: ", timeslotData);
    setOtherFields({
      ...otherFields,
      timeslot: e.target.value,
      start: timeslotData.start,
      end: timeslotData.end,
    });
  };

  const handleDate = (e) => {
    setOtherFields({ ...otherFields, date: e.$d.toISOString() });
    setChosenDate(e.$d.toISOString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      date: otherFields.date,
      timeslot_id: otherFields.timeslot,
      start: otherFields.start,
      end: otherFields.end,
    };

    console.log("data: ", otherFields);

    if (
      !otherFields.date ||
      !otherFields.timeslot ||
      !otherFields.start ||
      !otherFields.end
    ) {
      return toast.error("Input all fields.");
    }
    try {
      const updatedAppointment = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_SERVER_URL}/api/appointments/resched/${id}`,
        data: data,
      });

      await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/api/sms/send-sms`,
        data: {
          phoneNumber: appointment?.patient.contact_num,
          message: `Good day Mr/Ms. ${
            appointment.patient.first_name
          }! Your appointment with Dr. ${user.last_name} at Clinic ${
            appointment.clinic.clinic_code
          }, was RESCHEDULED on ${format(
            otherFields.date,
            "MMMM d, yyyy"
          )}, at ${otherFields.start + " - " + otherFields.end}.`,
          sender_id: user._id,
        },
      }).then(toast.success("Text notification sent"));

      if (updatedAppointment.data) {
        console.log("Updates: ", updatedAppointment);
        toast.info(updatedAppointment.data.message);
      }
    } catch (error) {
      if (error.res) {
        const errorMessage = error.response.data.error;
        console.log(error);
        toast.error(errorMessage);
      }
    }
  };
  console.log(appointment.patient?.contact_num);

  return (
    <div className="mt-3">
      <h3>Reschedule</h3>
      <div
        className="mt-5 d-flex flex-column"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {" "}
        <div></div>
        <div
          className="mt-1"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={5}
            sx={{
              padding: "20px",
              width: "fit-content",
              alignContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="d-flex flex-wrap mt-2">
              <div
                className="d-flex flex-column"
                style={{
                  width: "fit-content",
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
                  Patient:{" "}
                  <b>
                    {appointment.patient?.first_name}{" "}
                    {appointment.patient?.last_name}
                  </b>
                </h5>
                <a>
                  Reference No. <b>{appointment.reference_num}</b>
                </a>
                <a>
                  Date:{" "}
                  <b>
                    {appointment.date
                      ? format(appointment?.date, "MMMM d, yyyy")
                      : "none"}
                  </b>
                </a>
                <a>
                  CLINIC: <b>{appointment.clinic?.clinic_code}</b>
                </a>
                <a>
                  TIMESLOT:{" "}
                  <b>
                    {appointment.timeslot?.start +
                      " - " +
                      appointment.timeslot?.end}
                  </b>
                </a>
                {/* <a>BOOKED AT: {format(appointment.createdAt, "MMMM d, yyyy")}</a> */}
                <a>
                  {" "}
                  Patient Notes:{" "}
                  <b>
                    {appointment.appointment_notes
                      ? appointment.appointment_notes
                      : "None"}
                  </b>
                </a>
              </div>
            </div>
            <a style={{ fontWeight: "bold", fontSize: "20px" }}>Time Details</a>
            <div
              className="form-group d-flex flex-column mt-3"
              style={{ width: "400px" }}
            >
              <Box>
                <FormControl fullWidth>
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ marginTop: "20px" }}
                  ></InputLabel>
                  <DatePicker required onChange={handleDate} />
                </FormControl>
              </Box>

              <Box>
                <FormControl fullWidth>
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ marginTop: "20px" }}
                  >
                    Time
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={otherFields.timeslot}
                    onChange={handleTimeslot}
                    sx={{ marginTop: "20px" }}
                  >
                    {timeslots && timeslots.bookable ? (
                      timeslots.bookable.map((ts) => (
                        <MenuItem
                          key={ts.timeslot_id}
                          value={ts.timeslot_id}
                          disabled={!ts.is_available}
                        >
                          <div className="row justify-content-between">
                            <b className="col-auto">
                              {ts.start + " - " + ts.end}
                            </b>
                            <p className="col-auto">Clinic {ts.clinic_code}</p>
                          </div>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem>No available schedule for that date</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Box>
            </div>

            <Button
              onClick={handleSubmit}
              sx={{
                color: "white",
                width: "fit-content",
                backgroundColor: "#2C7865",
                marginLeft: "10px",
                marginTop: "10px",
              }}
            >
              Reschedule
            </Button>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointment;
