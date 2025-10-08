import React, { useState, useMemo } from "react";
import { ReactFlowProvider, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import FlowEditor from "./FlowEditor";
import ApiNode from "./components/ApiNode";

function App() {
  // ✅ Memoized nodeTypes (fixes React Flow warning #1)
  const nodeTypes = useMemo(() => ({ apiNode: ApiNode }), []);

  // ✅ Node state lives here
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "1",
      type: "apiNode",
      position: { x: 200, y: 100 },
      data: {
        label: "Get Users",
        api: "https://api.example.com/users",
        method: "GET",
      },
    },
    {
      id: "2",
      type: "apiNode",
      position: { x: 200, y: 250 },
      data: {
        label: "Create User",
        api: "https://api.example.com/users",
        method: "POST",
      },
    },
  ]);

  const [selectedNode, setSelectedNode] = useState(null);

  // ✅ Add a new node near the last one
  const addApiNode = () => {
    const lastNode = nodes[nodes.length - 1];
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: "apiNode",
      position: {
        x: lastNode.position.x + 250,
        y: lastNode.position.y + (Math.random() * 80 - 40),
      },
      data: {
        label: `New API Node ${nodes.length + 1}`,
        api: "",
        method: "GET",
      },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  // ✅ Update form changes
  const handleInputChange = (field, value) => {
    if (!selectedNode) return;

    const updatedNode = {
      ...selectedNode,
      data: { ...selectedNode.data, [field]: value },
    };

    setNodes((prev) =>
      prev.map((n) => (n.id === selectedNode.id ? updatedNode : n))
    );

    setSelectedNode(updatedNode);
  };

  // ✅ Handle node click
  const onNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  return (
    <ReactFlowProvider>
      <FlowEditor
        nodes={nodes}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        selectedNode={selectedNode}
        handleInputChange={handleInputChange}
        addApiNode={addApiNode}
        onNodeClick={onNodeClick}
      />
    </ReactFlowProvider>
  );
}

export default App;
