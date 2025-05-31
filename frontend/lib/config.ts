import { http, createConfig } from "wagmi";
import { optimismSepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [optimismSepolia],
  transports: {
    [optimismSepolia.id]: http(),
  },
});

export const personaBadgeAddress = "0x8fca86f6b461c5288de4bad95f90e25b3a01bb50";
