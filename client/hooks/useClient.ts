import { createWalletClient, custom } from "viem";
import { hardhat } from "viem/chains";
import dotenv from 'dotenv';

dotenv.config();


declare global {
    interface Window {
        ethereum?: any;
    }
};

export const useClient = async () => {
    const [account] = window.ethereum!.request({ method: "eth_requestAccounts" });
    console.log(account)
     
    const client = createWalletClient({
        chain: hardhat,
        transport: custom(window.ethereum!)
    })
    
    const [address] = await client.getAddresses();
};