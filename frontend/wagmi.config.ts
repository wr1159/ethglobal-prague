import { defineConfig } from "@wagmi/cli";
import { foundry } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [],
  plugins: [
    foundry({
      project: "../contracts",
      deployments: {
        persona: {
          11155420: "0x8fca86f6b461c5288de4bad95f90e25b3a01bb50",
        },
      },
    }),
  ],
});
