import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import { Menu } from "@mui/material";
import { format } from "date-fns";

const AddAppointment = () => {
  const { user } = useContext(AuthContext);
  const [otherFields, setOtherFields] = useState({
    date: "",
    timeslot: "",
    start: "",
    end: "",
    appointment_notes: "",
  });
  const [patient, setPatient] = useState({
    first_name: "",
    last_name: "",
    contact_num: "",
    date_of_birth: "",
    gender: "",
    contact_person: "",
    contact_p_number: "",
  });
  const [clinic, setClinic] = useState({
    clinic_id: "",
    clinic_code: "",
  });
  const [doctor, setDoctor] = useState({
    doctor_id: "",
    doctor_first_name: "",
    doctor_last_name: "",
  });

  const [clinicOpttions, setClinicOptions] = useState([]);
  const [chosenDate, setChosenDate] = useState();
  const [timeslots, setTimeSlots] = useState([]);

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
            const errorMessage = err.response.data.message;
            toast.error(errorMessage);
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
  }, [otherFields.date, chosenDate]);
  console.log(timeslots);

  const handlePatient = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handlePatientDob = (e) => {
    setPatient({ ...patient, date_of_birth: e.$d.toISOString() });
  };

  const handleGender = (e) => {
    setPatient({ ...patient, gender: e.target.value });
  };

  const handleTimeslot = (e) => {
    const selectedTime = e.target.value;
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
    setClinic({
      ...clinic,
      clinic_id: timeslotData.clinic_id,
      clinic_code: timeslotData.clinic_code,
    });
  };

  const handleDate = (e) => {
    setOtherFields({ ...otherFields, date: e.$d.toISOString() });
    setChosenDate(e.$d.toISOString());
  };
  console.log("chosen date: ", chosenDate);

  // console.log(patient);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const appointmentData = {
      date: otherFields.date,
      timeslot: {
        id: otherFields.timeslot,
        start: otherFields.start,
        end: otherFields.end,
      },
      appointment_notes: otherFields.appointment_notes,
      patient: {
        first_name: patient.first_name,
        last_name: patient.last_name,
        contact_num: patient.contact_num,
        date_of_birth: patient.date_of_birth,
        gender: patient.gender,
        contact_person: patient.contact_person,
        contact_p_number: patient.contact_p_number,
      },
      clinic: { clinic_id: clinic.clinic_id, clinic_code: clinic.clinic_code },
      doctor: {
        doctor_id: user._id,
        doctor_first_name: user.first_name,
        doctor_last_name: user.last_name,
      },
    };

    try {
      const appointment = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/api/appointments/create`,
        data: appointmentData,
      });

      if (appointment.data) {
        toast.info(appointment.data.message, { autoClose: false });
        console.log(appointment.data);
        try {
          const textSMS = await axios({
            method: "POST",
            url: `${process.env.REACT_APP_SERVER_URL}/api/sms/send-sms`,
            data: {
              phoneNumber: patient.contact_num,
              message: `Good day Mr/Ms. ${
                patient.first_name
              }! You have an appointment with Dr. ${user.last_name} at Clinic ${
                clinic.clinic_code
              }, on ${format(appointmentData.date, "MMMM d, yyy")} at ${
                otherFields.start + " - " + otherFields.end
              }. We are hoping to see you!`,
              sender_id: doctor._id,
            },
          });
          if (textSMS.data) {
            toast.success("Text notification sent!");
          }
        } catch (error) {
          toast.error(error.response.data.error);
        }
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error;
        toast.error(errorMessage, { autoClose: false });
      }
    }

    console.log("Appointment: ", appointmentData);
  };
  return (
    <div className="mt-3">
      <h3>New appointment</h3>
      <div
        className="mt-5"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="mt-3 d-flex flex-row row justify-content-between col-10">
          <div className="col-auto">
            <Paper elevation={5} sx={{ padding: "20px", width: "fit-content" }}>
              <a style={{ fontWeight: "bold", fontSize: "20px" }}>
                Time Details
              </a>
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
                    <DatePicker onChange={handleDate} />
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
                      {timeslots && timeslots.bookable
                        ? timeslots.bookable.map((ts) => (
                            <MenuItem
                              key={ts.timeslot_id}
                              value={ts.timeslot_id}
                              disabled={!ts.is_available}
                            >
                              <div className="row justify-content-between">
                                <b className="col-auto">
                                  {ts.start + " - " + ts.end}
                                </b>
                                <p className="col-auto">
                                  Clinic {ts.clinic_code}
                                </p>
                              </div>
                            </MenuItem>
                          ))
                        : "No available schedule for that date"}
                    </Select>
                  </FormControl>
                </Box>
              </div>
            </Paper>
            <div className="mt-5">
              <Paper
                elevation={5}
                sx={{ padding: "20px", width: "fit-content" }}
              >
                <a style={{ fontWeight: "bold", fontSize: "20px" }}>
                  Other Details
                </a>
                <div
                  className="form-group d-flex flex-column mt-3"
                  style={{ width: "400px" }}
                >
                  <TextField
                    id="standard-basic"
                    label="Add note (optional)"
                    variant="standard"
                    value={otherFields.appointment_notes}
                    name="appointment_notes"
                    onChange={(e) => {
                      setOtherFields({
                        ...otherFields,
                        appointment_notes: e.target.value,
                      });
                    }}
                  />
                </div>
              </Paper>
            </div>
          </div>
          <div className="col-auto">
            <Paper elevation={5} sx={{ padding: "20px", width: "fit-content" }}>
              <a style={{ fontWeight: "bold", fontSize: "20px" }}>
                Patient Details
              </a>
              <div
                className="form-group d-flex flex-column mt-3"
                style={{ width: "400px" }}
              >
                <TextField
                  id="standard-basic"
                  label="First Name"
                  variant="standard"
                  onChange={handlePatient}
                  value={patient.first_name}
                  name="first_name"
                />
                <TextField
                  id="standard-basic"
                  label="Last Name"
                  variant="standard"
                  onChange={handlePatient}
                  value={patient.last_name}
                  name="last_name"
                />
                <TextField
                  id="standard-basic"
                  label="Contact Number (+63 9** *** ****)"
                  placeholder="+63 9** *** ****"
                  variant="standard"
                  onChange={handlePatient}
                  value={patient.contact_num}
                  name="contact_num"
                />
                <div className="mt-3">
                  <DatePicker
                    label="Date of birth"
                    onChange={handlePatientDob}
                  />
                </div>
                <Box sx={{ width: "200px" }}>
                  <FormControl fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{ marginTop: "20px" }}
                    >
                      Sex
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={patient.gender}
                      onChange={handleGender}
                      sx={{ marginTop: "20px" }}
                    >
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <TextField
                  id="standard-basic"
                  label="Contact Person"
                  variant="standard"
                  onChange={handlePatient}
                  value={patient.contact_person}
                  name="contact_person"
                />
                <TextField
                  id="standard-basic"
                  label="Contact Person Number"
                  variant="standard"
                  onChange={handlePatient}
                  value={patient.contact_p_number}
                  name="contact_p_number"
                />
              </div>
            </Paper>
          </div>
        </div>
      </div>
      <div className="mt-3" style={{ position: "fixed", left: "87%" }}>
        <Button
          sx={{ color: "Black", marginTop: "10px", border: "2px solid black" }}
          variant="outlined"
          onClick={handleSubmit}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default AddAppointment;
