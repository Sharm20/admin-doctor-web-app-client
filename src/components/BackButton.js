import { Button } from "@mui/material";
import React from "react";

const Back = ({ text }) => {
  const handleClick = () => {
    window.history.back();
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        sx={{
          color: "black",
          outline: "black",
          border: "1px solid black",
        }}
      >
        {text}
      </Button>
    </div>
  );
};

export default Back;
