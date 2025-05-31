"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeSelector } from "@/components/badge-selector";

export default function DashboardPage() {
  const router = useRouter();
  const {
    ready,
    authenticated,
    user,
    linkWallet,
    unlinkWallet,
    linkTwitter,
    unlinkTwitter,
  } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const wallet = user?.wallet;
  const twitterSubject = user?.twitter?.subject || null;
  const twitterUsername = user?.twitter?.username;

  if (!ready || !authenticated) {
    return (
      <main className="flex flex-col min-h-screen px-4 sm:px-8 py-6 bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen px-4 sm:px-8 py-6 bg-background">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Persona Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your Web3 identity and obtain badges based on your on-chain
            activity
          </p>
        </div>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle>🔗 Account Connections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-medium">Twitter Account</p>
                {twitterUsername ? (
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">@{twitterUsername}</p>
                    <Button
                      onClick={() =>
                        twitterSubject && unlinkTwitter(twitterSubject)
                      }
                      variant="outline"
                      size="sm"
                      disabled={!canRemoveAccount}
                    >
                      Unlink
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Not connected</p>
                    <Button onClick={linkTwitter} size="sm">
                      Link Twitter
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="font-medium">Wallet</p>
                {wallet ? (
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground font-mono">
                      {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </p>
                    <Button
                      onClick={() => unlinkWallet(wallet.address)}
                      variant="outline"
                      size="sm"
                      disabled={!canRemoveAccount}
                    >
                      Unlink
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Not connected</p>
                    <Button onClick={linkWallet} size="sm">
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {(!wallet || !twitterUsername) && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  ⚠️ Both Twitter and wallet connections are required to obtain
                  badges.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Badge Selector */}
        <BadgeSelector />

        {/* Debug Information - Only show in development */}
        {process.env.NODE_ENV === "development" && (
          <Card>
            <CardHeader>
              <CardTitle>🔍 Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-w-4xl bg-muted text-sm font-mono p-4 rounded-md overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
