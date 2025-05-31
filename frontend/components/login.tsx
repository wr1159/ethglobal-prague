"use client";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: () => router.push("/dashboard"),
  });

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard");
    }
  }, [ready, authenticated, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Welcome to Persona</h2>
            <p className="text-muted-foreground">
              Connect your wallet and Twitter to start showcasing your Web3
              identity
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-2">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-xl">Get Started</CardTitle>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>You&apos;ll be able to:</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Link your Twitter and wallet securely
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Choose badges based on your holdings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Display verified identity on Twitter
                </li>
              </ul>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              onClick={login}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold"
              disabled={!ready}
            >
              {!ready ? "Loading..." : "Connect with Privy"}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                By connecting, you agree to link your Twitter account and wallet
              </p>
              <p className="text-xs text-muted-foreground">
                Secured by Privy • No private keys stored
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-card border rounded-xl flex items-center justify-center mx-auto shadow-sm">
              🔗
            </div>
            <div className="text-xs text-muted-foreground">
              Secure
              <br />
              Linking
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-card border rounded-xl flex items-center justify-center mx-auto shadow-sm">
              🎯
            </div>
            <div className="text-xs text-muted-foreground">
              Choose
              <br />
              Badges
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-card border rounded-xl flex items-center justify-center mx-auto shadow-sm">
              ✨
            </div>
            <div className="text-xs text-muted-foreground">
              Display
              <br />
              Identity
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
