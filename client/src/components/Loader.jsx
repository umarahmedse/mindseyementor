import React from "react";
import { CircularProgress } from "@mui/material";

const loaderContainerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent black background
  zIndex: 9999, // Make sure it's on top of other content
};

const Loader = () => {
  return (
    <div style={loaderContainerStyle}>
      <CircularProgress color="primary" />
    </div>
  );
};

export default Loader;
