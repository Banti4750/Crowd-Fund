import { createConfig, http, injected } from "wagmi";
import { sepolia } from "wagmi/chains";


export const config = createConfig({
    chains: [sepolia],
    connectors: [
        injected(),
    ],
    transports: {
        [sepolia.id]: http(),
    }
})