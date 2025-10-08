import React, { useState, useMemo } from "react";
import { ReactFlowProvider, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import FlowEditor from "./FlowEditor";
import ApiNode from "./components/ApiNode";

function App() {

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // ✅ Register node types (memoized)
  const nodeTypes = useMemo(() => ({ apiNode: ApiNode }), []);

  // ✅ Node state and selected node
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

  // ✅ Add a new node
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

  // ✅ Update node data from form
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

  // ✅ Determine execution order based on edges
  const getExecutionOrder = (nodes, edges) => {
    // Create an adjacency list and in-degree count
    const adjacencyList = {};
    const inDegree = {};

    // Initialize all nodes in both maps
    nodes.forEach((node) => {
      adjacencyList[node.id] = [];
      inDegree[node.id] = 0;
    });

    // Fill adjacency list and in-degree count
    edges.forEach((edge) => {
      const { source, target } = edge;
      if (adjacencyList[source]) adjacencyList[source].push(target);
      inDegree[target] = (inDegree[target] || 0) + 1;
    });

    // Find nodes with no incoming edges
    const queue = Object.keys(inDegree).filter((id) => inDegree[id] === 0);
    const order = [];

    // Perform topological sort (Kahn’s algorithm)
    while (queue.length > 0) {
      const current = queue.shift();
      order.push(current);

      adjacencyList[current].forEach((neighbor) => {
        inDegree[neighbor] -= 1;
        if (inDegree[neighbor] === 0) queue.push(neighbor);
      });
    }

    // Detect cycles
    if (order.length !== nodes.length) {
      console.warn("⚠️ Cycle detected in graph — execution order may be invalid!");
    }

    return order;
  };

  // ✅ Handle executing the flow in sorted order
  const handleRunFlow = async () => {
    console.log("▶ Running flow...");

    // 1️⃣ Determine execution order
    const order = getExecutionOrder(nodes, edges);
    console.log("Execution order:", order);

    // 2️⃣ Prepare results storage
    const results = {};

    // 3️⃣ Loop through the nodes in the correct order
    for (const nodeId of order) {
      const node = nodes.find((n) => n.id === nodeId);

      if (!node?.data?.api) {
        console.warn(`⚠️ Skipping node ${nodeId}: No API URL defined`);
        continue;
      }

      try {
        console.log(`🔹 Calling ${node.data.method} ${node.data.api}`);
        const response = await fetch(node.data.api, { method: node.data.method });
        const data = await response.json().catch(() => ({}));
        results[nodeId] = data;
      } catch (error) {
        console.error(`❌ Error calling node ${nodeId}:`, error);
        results[nodeId] = { error: error.message };
      }
    }

    console.log("✅ Flow execution complete:", results);
  };

  // ✅ When a node is clicked
  const onNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  // ✅ Pass everything down to FlowEditor
  return (
    <ReactFlowProvider>
      <FlowEditor
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        selectedNode={selectedNode}
        handleInputChange={handleInputChange}
        getExecutionOrder={getExecutionOrder}
        addApiNode={addApiNode}
        onNodeClick={onNodeClick}
        handleRunFlow={handleRunFlow}  
      />
    </ReactFlowProvider>
  );
}

export default App;
