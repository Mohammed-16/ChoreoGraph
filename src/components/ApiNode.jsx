import React from "react";
import { Handle, Position } from "reactflow";
import { Paper, Typography, CircularProgress, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const ApiNode = ({ data }) => {
  const { label, method, status } = data;

  // 🎨 Status-based color mapping
  const borderColor =
    status === "loading"
      ? "#ff9800"
      : status === "success"
      ? "#4caf50"
      : status === "error"
      ? "#f44336"
      : "#90caf9"; // default blue

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        borderRadius: 2,
        minWidth: 180,
        textAlign: "center",
        border: `3px solid ${borderColor}`,
        backgroundColor: "#263238",
        color: "white",
        position: "relative",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mt: 1,
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          display: "inline-block",
          backgroundColor:
            method === "GET"
              ? "#4caf50"
              : method === "POST"
              ? "#2196f3"
              : method === "PUT"
              ? "#ff9800"
              : "#f44336",
        }}
      >
        {method}
      </Typography>

      {/* 🌀 Status Indicator */}
      <Box sx={{ position: "absolute", top: 6, right: 6 }}>
        {status === "loading" && <CircularProgress size={16} color="warning" />}
        {status === "success" && <CheckCircleIcon sx={{ color: "#4caf50" }} />}
        {status === "error" && <ErrorIcon sx={{ color: "#f44336" }} />}
      </Box>
    </Paper>
  );
};

export default ApiNode;
