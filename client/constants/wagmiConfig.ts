import { abi } from "./CrowdFunding.json";

export const wagmiContractConfig = {
  address: `0x${process.env.CONTRACT_ADDRESS}`,
  abi: abi,
} as const;
