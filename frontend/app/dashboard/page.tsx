"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

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

  return (
    <>
      <main className="flex flex-col min-h-screen px-4 sm:px-20 py-6 bg-privy-light-blue">
        {ready && authenticated ? (
          <>
            <div className="flex gap-4 flex-wrap">
              {twitterSubject ? (
                <Button
                  onClick={() => {
                    unlinkTwitter(twitterSubject);
                  }}
                  variant={"outline"}
                  disabled={!canRemoveAccount}
                >
                  Unlink Twitter
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    linkTwitter();
                  }}
                >
                  Link Twitter
                </Button>
              )}

              {wallet ? (
                <Button
                  onClick={() => {
                    unlinkWallet(wallet.address);
                  }}
                  variant={"outline"}
                  disabled={!canRemoveAccount}
                >
                  Unlink wallet
                </Button>
              ) : (
                <Button onClick={linkWallet}>Connect wallet</Button>
              )}
            </div>

            <p className="mt-6 font-bold uppercase text-sm text-gray-600">
              User object
            </p>
            <pre className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2">
              {JSON.stringify(user, null, 2)}
            </pre>
          </>
        ) : null}
      </main>
    </>
  );
}
