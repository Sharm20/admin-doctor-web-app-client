import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { Days, getDayValue, getDayLabel } from "../../constants/Schedule";
import DynamicInput from "../../components/DynamicInput";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { getDate, getDay } from "date-fns";
import { da } from "date-fns/locale";

const EditSched = () => {
  const { user } = useContext(AuthContext);
  const [clinics, setClinics] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [weeklySched, setWeeklySched] = useState([
    { days: [], start: "", end: "" },
  ]);

  const [schedule, setSchedule] = useState([
    { clinic_id: "", day: "", walk_in: [], booking: [] },
  ]);
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [option, setOption] = useState([]);
  const [timeslots, setTimeslots] = useState([]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/doctors/${user._id}`
        );
        setDoctor(res.data.doctor);
        setClinics(res.data.clinics);
        console.log(res.data.doctor);
        const doctorData = res.data.doctor;
        // console.log(doctorData);
        const dayData = doctorData.operating_hours.map((oh) => oh.day);

        setDays(getDayLabel(dayData));
      } catch (error) {
        console.log(error);
      }
    };
    fetchDoctor();
  }, []);

  // console.log(days);
  // console.log(timeslots);

  // const clinic_ids = doctorClinics?.map((c) => c.clinic_id);
  // const clinicsFromDB = clinics?.filter((dbs) => clinic_ids?.includes(dbs._id));

  const handleSubmitSchedule = async (e) => {
    e.preventDefault();
    try {
      const data = { schedule: schedule };
      console.log(data);
      const updateSchedule = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_SERVER_URL}/api/doctors/${user._id}`,
        data: { schedule: schedule },
      });

      if (updateSchedule) {
        console.log(updateSchedule.data);
        toast.success("Schedule Set");
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

  const handleDays = async (index, v) => {
    console.log(v);
    const updatedSchedule = [...schedule];
    // the number value of day is stored to the weekly schedule "days" attribute
    updatedSchedule[index].day = getDayValue(v);
    await setSelectedDay(getDayValue(v));
    setSchedule(updatedSchedule);
    // console.log(updatedSchedule);
    renderTimeslotsOption(getDayValue(v));
  };
  const renderTimeslotsOption = async (selectedDay) => {
    const filteredTimeslots = doctor.timeslots.filter(
      (t) => t.day === selectedDay
    );
    console.log(filteredTimeslots.map((ft) => ft.day));
    setTimeslots(filteredTimeslots);
    console.log(selectedDay);
  };

  // const timeslotsMatch = doctor.timeslots.map((t) => t.day === selectedDay);

  const handleWalkinTimeslots = (index, v) => {
    const ids = v.map((t) => {
      const selectedslots = timeslots.find(
        (opt) => opt.start + " - " + opt.end === t
      );
      return selectedslots ? selectedslots._id : "undefined";
    });
    console.log(ids);
    const timeslotObjects = ids.map((timeslot_id) => ({
      timeslot_id,
      is_available: true,
    }));
    const updatedSchedule = [...schedule];
    updatedSchedule[index].walk_in = timeslotObjects;
    setSchedule(updatedSchedule);
    console.log(updatedSchedule);
  };

  const handleBookingTimeslots = (index, v) => {
    const ids = v.map((t) => {
      const selectedslots = timeslots.find(
        (opt) => opt.start + " - " + opt.end === t
      );
      return selectedslots ? selectedslots._id : "undefined";
    });
    console.log(ids);
    const timeslotObjects = ids.map((timeslot_id) => ({
      timeslot_id,
      is_available: true,
    }));
    const updatedSchedule = [...schedule];
    updatedSchedule[index].booking = timeslotObjects;
    setSchedule(updatedSchedule);
    console.log(updatedSchedule);
  };

  // console.log(schedule);
  const handleClinics = (index, v) => {
    const updatedSchedule = [...schedule];
    console.log(v);
    const clinicObject = clinics.find((c) => v.includes(c.clinic_code));
    // console.log(clinicObject);
    // the number value of day is stored to the weekly schedule "days" attribute as array
    updatedSchedule[index].clinic_id = clinicObject._id;
    setSchedule(updatedSchedule);
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
    const selectedDays = schedule.flatMap((entry) => entry.days);
    const unselectedDays = Days.filter(
      (day) => !selectedDays.includes(day.value)
    );
    // setDays(unselectedDays);
    // stores the forms input to the weeklySched state variable
    setSchedule([
      ...schedule,
      { clinic_id: "", day: "", walk_in: [], booking: [] },
    ]);
  };

  const handleRemoveSchedule = (index) => {
    const updatedSchedule = [...schedule];
    updatedSchedule.splice(index, 1);
    setWeeklySched(updatedSchedule);
    console.log(updatedSchedule);
  };

  return (
    <>
      <h3 className="mt-3"> EDIT DOCTOR SCHEDULE</h3>
      <div className="d-flex flex-column">
        <div className="add-pages-container ml-5 mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
          <div className="form-group">
            <label htmlFor="clinic_code" className="form-label mt-2">
              SCHEDULE
            </label>
            {schedule.map((entry, index) => (
              <div key={index}>
                <Autocomplete
                  limitTags={2}
                  id="combo-box-demo"
                  options={clinics.map((c) => c.clinic_code)}
                  onChange={(e, v) => handleClinics(index, v)}
                  // value={entry.clinic_id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Clinic"
                      placeholder="Choose"
                    />
                  )}
                />
                <Autocomplete
                  limitTags={2}
                  id="combo-box-demo"
                  options={days}
                  onChange={(e, v) => handleDays(index, v)}
                  // value={entry.day}
                  renderInput={(params) => (
                    <TextField {...params} label="Days" placeholder="Choose" />
                  )}
                  sx={{ marginTop: "10px" }}
                />
                <Autocomplete
                  multiple
                  limitTags={2}
                  id="multiple-limit-tags"
                  options={timeslots.map((ft) => ft.start + " - " + ft.end)}
                  onChange={(e, v) => handleWalkinTimeslots(index, v)}
                  // value={entry.walk_in}
                  inputValue=""
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Timeslots for Walk in Appointments"
                      placeholder="Choose"
                    />
                  )}
                  sx={{ marginTop: "10px" }}
                />
                <Autocomplete
                  multiple
                  limitTags={2}
                  id="multiple-limit-tags"
                  options={timeslots.map((ft) => ft.start + " - " + ft.end)}
                  onChange={(e, v) => handleBookingTimeslots(index, v)}
                  // value={entry.booking}
                  inputValue=""
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Timeslots for Online-Booked Appointments"
                      placeholder="Choose"
                    />
                  )}
                  sx={{ marginTop: "10px" }}
                />
                {schedule.length > 1 && (
                  <Button
                    onClick={() => {
                      handleRemoveSchedule(index);
                    }}
                  >
                    Remove Schedule
                  </Button>
                )}
                <Button
                  onClick={handleSubmitSchedule}
                  value="set Operating Hours"
                  sx={{ color: "blue", marginTop: "10px" }}
                  variant="outlined"
                >
                  Save
                </Button>
              </div>
            ))}

            <Button onClick={handleAddSchedule}>Add</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSched;
