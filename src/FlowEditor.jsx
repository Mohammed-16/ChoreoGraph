import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

function FlowEditor() {
  const [nodes, setNodes] = useState([
    { id: "1", data: { label: "Node 1", api: "", method: "GET" } },
    { id: "2", data: { label: "Node 2", api: "", method: "POST" } },
    { id: "3", data: { label: "Node 3", api: "", method: "DELETE" } },
  ]);

  const [selectedNode, setSelectedNode] = useState(null);

  // ✅ When a node is clicked, set it as selected
  const onNodeClick = (node) => {
    setSelectedNode(node);
  };

  // ✅ Updates both selectedNode and nodes array by ID
  const handleInputChange = (field, value) => {
    if (!selectedNode) return;

    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        [field]: value, // update specific field (label, api, method)
      },
    };

    // Update nodes list (find by ID)
    setNodes((prevNodes) =>
      prevNodes.map((n) => (n.id === selectedNode.id ? updatedNode : n))
    );

    // Keep selectedNode in sync
    setSelectedNode(updatedNode);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#121212",
        color: "white",
      }}
    >
      {/* Left Panel */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          borderRight: "1px solid #333",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Node List (Click one)
        </Typography>

        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#1e1e1e",
            borderRadius: 2,
            p: 1,
          }}
        >
          <List>
            {nodes.map((node) => (
              <ListItem disablePadding key={node.id}>
                <ListItemButton
                  onClick={() => onNodeClick(node)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor:
                      selectedNode?.id === node.id ? "#1976d2" : "transparent",
                    "&:hover": { backgroundColor: "#1565c0" },
                  }}
                >
                  <ListItemText
                    primary={node.data.label}
                    primaryTypographyProps={{ color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Right Sidebar */}
      <Box
        sx={{
          width: 350,
          bgcolor: "#1e1e1e",
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, color: "#90caf9", fontWeight: "bold" }}
        >
          {selectedNode ? "Node Configuration" : "No Node Selected"}
        </Typography>

        <Divider sx={{ mb: 2, borderColor: "#444" }} />

        {!selectedNode ? (
          <Typography variant="body2" color="gray">
            Click on a node to configure its details.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Label Field */}
            <TextField
              label="Label"
              variant="outlined"
              size="small"
              value={selectedNode.data.label}
              onChange={(e) => handleInputChange("label", e.target.value)}
              fullWidth
              InputLabelProps={{ style: { color: "#aaa" } }}
              sx={{
                input: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#90caf9" },
                },
              }}
            />

            {/* API Endpoint Field */}
            <TextField
              label="API Endpoint URL"
              variant="outlined"
              size="small"
              value={selectedNode.data.api}
              onChange={(e) => handleInputChange("api", e.target.value)}
              fullWidth
              InputLabelProps={{ style: { color: "#aaa" } }}
              sx={{
                input: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#90caf9" },
                },
              }}
            />

            {/* HTTP Method Selector */}
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: "#aaa" }}>HTTP Method</InputLabel>
              <Select
                value={selectedNode.data.method}
                label="HTTP Method"
                onChange={(e) => handleInputChange("method", e.target.value)}
                sx={{
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#555",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#90caf9",
                  },
                }}
              >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default FlowEditor;
