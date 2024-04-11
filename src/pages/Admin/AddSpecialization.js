import React, { useState } from "react";
import "../../App.css";
import axios from "axios";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { toast } from "react-toastify";
const AddSpecialization = () => {
  const [is_active, setIs_active] = useState("");
  const [detail, setDetail] = useState({
    specialty_name: "",
    desc: "",
  });

  const handleChange = (event) => {
    setIs_active(event.target.value);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setDetail({ ...detail, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(detail);
      if (!detail.specialty_name || !detail.desc) {
        toast.error("Enter all fields");
      }

      const newSpecialization = await axios({
        method: "POST",
        url: "http://localhost:8080/api/specializations/create",
        data: {
          specialty_name: detail.specialty_name,
          desc: detail.desc,
          is_active: is_active,
        },
      });
      if (newSpecialization) {
        toast.success("New specialization added");
        console.log(newSpecialization.data);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else if (error.request) {
        toast.error("No response from the server");
      } else {
        toast.error("request Failed");
      }
      console.log(error);
    }
  };
  return (
    <>
      <div className="add-pages-container ml-5 mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
        <h3> Add Specialization</h3>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="specialty_name" className="form-label mt-2">
              Name of Specialization
            </label>
            <input
              type="text"
              className="form-control"
              id="specialty_name"
              name="specialty_name"
              onChange={handleInput}
              value={detail.specialty_name}
            />
          </div>
          <div className="form-group">
            <label htmlFor="desc" className="form-label mt-2">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="desc"
              name="desc"
              onChange={handleInput}
              value={detail.desc}
            />
          </div>
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

export default AddSpecialization;
