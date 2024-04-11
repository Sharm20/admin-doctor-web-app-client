import React, { useState } from "react";

const SetSchedule = () => {
  const [weeklySched, setWeeklySched] = useState([
    { days: [], start: "", end: "" },
  ]);

  const handleWeeklySchedInput = (index, event) => {
    const { name, value } = event.target;
    const updateSchedule = [...weeklySched];
    updateSchedule[index][name] = value;
    setWeeklySched(updateSchedule);
  };

  const handleDays = (index, v) => {
    const updatedSchedule = [...weeklySched];
    // the number value of day is stored to the weekly schedule "days" attribute as array
    updatedSchedule[index].days = v.map((days) => days.value);
    setWeeklySched(updatedSchedule);
    console.log(updatedSchedule);
  };

  // this was an attempt to fix the bug on the selected days tags when a form is removed
  const handleRemoveDays = (index, v) => {
    const updatedSchedule = [...weeklySched];
    const removedDays = (updatedSchedule[index].days = v.map(
      (days) => days.value
    ));
    removedDays.splice(index, 1);
    setWeeklySched();
  };

  const handleAddSchedule = () => {
    // removes the already selected days from the autocomplete options
    const selectedDays = weeklySched.flatMap((entry) => entry.days);
    const unselectedDays = Days.filter(
      (day) => !selectedDays.includes(day.value)
    );
    setDays(unselectedDays);
    // stores the forms input to the weeklySched state variable
    setWeeklySched([...weeklySched, { days: [], start: "", end: "" }]);
  };

  const handleRemoveSchedule = (index) => {
    const updatedSchedule = [...weeklySched];
    updatedSchedule.splice(index, 1);
    setWeeklySched(updatedSchedule);
    console.log(updatedSchedule);
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
  };

  return (
    <div>
      <div className="mt-3">
        <Autocomplete
          multiple
          limitTags={2}
          id="multiple-limit-tags"
          options={clinics.map((c) => c.clinic_code)}
          onChange={handleClinics}
          renderInput={(params) => (
            <TextField {...params} label="Clinics" placeholder="Choose" />
          )}
          sx={{ width: "485px" }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="clinic_code" className="form-label mt-2">
          Appointment Duration
        </label>
        <input
          type="text"
          className="form-control"
          id="default_appt_duration"
          name="default_appt_duration"
          onChange={handleInput}
          value={detail.default_appt_duration}
        />{" "}
      </div>
      <div className="form-group">
        <label htmlFor="clinic_code" className="form-label mt-2">
          Weekly Schedule
        </label>
        {weeklySched.map((entry, index) => (
          <div key={index}>
            <Autocomplete
              multiple
              limitTags={2}
              id="multiple-limit-tags"
              options={days}
              onChange={(e, v) => handleDays(index, v)}
              renderInput={(params) => (
                <TextField {...params} label="Days" placeholder="Choose" />
              )}
              sx={{ width: "485px" }}
            />
            <input
              type="time"
              className="form-control mt-2"
              placeholder="start"
              id="start"
              name="start"
              onChange={(e) => handleWeeklySchedInput(index, e)}
              value={entry.start}
            />
            <input
              type="time"
              className="form-control mt-2"
              placeholder="end"
              id="end"
              name="end"
              onChange={(e) => handleWeeklySchedInput(index, e)}
              value={entry.end}
            />
            {weeklySched.length > 1 && (
              <Button
                onClick={() => {
                  handleRemoveSchedule(index);
                }}
              >
                Remove Schedule
              </Button>
            )}
          </div>
        ))}
        {weeklySched.every((entry) => entry.days.length > 0) && (
          <Button onClick={handleAddSchedule}>Add</Button>
        )}
      </div>
    </div>
  );
};

export default SetSchedule;
