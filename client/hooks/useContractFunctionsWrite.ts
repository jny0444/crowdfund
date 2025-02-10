import abi from "@/constants";
import { formatEther } from "viem";
import { useWriteContract } from "wagmi";
import dotenv from 'dotenv';

dotenv.config();

export function useContractFunctions() {
    const { writeContract } = useWriteContract();

    async function startCampaign(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const description = formData.get('description') as string;
        const goal = formData.get('goal') as string;
        const goalInEther = formatEther(BigInt(goal) * BigInt(10 ** 18));
        const deadline = formData.get('deadline') as unknown as Date;
        const deadlineInSeconds = BigInt(Math.floor(deadline.getTime() / 1000).toFixed(0));

        writeContract({
            abi: abi,
            address: `0x${process.env.CONTRACT_ADDRESS}`,
            functionName: 'startCampaign',
            args: [
                description,
                goalInEther,
                deadlineInSeconds
            ]
        })
    }

    async function contribute(e: React.FormEvent<HTMLFormElement>, campaignId: number) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const amount = formData.get('amount') as unknown as number;
        const amountInEther = formatEther(BigInt(amount) * BigInt(10 ** 18));

        writeContract({
            abi: abi,
            address: `0x${process.env.CONTRACT_ADDRESS}`,
            functionName: 'contribute',
            args: [
                campaignId,
                amountInEther
            ]
        })
    }

    async function endCampaign(e: React.FormEvent<HTMLFormElement>, campaignId: number) {
        e.preventDefault();

        writeContract({
            abi: abi,
            address: `0x${process.env.CONTRACT_ADDRESS}`,
            functionName: 'endCampaign',
            args: [
                campaignId
            ]
        })
    }

    return (
        {
            startCampaign,
            contribute,
            endCampaign
        }
    )
}