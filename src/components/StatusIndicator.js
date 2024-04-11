import React from "react";

const StatusIndicator = ({ background, status, paddingLeft }) => {
  // "#5a9f68" green
  return (
    <div
      style={{
        background: background,
        color: "white",
        width: "75px",
        paddingLeft: paddingLeft,
        borderRadius: "20px ",
      }}
    >
      {status}
    </div>
  );
};

export default StatusIndicator;
