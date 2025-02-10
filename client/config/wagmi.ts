import { createConfig, http, injected } from "wagmi";
import { hardhat } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
    chains: [hardhat],
    connectors: [metaMask(), injected()],
    transports: {
        [hardhat.id] : http('http://localhost:8545')
    },
    ssr: true,
})
