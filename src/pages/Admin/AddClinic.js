import React from "react";
import "../../App.css";
import { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { toast } from "react-toastify";

const AddClinic = () => {
  const [is_active, setIs_active] = useState("");
  const [detail, setDetail] = useState({
    clinic_code: "",
    floor: "",
    room: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setDetail({ ...detail, [name]: value });
  };

  const handleChange = (event) => {
    setIs_active(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(detail, is_active);
      if (!detail.clinic_code || !detail.floor || !detail.room) {
        toast.error("Complete the Details");
        return;
      }

      const newClinic = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/api/clinics/create`,
        data: {
          clinic_code: detail.clinic_code,
          floor: detail.floor,
          room: detail.room,
          is_active: is_active,
        },
      });
      console.log(newClinic.data);
      if (newClinic) {
        console.log(newClinic.data);
        toast.success("New Clinic Added");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
        window.location.reload();
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error("Request failed");
      }
    }
  };
  return (
    <>
      <div className="add-pages-container ml-5 mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
        <h3> Add Clinic</h3>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="clinic_code" className="form-label mt-4">
              Clinic Code
            </label>
            <input
              type="text"
              className="form-control"
              id="clinic_code"
              name="clinic_code"
              onChange={handleInput}
              value={detail.clinic_code}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Name" className="form-label mt-4">
              Floor
            </label>
            <input
              type="text"
              className="form-control"
              id="floor_number"
              name="floor"
              onChange={handleInput}
              value={detail.floor}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Name" className="form-label mt-4">
              Room
            </label>
            <input
              type="text"
              className="form-control"
              id="room"
              name="room"
              onChange={handleInput}
              value={detail.room}
            />
          </div>
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

export default AddClinic;
