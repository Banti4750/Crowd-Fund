import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useNavigate } from 'react-router-dom';

// Wallet connection component
const ConnectWallet = () => {
  const { address, isConnected } = useAccount();

  return (
    <div>
      {!address ? <Connect /> : <DisConnect />}
    </div>
  );
};

function Connect() {
  const { connectors, connect } = useConnect();

  return (
    <div className="flex space-x-2">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {connector.name}
        </button>
      ))}
    </div>
  );
}

function DisConnect() {
  const { disconnect } = useDisconnect();

  return (
    <button
      onClick={() => disconnect()}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Disconnect wallet
    </button>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { address } = useAccount();
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

             {/* Right section with logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-white text-xl font-bold">CrowdFund</span>
              <svg className="h-8 w-8 ml-2 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm0 8h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1zm10-8h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm0 8h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1z" />
              </svg>
            </div>
          </div>


          {/* Left section with wallet connect and campaign button */}
          <div className="flex items-center space-x-4">
            <ConnectWallet />

            {address && (
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
               onClick={()=>{
                navigate('/add-campaign')
               }}
              >
                Add New Campaign
              </button>
            )}
          </div>



          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-3 sm:px-3">
          <ConnectWallet />

          {address && (
            <button className="block w-full text-left px-3 py-2 text-gray-200 font-medium hover:bg-gray-700 rounded-md"
            onClick={()=>{
                navigate('/add-campaign')
               }}
            >
              Add New Campaign
            </button>
          )}
        </div>
      )}
    </nav>
  );
}