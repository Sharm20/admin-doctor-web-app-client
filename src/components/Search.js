import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const SearchComponent = ({ onChange, onClick, label, color }) => {
  return (
    <div className="d-flex align-items-center gap-3">
      <TextField
        id="outlined-basic"
        label={label}
        variant="outlined"
        onChange={onChange}
      />

      <Button
        onClick={onClick}
        sx={{
          color: "black",

          border: "1px solid black",
        }}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchComponent;
