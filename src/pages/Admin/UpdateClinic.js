import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Edit from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import Back from "../../components/BackButton";

const UpdateClinic = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [detail, setDetail] = useState({
    clinic_code: "",
    floor: "",
    room: "",
  });
  const [is_active, setIs_active] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setDetail({ ...detail, [name]: value });
    setHasChanges(true);
  };

  const handleChange = (event) => {
    setIs_active(event.target.value);
    setHasChanges(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clinicResponse = await axios.get(
          "http://localhost:8080/api/clinics/" + id
        );

        const clinic = clinicResponse.data;
        console.log(clinic);
        setDetail({
          ...detail,
          clinic_code: clinic.clinic_code,
          floor: clinic.floor,
          room: clinic.room,
        });
        setIs_active(clinic.is_active);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const update = await axios({
        method: "PUT",
        url: `http://localhost:8080/api/clinics/${id}`,
        data: {
          clinic_code: detail.clinic_code,
          floor: detail.floor,
          room: detail.room,
          is_active: is_active,
        },
      });
      if (update) {
        console.log(update.data);
        await toast.success(`Clinic ${detail.clinic_code} successfuly updated`);
        navigate("/clinics");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error("Request failed");
      }
    }
  };

  return (
    <>
      <div>
        <Back text={"BACK "} />{" "}
      </div>
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
              value={detail.clinic_code}
              onChange={handleInput}
              name="clinic_code"
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
              value={detail.floor}
              onChange={handleInput}
              name="floor"
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
              value={detail.room}
              onChange={handleInput}
            />
          </div>
          <div></div>
          <Box sx={{ width: "200px", marginTop: "20px" }}>
            <FormControl fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                sx={{ marginTop: "2px" }}
              >
                Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={is_active}
                label="Status"
                onChange={handleChange}
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

export default UpdateClinic;
