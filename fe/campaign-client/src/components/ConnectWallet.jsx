import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';


const ConnectWallet = () => {
  const { address, isConnected } = useAccount();

  return (
    <div >
        {!address ? <Connect /> : <DisConnect />}
      </div>
  );
};

export default ConnectWallet;


function Connect() {
    const { connectors, connect } = useConnect();

    return connectors.map((connector) => (
      <button key={connector.id} onClick={() => connect({ connector })}>
        {connector.name}
      </button>
    ));
  }

  function DisConnect() {
    const { disconnect } = useDisconnect();

    return (
      <div>
        <button onClick={() => disconnect()}>Disconnect wallet</button>
      </div>
    );
  }