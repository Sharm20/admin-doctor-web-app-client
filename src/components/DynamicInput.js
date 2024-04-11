import React, { useState } from "react";
import { Days } from "../constants/Schedule";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const DynamicInput = () => {
  const [val, setVal] = useState([]);
  console.log("TESTS");
  const handleAdd = () => {
    const textBox = [...val, []];
    setVal(textBox);
  };

  const handleChange = (onChangeValue, i) => {
    const inputData = [...val];
    inputData[i] = onChangeValue.target.value;
    setVal(inputData);
  };
  console.log(val);
  const handleDelete = (i) => {
    const deleteVal = [...val];
    deleteVal.splice(i, 1);
    setVal(deleteVal);
  };

  return (
    <>
      <button onClick={handleAdd}>Add</button>
      {val.map((data, i) => {
        return (
          <div>
            <Autocomplete
              multiple
              limitTags={2}
              id="multiple-limit-tags"
              options={Days}
              //   onChange={handleWeeklySched}
              renderInput={(params) => (
                <TextField {...params} label="Days" placeholder="Choose" />
              )}
              sx={{ width: "485px" }}
            />
            <input value={data} onChange={(e) => handleChange(e, i)} />
            <button onClick={() => handleDelete(i)}>x</button>
          </div>
        );
      })}
    </>
  );
};

export default DynamicInput;
