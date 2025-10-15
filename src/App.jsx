import React, { useState, useMemo } from "react";
import { ReactFlowProvider, useNodesState, useEdgesState, addEdge } from "reactflow";
import "reactflow/dist/style.css";
import FlowEditor from "./FlowEditor";
import ApiNode from "./components/ApiNode";
import axios from "axios";

const uploadToIPFS = async (nodes, edges) => {
  try {
    const jwt = import.meta.env.VITE_PINATA_JWT;

    if (!jwt) {
      alert("Pinata JWT missing! Add it in your .env file.");
      return;
    }

    const jsonData = {
      name: "Flow Configuration",
      description: "API workflow created using FlowEditor",
      data: { nodes, edges },
      timestamp: new Date().toISOString(),
    };

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      jsonData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    const ipfsHash = res.data.IpfsHash;
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    alert(`✅ Flow published to IPFS!\n\nURL: ${ipfsUrl}`);
    console.log("IPFS Upload Response:", res.data);

    return ipfsUrl;
  } catch (error) {
    console.error("❌ IPFS upload failed:", error);
    alert("Failed to publish flow to IPFS.");
  }
};


function App() {



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
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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

    // Update nodes
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNode.id) {
          const updatedNode = {
            ...n,
            data: {
              ...n.data,
              [field]: value,
              status: undefined,   // clear previous result
              response: undefined, // clear old response
            },
          };

          // ✅ Keep selectedNode in sync
          setSelectedNode(updatedNode);

          return updatedNode;
        }
        return n;
      })
    );
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

  // 🧩 Helper: Replace placeholders in URLs or body strings
  function resolvePlaceholders(str, results) {
    if (!str || typeof str !== "string") return str;

    return str.replace(/\{(.*?)\}/g, (_, path) => {
      try {
        // Example path: node_1.data.user.name
        const [nodeKey, ...rest] = path.split(".");
        const nodeId = nodeKey.replace("node_", "");
        const nodeData = results[nodeId];

        if (!nodeData) return `{${path}}`;

        // Traverse nested properties
        let value = nodeData;
        for (const key of rest) {
          if (value && typeof value === "object") {
            value = value[key];
          } else {
            return `{${path}}`; // leave unresolved if path not found
          }
        }

        return value ?? `{${path}}`;
      } catch (err) {
        console.warn("Placeholder resolution failed for:", path);
        return `{${path}}`;
      }
    });
  }


  // ✅ Handle executing the flow in sorted order
  const handleRunFlow = async () => {
    console.log("▶ Running flow...");
    const order = getExecutionOrder(nodes, edges);
    const results = {};

    for (const nodeId of order) {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) continue;

      const { api, method, body } = node.data;

      // 1️⃣ Mark node as "loading"
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, status: "loading" } } : n
        )
      );

      // 2️⃣ Replace placeholders dynamically
      const resolvedUrl = resolvePlaceholders(api, results);
      const resolvedBody = body ? resolvePlaceholders(body, results) : null;

      console.log(`🔹 Calling ${method} ${resolvedUrl}`);

      try {
        const options = { method };

        // Include body only for POST or PUT requests
        if (["POST", "PUT"].includes(method)) {
          try {
            // Replace placeholders if any
            const resolvedBody = body ? resolvePlaceholders(body, results) : null;
            if (resolvedBody) {
              options.headers = { "Content-Type": "application/json" };
              options.body = resolvedBody;
            }
          } catch (err) {
            console.warn(`⚠️ Error processing request body for node ${nodeId}`, err);
          }
        }


        const response = await fetch(resolvedUrl, options);
        const data = await response.json();

        results[nodeId] = data;

        // ✅ THIS IS THE SECTION YOU NEED TO REPLACE
        setNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId
              ? {
                ...n,
                data: {
                  ...n.data,
                  status: "success",
                  response: data, // 👈 add this line
                },
              }
              : n
          )
        );

        console.log(`✅ Node ${nodeId} success`);
      } catch (error) {
        console.error(`❌ Node ${nodeId} failed:`, error);
        results[nodeId] = { error: error.message };

        // ⚠️ update on error
        setNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId
              ? {
                ...n,
                data: {
                  ...n.data,
                  status: "error",
                  response: { error: error.message }, // 👈 add this line too
                },
              }
              : n
          )
        );
      }
    }
    console.log("🟢 Flow execution complete:", results);
  };

  // 💾 Save the current flow as a JSON file
  const handleSaveFlow = () => {
    try {
      // Combine nodes and edges into one object
      const flowData = {
        nodes,
        edges,
        timestamp: new Date().toISOString(),
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(flowData, null, 2);

      // Create a Blob and URL for download
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "api-flow.json";
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);

      console.log("✅ Flow saved successfully!");
    } catch (error) {
      console.error("❌ Failed to save flow:", error);
    }
  };

  // 📂 Load a saved flow from a JSON file
  const handleLoadFlow = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);

        if (jsonData.nodes && jsonData.edges) {
          setNodes(jsonData.nodes);
          setEdges(jsonData.edges);
          console.log("✅ Flow loaded successfully!");
        } else {
          console.error("❌ Invalid flow file format");
        }
      } catch (error) {
        console.error("❌ Error loading flow:", error);
      }
    };

    reader.readAsText(file);
  };
  

  // 🔗 When a user connects two nodes in the canvas
  const onConnect = (params) => {
    console.log("Edge created:", params);
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  };


  // ✅ When a node is clicked
  const onNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  const handlePublishFlow = async () => {
  await uploadToIPFS(nodes, edges);
};


  // ✅ Pass everything down to FlowEditor
  return (
    <ReactFlowProvider>
      <FlowEditor
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        selectedNode={selectedNode}
        handleInputChange={handleInputChange}
        getExecutionOrder={getExecutionOrder}
        addApiNode={addApiNode}
        onNodeClick={onNodeClick}
        handleRunFlow={handleRunFlow}
        onSaveFlow={handleSaveFlow}
        onLoadFlow={handleLoadFlow}
        onConnect={onConnect}
        nodeTypes={{ apiNode: ApiNode }} 
        onPublishFlow={handlePublishFlow}
      />
    </ReactFlowProvider>
  );
}

export default App;
