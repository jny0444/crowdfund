import { expect, describe, it, beforeEach } from "vitest";
import {
  deployContract,
  getAccounts,
  createPublicClient,
  createWalletClient,
  parseEther,
  Account,
  Address,
  PublicClient,
  WalletClient,
  Hash,
} from "viem";
import { hardhat } from "viem/chains";
import type { CrowdFunding } from "../typechain-types";
import CrowdFundingArtifact from "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json" assert { type: "json" };

describe("CrowdFunding", () => {
  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http("http://127.0.0.1:8545"),
  });
  let accounts: Account[];
  let crowdFunding: CrowdFunding;
  let owner: Account;
  let contributor1: Account;
  let contributor2: Account;

  beforeEach(async () => {
    accounts = await getAccounts();
    [owner, contributor1, contributor2] = accounts;

    const walletClient = createWalletClient({
      chain: hardhat,
      transport: http("http://127.0.0.1:8545"),
      account: owner,
    });

    const { contractAddress } = await deployContract({
      abi: CrowdFundingArtifact.abi,
      bytecode: CrowdFundingArtifact.bytecode as `0x${string}`,
      walletClient,
    });

    crowdFunding = { address: contractAddress, abi: CrowdFundingArtifact.abi };
  });

  describe("Campaign Creation", () => {
    it("should create a new campaign", async () => {
      const description = "Test Campaign";
      const goal = parseEther("1");
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 86400); // 24 hours from now

      const hash = await publicClient.writeContract({
        ...crowdFunding,
        functionName: "startCampaign",
        args: [description, goal, deadline],
        account: owner,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      const totalCampaigns = await publicClient.readContract({
        ...crowdFunding,
        functionName: "totalCampaigns",
      });

      expect(totalCampaigns).toBe(1n);
    });

    it("should fail if deadline is in the past", async () => {
      const description = "Test Campaign";
      const goal = parseEther("1");
      const deadline = BigInt(Math.floor(Date.now() / 1000) - 86400); // 24 hours ago

      await expect(
        publicClient.writeContract({
          ...crowdFunding,
          functionName: "startCampaign",
          args: [description, goal, deadline],
          account: owner,
        })
      ).rejects.toThrow("Deadline must be in the future");
    });
  });

  describe("Campaign Contributions", () => {
    beforeEach(async () => {
      const description = "Test Campaign";
      const goal = parseEther("1");
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 86400);

      const hash = await publicClient.writeContract({
        ...crowdFunding,
        functionName: "startCampaign",
        args: [description, goal, deadline],
        account: owner,
      });

      await publicClient.waitForTransactionReceipt({ hash });
    });

    it("should allow contributions to a campaign", async () => {
      const amount = parseEther("0.5");
      const hash = await publicClient.writeContract({
        ...crowdFunding,
        functionName: "contribute",
        args: [0n, amount],
        account: contributor1,
        value: amount,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      const campaign = await publicClient.readContract({
        ...crowdFunding,
        functionName: "campaigns",
        args: [0n],
      });

      expect(campaign[4]).toBe(amount); // balance is at index 4
    });

    it("should fail if campaign has ended", async () => {
      const amount = parseEther("0.5");
      await publicClient.writeContract({
        ...crowdFunding,
        functionName: "endCampaign",
        args: [0n],
        account: owner,
      });

      await expect(
        publicClient.writeContract({
          ...crowdFunding,
          functionName: "contribute",
          args: [0n, amount],
          account: contributor1,
          value: amount,
        })
      ).rejects.toThrow("Campaign already ended");
    });
  });

  describe("Campaign Ending", () => {
    beforeEach(async () => {
      const description = "Test Campaign";
      const goal = parseEther("1");
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 86400);

      const hash = await publicClient.writeContract({
        ...crowdFunding,
        functionName: "startCampaign",
        args: [description, goal, deadline],
        account: owner,
      });

      await publicClient.waitForTransactionReceipt({ hash });
    });

    it("should transfer funds to owner if goal is met", async () => {
      const amount = parseEther("1");
      await publicClient.writeContract({
        ...crowdFunding,
        functionName: "contribute",
        args: [0n, amount],
        account: contributor1,
        value: amount,
      });

      await publicClient.send("evm_increaseTime", [86401]);
      await publicClient.send("evm_mine", []);

      const initialBalance = await publicClient.getBalance({
        address: owner.address,
      });

      const hash = await publicClient.writeContract({
        ...crowdFunding,
        functionName: "endCampaign",
        args: [0n],
        account: owner,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      const finalBalance = await publicClient.getBalance({
        address: owner.address,
      });

      expect(finalBalance - initialBalance).toBeGreaterThan(0n);
    });

    it("should refund contributors if goal is not met", async () => {
      const amount = parseEther("0.5");
      await publicClient.writeContract({
        ...crowdFunding,
        functionName: "contribute",
        args: [0n, amount],
        account: contributor1,
        value: amount,
      });

      await publicClient.send("evm_increaseTime", [86401]);
      await publicClient.send("evm_mine", []);

      const initialBalance = await publicClient.getBalance({
        address: contributor1.address,
      });

      const hash = await publicClient.writeContract({
        ...crowdFunding,
        functionName: "endCampaign",
        args: [0n],
        account: owner,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      const finalBalance = await publicClient.getBalance({
        address: contributor1.address,
      });

      expect(finalBalance - initialBalance).toBeGreaterThan(0n);
    });
  });
});
