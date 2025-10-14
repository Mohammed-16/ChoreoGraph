import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, sepolia } from "wagmi/chains";

// ✅ 1. Create Wagmi + RainbowKit config
const config = getDefaultConfig({
  appName: "FlowEditor",
  projectId: "YOUR_PROJECT_ID", // Get this from https://cloud.walletconnect.com
  chains: [mainnet, sepolia],
  ssr: false, // Set to true if you use SSR frameworks
});

// ✅ 2. Create Query Client (required by Wagmi v2)
const queryClient = new QueryClient();

// ✅ 3. Render App with proper providers
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
