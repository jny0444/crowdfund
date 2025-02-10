// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CrowdFundingModule = buildModule("CrowdFunding Module", (m) => {
  const crowdFund = m.contract("CrowdFunding", [], {});

  return { crowdFund };
});

export default CrowdFundingModule;
