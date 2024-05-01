import React, { useContext, useEffect } from "react";
import { Days } from "../../constants/Schedule";
import AuthContext from "../../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import Chip from "@mui/material/Chip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const EditDoctorProfile = () => {
  const { user } = useContext(AuthContext);
  const { setUser } = useContext(AuthContext);
  const { setIsDoctorLoggedin } = useContext(AuthContext);
  // const { specializations } = useContext(AuthContext);
  // const { clinics } = useContext(AuthContext);
  const userType = user && user.userType;
  const navigate = useNavigate();
  const [weeklySched, setWeeklySched] = useState([
    { day: "", start: "", end: "" },
  ]);
  const [days, setDays] = useState(Days);
  const [specializations, setSpecializations] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [is_active, setIs_active] = useState("");
  const [changePass, setChangePass] = useState(false);
  const [detail, setDetail] = useState({
    username: "",
    password: "",
    last_name: "",
    first_name: "",
    dob: "",
    default_appt_duration: "",
    phone_number: "",
    email: "",
    is_active: "",
    clinics: [],
    specializations: [],
    appointments: [],
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const logout = async () => {
    await setUser(null);
    await setIsDoctorLoggedin(false);
    localStorage.clear();
    navigate("/");
    toast.success("Logged out");
  };

  let hasSixChar = detail.newPassword.length >= 6;
  let hasLowerChar = /(.*[a-z].*)/.test(detail.newPassword);
  let hasUpperChar = /(.*[A-Z].*)/.test(detail.newPassword);
  let hasNumber = /(.*[0-9].*)/.test(detail.newPassword);
  let hasSpecialChar = /(.*[^a-zA-Z0-9].*)/.test(detail.newPassword);

  useEffect(() => {
    setDetail({
      ...detail,
      first_name: user.first_name,
      last_name: user.last_name,
      dob: user.dob && format(user.dob, "yyyy-MM-dd"),
      bio: user.bio,
      phone_number: user.phone_number,
      email: user.email,
      default_appt_duration: user.default_appt_duration,
      specializations: user.specializations,
      clinics: user.clinics,
    });
    setIs_active(user.is_active);
    // console.log(clinics?.map((c) => c.clinic_code));
    console.log(detail);
    // console.log(doctor);
  }, []);
  // console.log(detail.specializations);
  // console.log(specializations);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const spn = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/specializations/`
        );
        setSpecializations(spn.data);
      } catch (e) {
        console.log(e);
      }
      try {
        const clinicsData = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/clinics/`
        );
        setClinics(clinicsData.data);
      } catch (error) {
        console.log(error);
      }
    };
    // getSpecializationName();
    fetchData();
  }, []);
  // console.log(dbClinics.map((c) => c.clinic_code));

  // codes to retrieve the specialty name from the spe_id STARTS here >>
  const initial_specs = detail.specializations;
  const spec_ids = initial_specs?.map((s) => s.spe_id);
  const specsFromDB = specializations.filter((dbs) =>
    spec_ids?.includes(dbs._id)
  );
  // console.log(detail.specializations);
  // END

  // codes to retrieve the clinic code from the clinic_id STARTS here >>
  const initial_clinics = detail.clinics;
  // console.log(detail.clinics);
  const clinic_ids = initial_clinics?.map((c) => c.clinic_id);
  const clinicsFromDB = clinics?.filter((dbs) => clinic_ids?.includes(dbs._id));
  // console.log(clinicsFromDB);
  // console.log(clinicsFromDB.map((c) => c.clinic_code));
  // END

  const handleInput = (e) => {
    const { name, value } = e.target;
    setDetail({ ...detail, [name]: value });
  };
  const handleChange = (event) => {
    setIs_active(event.target.value);
  };

  const handleSpecializations = (e, value) => {
    const id = value?.map((spe_name) => {
      const selectedOption = specializations.find(
        (option) => option.specialty_name === spe_name
      );
      // console.log(value);
      return selectedOption ? selectedOption._id : "no";
    });
    const specializationObjects = id?.map((spe_id) => ({ spe_id }));
    console.log(id);
    setDetail({ ...detail, specializations: specializationObjects });
  };
  // console.log(clinics?.map((c) => c.clinic_code));

  const handleClinics = (e, value) => {
    const id = value.map((c_code) => {
      const selectedOption = clinics.find(
        (option) => option.clinic_code === c_code
      );
      // console.log(value);
      return selectedOption ? selectedOption._id : null;
    });
    const clinicObjects = id?.map((clinic_id) => ({ clinic_id }));
    setDetail({ ...detail, clinics: clinicObjects });
    // console.log(id);
  };
  // console.log(clinics.map((c) => c.clinic_code));
  const handleDays = (index, v) => {
    console.log(v);
    const updatedSchedule = [...weeklySched];
    // the number value of day is stored to the weekly schedule "days" attribute as array
    updatedSchedule[index].day = v.value;
    setWeeklySched(updatedSchedule);
    console.log(updatedSchedule);
  };

  const handleWeeklySchedInput = (index, event) => {
    const { name, value } = event.target;
    const updateSchedule = [...weeklySched];
    updateSchedule[index][name] = value;
    setWeeklySched(updateSchedule);
  };

  const handleAddSchedule = () => {
    // removes the already selected days from the autocomplete options
    // const selectedDays = weeklySched.flatMap((entry) => entry.day);
    // const unselectedDays = Days.filter(
    //   (day) => !selectedDays.includes(day.value)
    // );
    // setDays(unselectedDays);
    // stores the forms input to the weeklySched state variable
    setWeeklySched([...weeklySched, { day: "", start: "", end: "" }]);
  };

  const handleRemoveSchedule = (index) => {
    const updatedSchedule = [...weeklySched];
    updatedSchedule.splice(index, 1);
    setWeeklySched(updatedSchedule);
    console.log(updatedSchedule);
  };

  const clearExistingOH = async () => {
    try {
      const clearedOH = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_SERVER_URL}/api/doctors/${user._id}`,
        data: { operating_hours: [], timeslots: [] },
      });
      console.log(clearedOH.data);
      if (clearedOH) {
        // console.log(newDoctor.data);
        toast.success("OPERATING HOURS CLEARED");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
        // window.location.reload();
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error("Request failed");
      }
    }
  };

  const handleSetOperatingHours = async (e) => {
    e.preventDefault();
    try {
      console.log("weekly sched", weeklySched);
      if (!weeklySched && Object.keys(weeklySched.days).length === 0) {
        toast.error("Please fill out the operating hours");
        return;
      }

      const operatingHours = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_SERVER_URL}/api/doctors/${user._id}`,
        data: {
          operating_hours: weeklySched,
        },
      });

      console.log(operatingHours.data);

      await console.log(weeklySched);
      // console.log(user._id);
      const doctor_data = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/doctors/${user._id}`
      );
      console.log(doctor_data.data.operating_hours);

      if (operatingHours) {
        // console.log(newDoctor.data);
        toast.success("OPERATING HOURS SAVED");
      }

      // console.log(operatingHours.data);
    } catch (error) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
        // window.location.reload();
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error("Request failed");
      }
    }
  };

  // console.log(weeklySched);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      detail.newPassword &&
      (!hasLowerChar || !hasUpperChar || !hasNumber || !hasSixChar)
    ) {
      toast.error("New Password does not meet the criteria.");
      return;
    }

    const data = {
      last_name: detail.last_name,
      first_name: detail.first_name,
      dob: detail.dob,
      bio: detail.bio,
      default_appt_duration: detail.default_appt_duration,
      phone_number: detail.phone_number,
      email: detail.email,
      is_active: is_active,
      specializations: detail.specializations,
      clinics: detail.clinics,
      confirmPassword: detail.confirmPassword,
      password: detail.password,
      newPassword: detail.newPassword,
    };
    try {
      const newDoctor = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_SERVER_URL}/api/doctors/${user._id}`,
        data: data,
      });

      if (data.newPassword && newDoctor.data) {
        logout();
      }

      if (newDoctor) {
        // console.log(newDoctor.data);
        toast.success("CHANGES SAVED");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
        // window.location.reload();
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error("Request failed");
      }
    }
    console.log(data);
  };
  return (
    <>
      <h3 className="mt-3" style={{ position: "fixed" }}>
        {" "}
        Edit Information
      </h3>

      <div className="d-flex flex-row">
        <div className="add-pages-container ml-5 mt-5  mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="clinic_code" className="form-label mt-4">
                First Name
              </label>
              <input
                required
                type="text"
                className="form-control"
                id="first_name"
                name="first_name"
                onChange={handleInput}
                value={detail.first_name}
              />
            </div>
            <div className="form-group">
              <label htmlFor="clinic_code" className="form-label mt-2">
                Last Name
              </label>
              <input
                required
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                onChange={handleInput}
                value={detail.last_name}
              />
            </div>
            <div className="form-group">
              <label htmlFor="clinic_code" className="form-label mt-2">
                Date of Birth
              </label>
              <input
                type="Date"
                className="form-control"
                id="dob"
                name="dob"
                onChange={handleInput}
                value={detail.dob}
              />
            </div>
            <div className="form-group">
              <label htmlFor="clinic_code" className="form-label mt-2">
                Bio
              </label>
              <input
                type="text"
                className="form-control"
                id="bio"
                name="bio"
                onChange={handleInput}
                value={detail.bio}
              />
            </div>

            <div className="form-group">
              <label htmlFor="clinic_code" className="form-label mt-2">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="phone_number"
                name="phone_number"
                onChange={handleInput}
                value={detail.phone_number}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Name" className="form-label mt-2">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                onChange={handleInput}
                value={detail.email}
                label="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="Name" className="form-label mt-2">
                Default Appointments Duration
              </label>
              <input
                type="text"
                className="form-control"
                id="duration"
                name="default_appt_duration"
                onChange={handleInput}
                value={detail.default_appt_duration}
                label="email"
                placeholder="in minutes"
              />
            </div>
            <div className="mt-3">
              <Autocomplete
                multiple
                limitTags={2}
                id="multiple-limit-tags"
                options={clinics.map((c) => c.clinic_code)}
                onChange={handleClinics}
                value={clinicsFromDB.map((c) => c.clinic_code)}
                inputValue=""
                renderInput={(params) => (
                  <TextField {...params} label="Clinics" placeholder="Choose" />
                )}
                sx={{ width: "485px" }}
                // value={detail.specializations?.map((s) => s.specialty_name)}
              />
            </div>
            <div className="mt-3">
              <Autocomplete
                multiple
                limitTags={2}
                id="multiple-limit-tags"
                options={specializations.map((s) => s.specialty_name)}
                onChange={handleSpecializations}
                value={specsFromDB?.map((sn) => sn.specialty_name)}
                inputValue=""
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Specializations"
                    placeholder="Choose"
                  />
                )}
                sx={{ width: "485px" }}
              />
            </div>

            <div className="mt-3"></div>

            <div></div>
            <Box sx={{ width: "200px" }}>
              <FormControl fullWidth>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{ marginTop: "20px" }}
                >
                  Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={is_active}
                  label="Status"
                  onChange={handleChange}
                  sx={{ marginTop: "20px" }}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <input
              type="submit"
              value="SAVE"
              className="btn btn-primary mt-3"
              style={{ position: "fixed", top: "1%", right: "5%" }}
            />
          </form>
        </div>
        <div className="d-flex flex-column mt-5">
          <div className="mt-5" style={{ marginLeft: "30px", width: "400px" }}>
            <Button
              sx={{
                color: "black",
                outline: "black",
                border: "1px solid black",
                marginTop: "10px",
              }}
              variant="outlined"
              onClick={() => {
                setChangePass(true);
              }}
            >
              Change Password
            </Button>
            {changePass && (
              <Button
                sx={{
                  color: "red",
                  outline: "red",
                  border: "1px solid red",
                  marginTop: "10px",
                  left: "5%",
                }}
                variant="outlined"
                onClick={() => {
                  setChangePass(false);
                }}
              >
                Cancel
              </Button>
            )}
            {changePass && (
              <div>
                <div className="form-group">
                  <label htmlFor="passwordInput" className="form-label mt-2">
                    Old Password
                  </label>
                  <input
                    className="form-control"
                    id="passwordInput"
                    name="password"
                    value={detail.password}
                    onChange={handleInput}
                    placeholder="enter old password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="passwordInput" className="form-label mt-2">
                    New Password
                  </label>
                  <input
                    className="form-control"
                    id="passwordInput"
                    name="newPassword"
                    value={detail.newPassword}
                    onChange={handleInput}
                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}"
                    title="Password must contain at least 6 characters, including at least one uppercase letter, one lowercase letter, and one number."
                    placeholder="enter new password"
                    minLength={6}
                    required
                  />
                  {detail.newPassword && (
                    <div className="strict ml-1 mt-2" style={{ columns: 2 }}>
                      <div>
                        {hasSixChar ? (
                          <span className="text-success">
                            <CheckCircleIcon
                              className="mr-1"
                              fontSize="small"
                            />
                            <small>at least 6 characters</small>
                          </span>
                        ) : (
                          <span className="text-danger">
                            <CancelIcon className="mr-1" fontSize="small" />
                            <small>at least 6 characters</small>
                          </span>
                        )}
                      </div>
                      <div>
                        {hasLowerChar ? (
                          <span className="text-success">
                            <CheckCircleIcon
                              className="mr-1"
                              fontSize="small"
                            />
                            <small>one lowercase</small>
                          </span>
                        ) : (
                          <span className="text-danger">
                            <CancelIcon className="mr-1" fontSize="small" />
                            <small>one lowercase</small>
                          </span>
                        )}
                      </div>
                      <div>
                        {hasUpperChar ? (
                          <span className="text-success">
                            <CheckCircleIcon
                              className="mr-1"
                              fontSize="small"
                            />
                            <small>one uppercase</small>
                          </span>
                        ) : (
                          <span className="text-danger">
                            <CancelIcon className="mr-1" fontSize="small" />
                            <small>one uppercase</small>
                          </span>
                        )}
                      </div>
                      <div>
                        {hasNumber ? (
                          <span className="text-success">
                            <CheckCircleIcon
                              className="mr-1"
                              fontSize="small"
                            />
                            <small>one number</small>
                          </span>
                        ) : (
                          <span className="text-danger">
                            <CancelIcon className="mr-1" fontSize="small" />
                            <small>one number</small>
                          </span>
                        )}
                      </div>
                      <div>
                        {hasSpecialChar ? (
                          <span className="text-success">
                            <CheckCircleIcon
                              className="mr-1"
                              fontSize="small"
                            />
                            <small>one special symbol</small>
                          </span>
                        ) : (
                          <span className="text-danger">
                            <CancelIcon className="mr-1" fontSize="small" />
                            <small>one special symbol</small>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label mt-4">
                    Confirm Password
                  </label>
                  <input
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={detail.confirmPassword}
                    onChange={handleInput}
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                    title="Password must be at least 6 characters, and contain at least one number, one lowercase and one uppercase letter."
                    placeholder="confirm new password"
                  />
                </div>
              </div>
            )}

            <div className="mt-3">
              <Button
                onClick={clearExistingOH}
                sx={{
                  color: "red",
                  marginTop: "10px",
                  padding: "0",
                  textTransform: "none",
                  textDecoration: "underline",
                }}
              >
                Clear Existing Operating Hours
              </Button>
              <div>
                <h5 htmlFor="clinic_code" className="form-label mt-2">
                  Edit Operating Hours
                </h5>
                <div className="form-group mt-2">
                  {weeklySched.map((entry, index) => (
                    <div key={index}>
                      <Autocomplete
                        id="combo-box-demo"
                        options={days}
                        onChange={(e, v) => handleDays(index, v)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Days"
                            placeholder="Choose"
                          />
                        )}
                      />

                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="HH:mm AM/PM"
                        id="start"
                        name="start"
                        label="start"
                        onChange={(e) => handleWeeklySchedInput(index, e)}
                        value={entry.start}
                      />
                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="HH:mm AM/PM"
                        id="end"
                        name="end"
                        label="start"
                        onChange={(e) => handleWeeklySchedInput(index, e)}
                        value={entry.end}
                      />
                      {weeklySched.length > 1 && (
                        <Button
                          onClick={() => {
                            handleRemoveSchedule(index);
                          }}
                          sx={{ color: "red" }}
                        >
                          Remove Schedule
                        </Button>
                      )}
                    </div>
                  ))}
                  {weeklySched.every(
                    (entry) => entry.day !== 0 > 0 && entry.start && entry.end
                  ) && <Button onClick={handleAddSchedule}>Add</Button>}
                  {weeklySched && (
                    <Button
                      onClick={handleSetOperatingHours}
                      value="set Operating Hours"
                      sx={{ color: "blue", marginTop: "10px" }}
                      variant="outlined"
                    >
                      Set Operating Hours
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className="d-flex flex-column"
            style={{ position: "fixed", top: "80%", left: "80%" }}
          >
            <Button
              onClick={() => {
                navigate("/edit-schedule");
              }}
              className="mt-5"
              sx={{
                color: "black",
                outline: "black",
                border: "1px solid black",
              }}
              variant="filled"
            >
              EDIT SCHEDULE
            </Button>
            <span>Click here to edit schedule</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditDoctorProfile;
