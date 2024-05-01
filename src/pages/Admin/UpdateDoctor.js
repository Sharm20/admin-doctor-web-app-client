import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import Delete from "../../components/Delete";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

const UpdateDoctor = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState({});
  const [specializations, setSpecializations] = useState([]);
  const [is_active, setIs_active] = useState("");
  const [detail, setDetail] = useState({
    last_name: "",
    first_name: "",
    dob: "",
    default_appt_duration: "",
    phone_number: "",
    email: "",
    is_active: "",
    specializations: [],
    clinics: [],
    appointments: [],
  });

  // const [selectedDays, setSelectedDays] = useState(Days);

  const [clinics, setClinics] = useState([]);
  const [dClinics, setDClinics] = useState([]);
  const [dSpecs, setDSpecs] = useState([]);
  // const [days, setDays] = useState(Days);

  useEffect(() => {
    const fetchData = async () => {
      console.log(id);
      try {
        const doctorResponse = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/doctors/` + id
        );
        const doctor = doctorResponse.data.doctor;
        const specializations = doctorResponse.data.specializations;
        const clinics = doctorResponse.data.clinics;
        setDClinics(clinics);
        setDSpecs(specializations);
        setDoctor(doctor);
        console.log(doctor);
        setDetail({
          ...detail,
          first_name: doctor.first_name,
          last_name: doctor.last_name,
          dob: doctor.dob && format(doctor.dob, "yyyy-MM-dd"),
          bio: doctor.bio,
          default_appt_duration: doctor.default_appt_duration,
          phone_number: doctor.phone_number,
          email: doctor.email,
          clinics: doctor.clinics,
          specializations: doctor.specializations,
        });
        setIs_active(doctor.is_active);

        // console.log(doctor.specializations);
        // console.log(doctor);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  // console.log(detail.specializations);
  console.log(dSpecs);
  console.log(detail.clinics);
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

  // codes to retrieve the specialty name from the spe_id STARTS here >>
  const initial_specs = detail.specializations;
  const spec_ids = initial_specs?.map((s) => s.spe_id);
  const specsFromDB = specializations.filter((dbs) =>
    spec_ids?.includes(dbs._id)
  );
  console.log(detail.specializations);
  // END

  // codes to retrieve the clinic code from the clinic_id STARTS here >>
  const initial_clinics = detail.clinics;
  console.log(detail.clinics);
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
    const id = value.map((spe_name) => {
      const selectedOption = specializations.find(
        (option) => option.specialty_name === spe_name
      );
      console.log(value);
      return selectedOption ? selectedOption._id : "no";
    });
    const specializationObjects = id?.map((spe_id) => ({ spe_id }));
    // console.log(id);
    setDetail({
      ...detail,
      specializations: specializationObjects,
    });
  };

  const handleClinics = (e, value) => {
    const id = value.map((c_code) => {
      const selectedOption = clinics.find(
        (option) => option.clinic_code === c_code
      );
      console.log(value);
      return selectedOption ? selectedOption._id : null;
    });
    const clinicObjects = id?.map((clinic_id) => ({ clinic_id }));
    setDetail({ ...detail, clinics: clinicObjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    };
    try {
      const newDoctor = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_SERVER_URL}/api/doctors/${id}`,
        data: data,
      });

      if (newDoctor) {
        console.log(newDoctor.data);
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
      <div className="add-pages-container ml-5 mt-4 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
        <h3> Update Dr. {doctor.last_name}'s Info</h3>
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
          <div className="mt-3">
            <Autocomplete
              multiple
              limitTags={2}
              id="multiple-limit-tags"
              options={clinics.map((s) => s.clinic_code)}
              value={clinicsFromDB?.map((c) => c.clinic_code)}
              inputValue=""
              onChange={handleClinics}
              renderInput={(params) => (
                <TextField {...params} label="Clinics" placeholder="Choose" />
              )}
              sx={{ width: "485px" }}
            />
          </div>
          <div className="mt-3"></div>
          <div className="mt-3">
            <Autocomplete
              multiple
              // limitTags={2}
              id="multiple-limit-tags"
              options={specializations?.map((s) => s.specialty_name)}
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
              // value={detail.specializations?.map((s) => s.specialty_name)}
            />
          </div>

          {/* <div className="form-group">
            <DynamicInput />{" "}
          </div> */}

          <div className="d-flex flex-row row justify-content-between">
            <div className="col-auto">
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
              </Box>{" "}
            </div>
            <div className="col-auto mt-3">
              <Delete id={id} endpoint={"doctors"} />
            </div>
          </div>

          <input type="submit" value="SAVE" className="btn btn-primary mt-3" />
        </form>
      </div>
    </>
  );
};

export default UpdateDoctor;
