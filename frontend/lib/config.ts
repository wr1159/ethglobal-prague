import { http, createConfig } from "wagmi";
import { optimismSepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [optimismSepolia],
  transports: {
    [optimismSepolia.id]: http(),
  },
});

export const personaBadgeAddress = "0x8fca86f6b461c5288de4bad95f90e25b3a01bb50";
export const pudgyMinterProofAddress =
  "0x11F23C6B9F986d97eb43BE8d3b3DEAB8De455E34";
export const PudgyMinterVerifierAddress =
  "0xe8eE9E5494733074c1b8A8AA32742968386D36D9";
