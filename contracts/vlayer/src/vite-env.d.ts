/// <reference types="vite/client" />

type Address = "0x${string}";

interface ImportMetaEnv {
  readonly VITE_PROVER_ADDRESS: Address;
  readonly VITE_VERIFIER_ADDRESS: Address;
  readonly VITE_PROVER_URL: string;
  readonly VITE_CHAIN_NAME: string;
  readonly VITE_PROVER_ERC20_HOLDER_ADDR: Address;
  readonly VITE_VLAYER_API_TOKEN: Address;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_START_BLOCK: string;
  readonly VITE_END_BLOCK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
