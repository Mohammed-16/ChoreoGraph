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
} from "@mui/material";

function FlowEditor() {
  const [nodes, setNodes] = useState([
    { id: "1", data: { label: "Node 1" } },
    { id: "2", data: { label: "Node 2" } },
    { id: "3", data: { label: "Node 3" } },
  ]);

  const [selectedNode, setSelectedNode] = useState(null);

  const onNodeClick = (node) => {
    setSelectedNode(node);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#121212", // dark background
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
          {selectedNode ? "Selected Node" : "No Node Selected"}
        </Typography>

        <Divider sx={{ mb: 2, borderColor: "#444" }} />

        {selectedNode ? (
          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>ID:</strong> {selectedNode.id}
            </Typography>
            <Typography variant="body1">
              <strong>Label:</strong> {selectedNode.data.label}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="gray">
            Click on a node to view its details.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default FlowEditor;
