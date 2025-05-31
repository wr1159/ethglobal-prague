"use client";

import { config } from "@/lib/config";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmbc2htvb0005la0ne7e6xurm"
      clientId="client-WY6M9SVmmqx23iFVWEV5tVdoGn86vxxCLGBk5NPakCTWp"
      config={{ embeddedWallets: { createOnLogin: "off" } }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
