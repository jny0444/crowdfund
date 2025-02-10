import { useReadContract } from "wagmi";
import { wagmiContractConfig } from "@/constants/wagmiConfig";

export function useContractFunctionsRead() {
    
    async function getCampaigns() {
        const { data: campaign } = useReadContract({
            ...wagmiContractConfig,
            functionName: "getAllCampaigns"
        })

        return campaign;
    }

    async function getDonors(campaignId: number) {
        const { data: donors } = useReadContract({
            ...wagmiContractConfig,
            functionName: "getAllDonors",
            args: [campaignId]
        })

        return donors;
    }

    return (
        {
            getCampaigns,
            getDonors
        }
    )
}