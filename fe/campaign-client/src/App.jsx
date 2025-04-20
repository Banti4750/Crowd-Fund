import ConnectWallet from "./components/ConnectWallet";
import AddCampaign from "./components/AddCampaign";
import CampaignList from "./components/CampaignList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./config";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Navbar />
            <div className="bg-black h-fuul
             w-full">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <CampaignList />

                    </>
                  }
                />
                <Route path="/add-campaign" element={<AddCampaign />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;