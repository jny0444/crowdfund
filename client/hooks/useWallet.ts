import { useAccount, useConnect, useDisconnect } from "wagmi";

export function useWallet() {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return {
    address,
    connectWallet: () => connect({ connector: connectors[0] }),
    disconnect,
    isConnected,
  };
}
