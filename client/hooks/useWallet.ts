import { useAccount, useConnect, useDisconnect } from "wagmi";
import type { WalletState } from "@/types/wallet";

export function useWallet(): WalletState {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const connectWallet = async () => {
    if (connectors[0]) {
      try {
        await connect({ connector: connectors[0] });
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return {
    address,
    connectWallet,
    disconnect: disconnectWallet,
    isConnected,
  };
}
