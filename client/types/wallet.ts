import { Connector } from "wagmi";

export interface WalletState {
  address?: string;
  isConnected: boolean;
  connectWallet: () => void;
  disconnect: () => void;
}

export interface ConnectConfig {
  connector: Connector;
} 