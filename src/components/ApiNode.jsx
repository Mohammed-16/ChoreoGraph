import React from "react";
import { Handle, Position } from "reactflow";
import { Paper, Typography, Chip, Box } from "@mui/material";

function ApiNode({ data }) {
  const getMethodColor = (method) => {
    switch (method) {
      case "GET":
        return "success";
      case "POST":
        return "primary";
      case "PUT":
        return "warning";
      case "DELETE":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 1.5,
        minWidth: 160,
        borderRadius: 2,
        border: "1px solid #555",
        backgroundColor: "#263238", // visible on dark canvas
        color: "white",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Left handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "#90caf9",
          width: 10,
          height: 10,
          borderRadius: "50%",
        }}
      />

      {/* Node content */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "#90caf9" }}
        >
          {data.label || "Unnamed Node"}
        </Typography>

        <Chip
          label={data.method || "GET"}
          color={getMethodColor(data.method)}
          size="small"
          sx={{
            fontWeight: "bold",
            fontSize: "0.75rem",
          }}
        />
      </Box>

      {/* Right handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "#90caf9",
          width: 10,
          height: 10,
          borderRadius: "50%",
        }}
      />
    </Paper>
  );
}

export default ApiNode;
