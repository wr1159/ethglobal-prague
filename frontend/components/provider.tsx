"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmbc2htvb0005la0ne7e6xurm"
      clientId="client-WY6M9SVmmqx23iFVWEV5tVdoGn86vxxCLGBk5NPakCTWp"
      config={{}}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </PrivyProvider>
  );
}
