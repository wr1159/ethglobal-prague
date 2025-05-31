export interface TimeTravelConfig {
  usdcTokenAddr: `0x${string}`;
  tokenOwner: `0x${string}`;
  prover:
    | { endBlock: "latest"; travelRange: bigint; step: bigint }
    | { startBlock: bigint; endBlock: bigint; step: bigint };
}

export const chainToTimeTravelConfig: Record<string, TimeTravelConfig> = {
  anvil: {
    tokenOwner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    usdcTokenAddr: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    prover: {
      startBlock: BigInt(1),
      endBlock: BigInt(40),
      step: BigInt(10),
    },
  },
  optimismSepolia: {
    tokenOwner: "0x1e527408BFC6Fcaf91a7Fb0c80D11F57E8f171Cb",
    usdcTokenAddr: "0x4200000000000000000000000000000000000006",
    prover: {
      startBlock: BigInt(28450964),
      endBlock: BigInt(28450984),
      step: BigInt(2),
    },
  },
  optimism: {
    tokenOwner: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    usdcTokenAddr: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
    prover: {
      endBlock: "latest",
      travelRange: BigInt(10),
      step: BigInt(2),
    },
  },
};

export const getTimeTravelConfig = (chainName: string): TimeTravelConfig => {
  const config: TimeTravelConfig | undefined =
    chainToTimeTravelConfig[chainName];
  if (!config) {
    throw new Error(
      `The "${chainName}" chain is not yet configured in this example.`
    );
  }
  return config;
};
