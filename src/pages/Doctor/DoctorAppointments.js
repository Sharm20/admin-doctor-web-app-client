import React, { useContext, useEffect, useState } from "react";
import "../../App.css";
import AuthContext from "../../context/AuthContext";
import { Form, Link, useNavigate } from "react-router-dom";
import { format, isAfter, isBefore } from "date-fns";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import axios from "axios";
import { toast } from "react-toastify";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { blueGrey } from "@mui/material/colors";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

// import { Dialog } from "@mui/material";

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const now = new Date();
  const [changeStatus, setChangeStatus] = useState(false);
  const [doctor, setDoctor] = useState({});
  const [appointments, setAppointments] = useState([]);
  const { user } = useContext(AuthContext);
  const [value, setValue] = useState(0);
  const [dateFilter, setDateFilter] = useState(format(now, "MMMM"));

  useEffect(() => {
    if (user && user._id) {
      try {
        console.log(process.env.REACT_APP_WEB_SOCKET_URL);
        const socket = new WebSocket(process.env.REACT_APP_WEB_SOCKET_URL);

        socket.addEventListener("open", (event) => {
          console.log("Websocket connected hehe");
          socket.send(JSON.stringify({ doctor_id: user._id }));
        });

        socket.addEventListener("message", (e) => {
          const message = JSON.parse(e.data);
          console.log("received mmessage: ", message);
          // console.log(message.data);

          setDoctor(message.doctor);
          setAppointments(message.appointments);
          setChangeStatus(false);
        });

        socket.addEventListener("error", (error) => {
          console.error("WebSocket error:", error); // Add this line for error logging
        });

        socket.addEventListener("close", (event) => {
          console.log("Websocket connection closed");
        });

        return () => {
          socket.close();
        };
      } catch (error) {
        console.log(error);
        toast("Can't connect to the server");
      }
    }
  }, [changeStatus]);
  // console.log(doctor);
  // console.log(appointments);

  const acceptAppointment = async (id, patient, timeslot, date) => {
    const time = doctor.timeslots
      .filter((t) => t._id === timeslot)
      .map((ft) => ft.start + " - " + ft.end);

    const formattedDate = format(date, "MMMM d, yyyy");

    try {
      const updatedApptStatus = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/api/appointment-status/add`,
        data: { appointment_id: id, status: "Confirmed" },
      });

      await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/api/sms/send-sms`,
        data: {
          phoneNumber: patient.contact_num,
          message: `Good day Mr/Ms. ${patient.first_name}! We're glad to inform you that your appointment on ${formattedDate} at ${time} has been ACCEPTED`,
          sender_id: doctor._id,
        },
      });
      // console.log(time);
      // console.log(updatedApptStatus.data);
      if (updatedApptStatus) {
        toast.success("Appointment Approved!");
        setChangeStatus(true);
        console.log(changeStatus);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }

    console.log(id);
  };

  const doneAppointment = async (id) => {
    try {
      const updatedApptStatus = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/api/appointment-status/add`,
        data: { appointment_id: id, status: "Completed" },
      });

      // console.log(updatedApptStatus.data);
      if (updatedApptStatus) {
        toast.success("Appointment Done!");
        setChangeStatus(true);
        // console.log(changeStatus);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  function a11yProps(index) {
    return {
      id: `action-tab-${index}`,
      "aria-controls": `action-tabpanel-${index}`,
    };
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`action-tabpanel-${index}`}
        aria-labelledby={`action-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </Typography>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const month = [
    { name: "January" },
    { name: "February" },
    { name: "March" },
    { name: "April" },
    { name: "May" },
    { name: "June" },
    { name: "July" },
    { name: "August" },
    { name: "September" },
    { name: "October" },
    { name: "November" },
    { name: "December" },
  ];

  const AppointmentsComponent = ({
    appointments,
    dateFilter,
    doneAppointment,
    doctor,
  }) => {
    const currentTime = new Date();
  };

  const currentTime = new Date();

  return (
    <div className="mt-3">
      <div style={{ position: "fixed" }}>
        <div className="d-flex flex-row">
          <div
            className="d-flex flex-row row justify-content-between"
            style={{ width: "700px" }}
          >
            <h2 className="col-auto">Appointments</h2>
            <div className="col-auto">
              <FormControl>
                <InputLabel id="demo-simple-select-label">Month</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Choose Month"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                  }}
                  sx={{ width: "200px", height: "40px" }}
                >
                  {month.map((m) => (
                    <MenuItem key={m.name} value={m.name}>
                      {" "}
                      {m.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="app-bar col-auto" style={{ marginLeft: "auto" }}>
            <ButtonGroup variant="text" sx={{ color: "black" }}></ButtonGroup>
            <AppBar
              sx={{ width: "500px", background: "none", marginTop: "10px" }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                textColor="primary"
                //   variant="fullWidth"
                aria-label="action tabs example"
              >
                <Tab
                  label="Pending"
                  {...a11yProps(0)}
                  sx={{ color: "black" }}
                />
                <Tab
                  label="Confirmed"
                  {...a11yProps(1)}
                  sx={{ color: "black" }}
                />
                <Tab
                  label="Completed"
                  {...a11yProps(2)}
                  sx={{ color: "black" }}
                />
                <Tab
                  label="Cancelled"
                  {...a11yProps(3)}
                  sx={{ color: "black" }}
                />
              </Tabs>
            </AppBar>
          </div>
        </div>
        <SwipeableViews
          index={value}
          onChangeIndex={handleChangeIndex}
          sx={{ width: "500px" }}
        >
          <TabPanel value={value} index={0}>
            <div
              className="d-flex flex-wrap"
              style={{
                gap: "5px",
                overflowY: "auto",
                maxHeight: "85vh",
              }}
            >
              {appointments
                .filter((a) => a.appointmentStatus[0].status === "Pending")
                .map((a, index) => {
                  return (
                    <Paper
                      elevation={4}
                      className="appointments-container d-flex flex-column"
                      style={{
                        width: "300px",
                        height: "fit-content",
                        textAlign: "left",
                        padding: "10px",
                        border: "1px solid #ccc",
                        marginLeft: "10px",
                        marginBottom: "10px",
                      }}
                      key={a._id}
                    >
                      {" "}
                      <h5>
                        {a.patient.first_name + " " + a.patient.last_name}
                      </h5>
                      <a>REFERENCE NO. {a.reference_num}</a>
                      <a>CLINIC: {a.clinic.clinic_code}</a>
                      <a>DATE: {format(a.date, "MMMM d, yyyy")}</a>
                      <a>
                        TIME:{" "}
                        {doctor.timeslots
                          .filter((t) => t._id === a.timeslot)
                          .map((ft) => ft.start + " - " + ft.end)}
                      </a>
                      <a>BOOKED AT: {format(a.createdAt, "MMMM d, yyyy")}</a>
                      <a> Patient Notes: {a.appointment_notes}</a>
                      <a>Contact Number: {a.patient.contact_num}</a>
                      <> </>
                      <Button
                        onClick={() => {
                          acceptAppointment(
                            a._id,
                            a.patient,
                            a.timeslot,
                            a.date
                          );
                        }}
                        sx={{
                          color: "white",
                          width: "100px",
                          backgroundColor: "#2C7865",
                          alignSelf: "center",
                          marginTop: "10px",
                          borderRadius: "5px",
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        Accept
                      </Button>
                      <div
                        className="d-flex flex-row mt-2 "
                        style={{ alignSelf: "center" }}
                      >
                        <Link
                          style={{
                            marginRight: "10px",
                            cursor: "pointer",
                            color: "Blue",
                            textDecoration: "none",
                          }}
                          to={`/reschedule-appointment/${a._id}`}
                        >
                          Reschedule{" "}
                        </Link>
                        <Link
                          style={{
                            cursor: "pointer",
                            color: "#FF0000",
                            textDecoration: "none",
                          }}
                          to={`/cancel-appointment/${a._id}`}
                        >
                          Cancel
                        </Link>
                      </div>
                    </Paper>
                  );
                })}
              <div style={{ padding: "20px 20px" }}>
                <Paper
                  elevation={4}
                  className="appointments-container d-flex flex-column"
                  style={{
                    width: "250px",
                    height: "250px",
                    textAlign: "left",
                    padding: "35% 35%",
                    border: "1px solid #ccc",
                    marginLeft: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <IconButton
                    onClick={() => {
                      navigate("/add-appointment");
                    }}
                  >
                    <AddIcon fontSize="large" />
                  </IconButton>
                </Paper>
              </div>
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <div
              className="d-flex flex-wrap"
              style={{
                gap: "5px",
                overflowY: "auto",
                maxHeight: "85vh",
              }}
            >
              {appointments
                .filter(
                  (a) =>
                    a.appointmentStatus[0].status === "Confirmed" &&
                    format(a.date, "MMMM") === dateFilter
                )
                .map((a, index) => {
                  const appointmentTime = new Date(a.date);
                  const isCurrentlyHappening = doctor.timeslots
                    .filter((t) => t._id === a.timeslot)
                    .some((ft) => {
                      // console.log(ft.start, ft.end);
                      // console.log(format(currentTime, "h:mm aa"));
                      const now = "3:32 PM";
                      return isAfter(now, ft.start) && isBefore(now, ft.end);
                    });

                  return (
                    <Paper
                      elevation={5}
                      className={`appointments-container d-flex flex-column ${
                        isCurrentlyHappening ? "currently-happening" : ""
                      }`}
                      style={{
                        width: "300px",
                        height: "fit-content",
                        textAlign: "left",
                        padding: "10px",
                        border: "1px solid",
                        marginLeft: "10px",
                        marginBottom: "10px",
                        borderColor: isCurrentlyHappening ? "red" : "#ccc",
                      }}
                      key={a._id}
                    >
                      <h5>
                        {a.patient.first_name + " " + a.patient.last_name}
                      </h5>
                      <a>REFERENCE NO. {a.reference_num}</a>
                      <a>CLINIC: {a.clinic.clinic_code}</a>
                      <a>DATE: {format(a.date, "MMMM d, yyyy")}</a>
                      <a>
                        TIME:{" "}
                        {doctor.timeslots
                          .filter((t) => t._id === a.timeslot)
                          .map((ft) => ft.start + " - " + ft.end)}
                      </a>
                      <a>BOOKED AT: {format(a.createdAt, "MMMM d, yyyy")}</a>
                      <a> Patient Notes: {a.appointment_notes}</a>
                      <a>Contact Number: {a.patient.contact_num}</a>
                      <> </>
                      <Button
                        onClick={() => {
                          doneAppointment(a._id);
                        }}
                        sx={{
                          color: "white",
                          width: "100px",
                          backgroundColor: blueGrey[500],
                          alignSelf: "center",
                          marginTop: "10px",
                          borderRadius: "5px",
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        Done
                      </Button>
                      <div
                        className="d-flex flex-row mt-2 "
                        style={{ alignSelf: "center" }}
                      >
                        <Link
                          style={{
                            marginRight: "10px",
                            cursor: "pointer",
                            color: "Blue",
                            textDecoration: "none",
                          }}
                          to={`/reschedule-appointment/${a._id}`}
                        >
                          Reschedule{" "}
                        </Link>
                        <Link
                          style={{
                            cursor: "pointer",
                            color: "#FF0000",
                            textDecoration: "none",
                          }}
                          to={`/cancel-appointment/${a._id}`}
                        >
                          Cancel
                        </Link>
                      </div>
                    </Paper>
                  );
                })}
            </div>
          </TabPanel>

          <TabPanel value={value} index={2}>
            <div
              className="d-flex flex-wrap"
              style={{
                gap: "5px",
                overflowY: "auto",
                maxHeight: "85vh",
              }}
            >
              {appointments
                .filter(
                  (a) =>
                    a.appointmentStatus[0].status === "Completed" &&
                    format(a.date, "MMMM") === dateFilter
                )
                .map((a, index) => {
                  return (
                    <Paper
                      elevation={4}
                      className="appointments-container d-flex flex-column"
                      style={{
                        width: "300px",
                        height: "fit-content",
                        textAlign: "left",
                        padding: "10px",
                        border: "1px solid #ccc",
                        marginLeft: "10px",
                        marginBottom: "10px",
                      }}
                      key={a._id}
                    >
                      {" "}
                      <h5>
                        {a.patient.first_name + " " + a.patient.last_name}
                      </h5>
                      <a>REFERENCE NO. {a.reference_num}</a>
                      <a>CLINIC: {a.clinic.clinic_code}</a>
                      <a>DATE: {format(a.date, "MMMM d, yyyy")}</a>
                      <a>
                        TIME:{" "}
                        {doctor.timeslots
                          .filter((t) => t._id === a.timeslot)
                          .map((ft) => ft.start + " - " + ft.end)}
                      </a>
                      <a>BOOKED AT: {format(a.createdAt, "MMMM d, yyyy")}</a>
                      <a> Patient Notes: {a.appointment_notes}</a>
                      <a>Contact Number: {a.patient.contact_num}</a>
                      <> </>
                    </Paper>
                  );
                })}
            </div>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <div
              className="d-flex flex-wrap"
              style={{
                gap: "5px",
                overflowY: "auto",
                maxHeight: "85vh",
              }}
            >
              {appointments
                .filter(
                  (a) =>
                    a.appointmentStatus[0].status === "Cancelled" &&
                    format(a.date, "MMMM") === dateFilter
                )
                .map((a, index) => {
                  return (
                    <Paper
                      elevation={4}
                      className="appointments-container d-flex flex-column"
                      style={{
                        width: "300px",
                        height: "fit-content",
                        textAlign: "left",
                        padding: "10px",
                        border: "1px solid #ccc",
                        marginLeft: "10px",
                        marginBottom: "10px",
                      }}
                      key={a._id}
                    >
                      {" "}
                      <h5>
                        {a.patient.first_name + " " + a.patient.last_name}
                      </h5>
                      <a>REFERENCE NO. {a.reference_num}</a>
                      <a>CLINIC: {a.clinic.clinic_code}</a>
                      <a>DATE: {format(a.date, "MMMM d, yyyy")}</a>
                      <a>
                        TIME:{" "}
                        {doctor.timeslots
                          .filter((t) => t._id === a.timeslot)
                          .map((ft) => ft.start + " - " + ft.end)}
                      </a>
                      <a>BOOKED AT: {format(a.createdAt, "MMMM d, yyyy")}</a>
                      <a> Patient Notes: {a.appointment_notes}</a>
                      <a>Contact Number: {a.patient.contact_num}</a>
                      <> </>
                    </Paper>
                  );
                })}
            </div>
          </TabPanel>
        </SwipeableViews>
      </div>
    </div>
  );
};

export default DoctorAppointments;
