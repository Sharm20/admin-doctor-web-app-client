import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Days } from "../../constants/Schedule";
import DynamicInput from "../../components/DynamicInput";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
const AddDoctor = () => {
  const [is_active, setIs_active] = useState("");
  const [detail, setDetail] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    last_name: "",
    first_name: "",
    dob: "",
    default_appt_duration: "",
    phone_number: "",
    email: "",
    is_active: "",
    specializations: [],
    appointments: [],
  });
  // const [selectedDays, setSelectedDays] = useState(Days);
  const [clinics, setClinics] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  // const [days, setDays] = useState(Days);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const spn = await axios.get(
          "http://localhost:8080/api/specializations/"
        );

        setSpecializations(spn.data);
      } catch (e) {
        console.log(e);
      }
      try {
        const clinicsData = await axios.get(
          "http://localhost:8080/api/clinics/"
        );
        setClinics(clinicsData.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  // console.log(options);
  const handleInput = (e) => {
    const { name, value } = e.target;
    setDetail({ ...detail, [name]: value });
  };
  const handleChange = (event) => {
    setIs_active(event.target.value);
  };

  const handleSpecializations = (e, value) => {
    const id = value.map((spe_name) => {
      const selectedOption = specializations.find(
        (option) => option.specialty_name === spe_name
      );
      console.log(value);
      return selectedOption ? selectedOption._id : "no";
    });
    const specializationObjects = id.map((spe_id) => ({ spe_id }));
    console.log(id);
    setDetail({ ...detail, specializations: specializationObjects });
  };

  const handleClinics = (e, value) => {
    const id = value.map((c_code) => {
      const selectedOption = clinics.find(
        (option) => option.clinic_code === c_code
      );
      console.log(value);
      return selectedOption ? selectedOption._id : null;
    });
    const clinicObjects = id.map((clinic_id) => ({ clinic_id }));
    setDetail({ ...detail, clinics: clinicObjects });
    console.log(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username: detail.username,
      password: detail.password,
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
    };

    try {
      if (detail.password !== detail.confirmPassword) {
        toast.error("Password do not match!");
      } else {
        const newDoctor = await axios({
          method: "POST",
          url: "http://localhost:8080/api/doctors/create",
          data: data,
        });

        if (newDoctor) {
          console.log(newDoctor.data);
          toast.success("New Doctor Added");
        }
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
      <div className="add-pages-container ml-5 mt-4 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
        <h3> Add Doctor</h3>
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
              Username
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="username"
              name="username"
              onChange={handleInput}
              value={detail.username}
            />
          </div>
          <div className="form-group">
            <label htmlFor="clinic_code" className="form-label mt-2">
              Password
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="password"
              name="password"
              onChange={handleInput}
              value={detail.password}
            />
          </div>
          <div className="form-group">
            <label htmlFor="clinic_code" className="form-label mt-2">
              Confirm Password
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              onChange={handleInput}
              value={detail.confirmPassword}
            />
          </div>
          <div className="form-group">
            <label htmlFor="clinic_code" className="form-label mt-2">
              Date of Birth
            </label>
            <input
              required
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
          <div className="mt-3">
            <Autocomplete
              multiple
              // limitTags={}
              id="multiple-limit-tags"
              options={clinics.map((s) => s.clinic_code)}
              onChange={handleClinics}
              renderInput={(params) => (
                <TextField {...params} label="Clinics" placeholder="Choose" />
              )}
              sx={{ width: "485px" }}
            />
          </div>
          <div className="mt-3">
            <Autocomplete
              multiple
              limitTags={2}
              id="multiple-limit-tags"
              options={specializations.map((s) => s.specialty_name)}
              onChange={handleSpecializations}
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
          {/* <div className="form-group">
            <DynamicInput />{" "}
          </div> */}

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

          <input type="submit" value="SAVE" className="btn btn-primary mt-3" />
        </form>
      </div>
    </>
  );
};

export default AddDoctor;
