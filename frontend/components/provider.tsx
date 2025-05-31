"use client";

import { config } from "@/lib/config";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProofProvider } from "@vlayer/react";

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
          <ProofProvider
            config={{
              token:
                "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnZpcm9ubWVudCI6InRlc3QiLCJpYXQiOjE3NDg3MjUyNTIsImV4cCI6MTc4MDM0NzY1Miwic3ViIjoiNFNGcU4rWlY2Q0J2L1MyTWlHSFNteVV2UHpNTG1BYVcva1A5MVd0SlZ1QXh0RnhYRXZqZWU0d0trTURQM1ZsNWk5dE1MczlLTUdFSUpKeW5SYjlLTmc9PSJ9.IVX7_cbzSB8FOAxSkRJmuBx8dkMLDwcjbigQk9jlTcRddx31KRQaB2SaI8nyp6egGCMTSjMvKENK9ai5numXGcjQ-CSQUEdfdww2fK2RmcxTcQxeKMYulwM11hcMqJWDox06XfPegi8ODO7KNXTKP09KdoEudQ0SJYUptvCDY28AGmZWJ29BPjRGIqrUg_zo_-uCgMKs1Tfnroswmtkq8WpLXWEowsNNz_runb9lzSoYbHgqRlxRGy6Prx55GmCM3O6gFV68wGaakQDZzv0hUfyW6ThROECKtP3zbtJeTjp70miwXr7RkA5OMv9YOVx9Ne4yu1oChkma2JJIx2hsUXQlDKpGczmNGB31taxG9-92tYqkbiBPuD5chK-AjRCBp2bnW5ITCsFP6Bl4i4rMMtE1rSGMIqtTCgmL2j2UvhWL-uzjj_EFahTGNdEIGLmEne89rz9XzBjbB7lKmPhx14iB7-xq1W5NRTocm_IW7uKvzs1NpuRRAVjUlx2FmajyDF4PzSIOxO5kslsLQejtVwymw1GC6qAOqLr-yPxLlR8ypUVC7jA6hM14nP3dMUNijeUX-RMHrgRNt3iNABu6vongQUEmjhQqrYOugMs24qvB9jAXNg7BCkdRoa5eOM9hrozyQrGUxKVvKiUHxFSiAfJ-A5VReADWJsclKAVYvlA",
              // please dont steal my key :(
            }}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </ProofProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
