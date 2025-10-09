import React from "react";
import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";
import {
    Box,
    Typography,
    Divider,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
} from "@mui/material";

function FlowEditor({
    nodes,
    edges,
    onNodesChange,
    nodeTypes,
    selectedNode,
    handleInputChange,
    getExecutionOrder,
    addApiNode,
    onNodeClick,
    handleRunFlow,
}) {

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                width: "100vw",
                bgcolor: "#121212",
                color: "white",
            }}
        >
            {/* ==== Left side: React Flow canvas ==== */}
            <Box
                sx={{
                    flex: 1,
                    borderRight: "1px solid #333",
                    position: "relative",
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                }}
            >
                {/* === Control Buttons === */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        display: "flex",
                        gap: 1,
                        zIndex: 10,
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={addApiNode}
                    >
                        + Add API Node
                    </Button>

                    <Button
                        variant="outlined"
                        color="success"
                        onClick={handleRunFlow}
                    >
                        ▶ Run Flow
                    </Button>
                </Box>

                {/* === React Flow Canvas === */}
                <Box sx={{ width: "100%", height: "100%" }}>
                    <ReactFlow
                        nodes={nodes}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onNodeClick={onNodeClick}
                        fitView
                        nodesDraggable
                        nodesConnectable
                        panOnDrag
                        zoomOnScroll
                        minZoom={0.2}
                        maxZoom={1.5}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <Background color="#333" gap={16} />
                    </ReactFlow>
                </Box>
            </Box>

            {/* ==== Right side: Node configuration sidebar ==== */}
            <Box
                sx={{
                    width: 350,
                    bgcolor: "#1e1e1e",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
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
                        {/* === Label Field === */}
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

                        {/* === API Endpoint Field === */}
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

                        {/* === HTTP Method Selector === */}
                        <FormControl fullWidth size="small">
                            <InputLabel sx={{ color: "#aaa" }}>HTTP Method</InputLabel>
                            <Select
                                value={selectedNode.data.method}
                                label="HTTP Method"
                                onChange={(e) =>
                                    handleInputChange("method", e.target.value)
                                }
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

                        {/* 🟢 API Response Section (add this new) */}
                        {selectedNode.data.response && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" sx={{ color: "#90caf9", mb: 1 }}>
                                    API Response:
                                </Typography>
                                <Box
                                    sx={{
                                        backgroundColor: "#121212",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        fontFamily: "monospace",
                                        fontSize: "0.85rem",
                                        color: "#dcdcdc",
                                        maxHeight: "250px",
                                        overflowY: "auto",
                                        border: "1px solid #333",
                                    }}
                                >
                                    <pre style={{ margin: 0 }}>
                                        {JSON.stringify(selectedNode.data.response, null, 2)}
                                    </pre>
                                </Box>
                            </Box>
                        )}

                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default FlowEditor;
