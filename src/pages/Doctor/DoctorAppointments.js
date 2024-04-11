import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import AppointmentActions from "../../components/AppointmentActions";
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
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
// import { Dialog } from "@mui/material";

const DoctorAppointments = () => {
  const [changeStatus, setChangeStatus] = useState(false);
  const [doctor, setDoctor] = useState({});
  const [appointments, setAppointments] = useState([]);
  const { user } = useContext(AuthContext);
  const [value, setValue] = useState(0);
  const [openModals, setOpenModals] = useState(
    Array(4).fill(Array(appointments.length).fill(false))
  );

  useEffect(() => {
    if (user && user._id) {
      try {
        const socket = new WebSocket(`ws://localhost:3001`);

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

  const acceptAppointment = async (id) => {
    try {
      const updatedApptStatus = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/api/appointment-status/add`,
        data: { appointment_id: id, status: "Confirmed" },
      });

      console.log(updatedApptStatus.data);
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

  const cancelAppointment = async (id) => {
    try {
      const updatedApptStatus = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/api/appointment-status/add`,
        data: { appointment_id: id, status: "Cancelled" },
      });

      // console.log(updatedApptStatus.data);
      if (updatedApptStatus) {
        toast.success("Appointment Cancelled!");
        setChangeStatus(true);
        // console.log(changeStatus);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  // console.log(doctor);
  // console.log(appointments);

  // styling and MUI components from here

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

  // setOpenModals(newOpenModals);

  return (
    <div className="mt-3">
      <div style={{ position: "fixed" }}>
        <h2>Doctor Appointments</h2>

        <ButtonGroup variant="text" sx={{ color: "black" }}></ButtonGroup>
        <AppBar sx={{ width: "500px", background: "none", marginTop: "10px" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            //   variant="fullWidth"
            aria-label="action tabs example"
          >
            <Tab label="Pending" {...a11yProps(0)} sx={{ color: "black" }} />
            <Tab label="Confirmed" {...a11yProps(1)} sx={{ color: "black" }} />
            <Tab label="Completed" {...a11yProps(2)} sx={{ color: "black" }} />
            <Tab label="Cancelled" {...a11yProps(3)} sx={{ color: "black" }} />
          </Tabs>
        </AppBar>
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
                // overflowY: "auto",
                maxHeight: "80vh",
                // minHeight: "1000px",
              }}
            >
              {appointments
                .filter((a) => a.appointmentStatus[0].status === "Pending")
                .map((a, index) => {
                  return (
                    <div
                      className="d-flex flex-column"
                      style={{
                        width: "300px",
                        height: "275px",
                        textAlign: "left",
                        padding: "20px",
                        boxShadow: "0 2px 2px",
                        borderRadius: "10px",
                        border: "1px solid black",
                        marginLeft: "10px",
                        marginBottom: "10px",
                      }}
                      key={a._id}
                    >
                      {" "}
                      <h5>
                        {a.patient.first_name + " " + a.patient.last_name}
                      </h5>
                      <a>{a.reference_num}</a>
                      <a>CLINIC: {a.clinic.clinic_code}</a>
                      <a>TIME: {a.timeslot}</a>
                      <a>BOOKED AT: {format(a.createdAt, "MMMM d, yyyy")}</a>
                      <a> Patient Notes: {a.appointment_notes}</a>
                      <> </>
                      <Button
                        onClick={() => {}}
                        sx={{
                          color: "white",
                          width: "100px",
                          backgroundColor: "#2C7865",
                          alignSelf: "center",
                          marginTop: "10px",
                        }}
                      >
                        Accept
                      </Button>
                      <div
                        className="d-flex flex-row mt-4"
                        style={{ alignSelf: "center" }}
                      >
                        <p
                          style={{
                            marginRight: "10px",
                            cursor: "pointer",
                            color: "blue",
                          }}
                        >
                          Reschedule{" "}
                        </p>
                        <Link
                          style={{ cursor: "pointer", color: "red" }}
                          to={`/cancel-appointment/${a._id}`}
                        >
                          Cancel
                        </Link>
                        {/* <p
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => {
                            cancelAppointment(a._id);
                          }}
                        >
                          Cancel
                        </p> */}
                      </div>
                    </div>
                  );
                })}
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <div
              className="d-flex flex-wrap"
              style={{
                gap: "5px",
                overflowY: "auto",
                maxHeight: "calc(120vh - 300px)",
              }}
            >
              {appointments
                .filter((a) => a.appointmentStatus[0].status === "Confirmed")
                .map((a, index) => {
                  return (
                    <div
                      className="d-flex flex-column"
                      style={{
                        width: "275px",
                        height: "275px",
                        textAlign: "left",
                        padding: "20px",
                        boxShadow: "0 2px 2px",
                        borderRadius: "10px",
                        border: "1px solid black",
                        marginLeft: "10px",
                      }}
                      key={a._id}
                    >
                      <h5>
                        {a.patient.first_name + " " + a.patient.last_name}
                      </h5>
                      <a>{a.reference_num}</a>
                      <a>CLINIC: {a.clinic.clinic_code}</a>
                      <a>TIME: {a.timeslot}</a>
                      <a>BOOKED AT: {format(a.createdAt, "MMMM d, yyyy")}</a>
                      <a> Patient Notes: {a.appointment_notes}</a>
                      <> </>
                      <div
                        className="d-flex flex-row mt-4"
                        style={{ alignSelf: "center" }}
                      >
                        <p
                          style={{
                            marginRight: "10px",
                            cursor: "pointer",
                            color: "blue",
                          }}
                        >
                          Reschedule{" "}
                        </p>
                        <Link to={`/cancel-appointment/${a._id}`}>Cancel</Link>
                      </div>
                    </div>
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
                maxHeight: "calc(120vh - 300px)",
              }}
            >
              {appointments
                .filter((a) => a.appointmentStatus[0].status === "Completed")
                .map((a, index) => {
                  return (
                    <div
                      className="d-flex flex-column"
                      style={{
                        width: "275px",
                        height: "275px",
                        textAlign: "left",
                        padding: "20px",
                        boxShadow: "0 2px 2px",
                        borderRadius: "10px",
                        border: "1px solid black",
                        marginLeft: "10px",
                      }}
                      key={a._id}
                    >
                      {" "}
                      <h5>
                        {a.patient.first_name + " " + a.patient.last_name}
                      </h5>
                      <a>{a.reference_num}</a>
                      <a>CLINIC: {a.clinic.clinic_code}</a>
                      <a>TIME: {a.timeslot}</a>
                      <a>BOOKED AT: {format(a.createdAt, "MMMM d, yyyy")}</a>
                      <a> Patient Notes: {a.appointment_notes}</a>
                      <> </>
                    </div>
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
                maxHeight: "calc(120vh - 300px)",
              }}
            >
              {appointments
                .filter((a) => a.appointmentStatus[0].status === "Cancelled")
                .map((a, index) => {
                  return (
                    <div
                      className="d-flex flex-column"
                      style={{
                        width: "275px",
                        height: "275px",
                        textAlign: "left",
                        padding: "20px",
                        boxShadow: "0 2px 2px",
                        borderRadius: "10px",
                        border: "1px solid black",
                        marginLeft: "10px",
                      }}
                      key={a._id}
                    >
                      {" "}
                      <h5>
                        {a.patient.first_name + " " + a.patient.last_name}
                      </h5>
                      <a>{a.reference_num}</a>
                      <a>CLINIC: {a.clinic.clinic_code}</a>
                      <a>TIME: {a.timeslot}</a>
                      <a>BOOKED AT: {format(a.createdAt, "MMMM d, yyyy")}</a>
                      <a> Patient Notes: {a.appointment_notes}</a>
                      <> </>
                      <Button
                        onClick={() => {
                          acceptAppointment(a._id);
                        }}
                        sx={{
                          color: "white",
                          width: "100px",
                          backgroundColor: "#2C7865",
                          alignSelf: "center",
                          marginTop: "10px",
                        }}
                      >
                        Accept
                      </Button>
                      <div
                        className="d-flex flex-row mt-4"
                        style={{ alignSelf: "center" }}
                      >
                        <p
                          style={{
                            marginRight: "10px",
                            cursor: "pointer",
                            color: "blue",
                          }}
                        >
                          Reschedule{" "}
                        </p>
                        <p style={{ cursor: "pointer", color: "red" }}>
                          Cancel
                        </p>
                      </div>
                    </div>
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
