import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const UpdateSpecialization = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [hasChanges, setHasChanges] = useState(false);
  const [is_active, setIs_active] = useState("");
  const [detail, setDetail] = useState({
    specialty_name: "",
    desc: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const specializationsResponse = await axios.get(
          `http://localhost:8080/api/specializations/${id}`
        );
        const specialization = specializationsResponse.data;
        setDetail({
          ...detail,
          specialty_name: specialization.specialty_name,
          desc: specialization.desc,
        });
        setIs_active(specialization.is_active);
        console.log(specialization);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    setIs_active(event.target.value);
    setHasChanges(true);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setDetail({ ...detail, [name]: value });
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const update = await axios({
        method: "PUT",
        url: `http://localhost:8080/api/specializations/${id}`,
        data: {
          specialty_name: detail.specialty_name,
          desc: detail.desc,
          is_active: is_active,
        },
      });
      if (update) {
        await toast.success("Successfuly Updated!");
        console.log(update.data);
        navigate("/specializations");
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

          {hasChanges && (
            <input
              type="submit"
              value="SAVE"
              className="btn btn-primary mt-3"
            />
          )}
        </form>
      </div>
    </>
  );
};

export default UpdateSpecialization;
