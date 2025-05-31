"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAddressSummary } from "@/lib/blockscout";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";
import { erc721Abi, pudgyMinterVerifierAbi } from "@/src/generated";
import { personaBadgeAddress, PudgyMinterVerifierAddress } from "@/lib/config";
import { useProver } from "@/lib/useProver";
import { useLocalStorage } from "usehooks-ts";

interface AddressSummary {
  netWorth: {
    totalValueUSD: number;
    breakdown: {
      nativeToken: {
        balance: string;
      };
    };
  };
  nftHoldings: unknown[];
  transactionCount: number;
  topHoldings: Array<{
    token: {
      symbol: string;
    };
    balanceFormatted: string;
  }>;
}

interface BadgeRequirement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  checkEligibility: (summary: AddressSummary) => boolean;
}

const AVAILABLE_BADGES: BadgeRequirement[] = [
  {
    id: "crypto-whale",
    emoji: "🐋",
    title: "Crypto Whale",
    description: "Portfolio worth over $100k",
    checkEligibility: (summary) => summary?.netWorth?.totalValueUSD > 100000,
  },
  {
    id: "nft-collector",
    emoji: "🎨",
    title: "NFT Collector",
    description: "Owns 5+ unique NFTs",
    checkEligibility: (summary) => summary?.nftHoldings?.length >= 5,
  },
  {
    id: "active-trader",
    emoji: "⚡",
    title: "Active Trader",
    description: "100+ on-chain transactions",
    checkEligibility: (summary) => summary?.transactionCount >= 100,
  },
  {
    id: "eth-maximalist",
    emoji: "🔷",
    title: "ETH Maximalist",
    description: "Holds 10+ ETH",
    checkEligibility: (summary) => {
      const ethBalance = parseFloat(
        summary?.netWorth?.breakdown?.nativeToken?.balance || "0"
      );
      return ethBalance >= 10;
    },
  },
  {
    id: "has-eth",
    emoji: "🥶",
    title: "Has ETH",
    description: "Holds >0 ETH",
    checkEligibility: (summary) => {
      const ethBalance = parseFloat(
        summary?.netWorth?.breakdown?.nativeToken?.balance || "0"
      );
      return ethBalance > 0;
    },
  },
  {
    id: "pudgy-minter",
    emoji: "🐧",
    title: "OG Pudgy Minter",
    description: "Minted a Pudgy",
    checkEligibility: () => {
      return false;
    },
  },
];

interface BadgeEligibility {
  badge: BadgeRequirement;
  eligible: boolean;
  obtained: boolean;
}

export function BadgeSelector() {
  const { user } = usePrivy();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [badgeEligibility, setBadgeEligibility] = useState<BadgeEligibility[]>(
    []
  );
  const [selectedBadges, setSelectedBadges] = useState<Set<string>>(new Set());
  const [obtainingBadges, setObtainingBadges] = useState(false);
  const [proverResult] = useLocalStorage("proverResult", "");
  const { callProver, result } = useProver();

  const { writeContract } = useWriteContract();

  const walletAddress = user?.wallet?.address;
  const twitterUsername = user?.twitter?.username;

  const checkBadgeEligibility = async () => {
    if (!walletAddress) return;

    setAnalyzing(true);
    try {
      const summary = await getAddressSummary(walletAddress);
      const obtainedBadgeDescriptions = await loadObtainedBadges();

      const eligibilityResults = AVAILABLE_BADGES.map((badge) => ({
        badge,
        eligible: badge.checkEligibility(summary),
        obtained:
          obtainedBadgeDescriptions?.has(`${badge.emoji} ${badge.title}`) ||
          false,
      }));

      setBadgeEligibility(eligibilityResults);
    } catch (error) {
      console.error("Error checking badge eligibility:", error);
      toast("Failed to analyze wallet. Please try again.");
    } finally {
      setAnalyzing(false);
      setLoading(false);
    }
  };

  const loadObtainedBadges = async () => {
    if (!twitterUsername) return;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("persona")
        .select("description")
        .eq("username", twitterUsername);

      if (error) throw error;

      const obtainedBadgeDescriptions = new Set(
        data?.map((row) => row.description) || []
      );

      setBadgeEligibility((prev) =>
        prev.map((item) => ({
          ...item,
          obtained: obtainedBadgeDescriptions.has(
            `${item.badge.emoji} ${item.badge.title}`
          ),
        }))
      );
      return obtainedBadgeDescriptions;
    } catch (error) {
      console.error("Error loading obtained badges:", error);
    }
  };

  useEffect(() => {
    if (walletAddress && twitterUsername) {
      checkBadgeEligibility();
    }
    const checkPudgyMinter = async () => {
      await callProver([walletAddress as `0x${string}`]);
    };
    checkPudgyMinter();
  }, [walletAddress, twitterUsername]);

  useEffect(() => {
    const checkPudgyMinter = async () => {
      await callProver([walletAddress as `0x${string}`]);
    };
    checkPudgyMinter();
  }, [walletAddress]);
  useEffect(() => {
    if (result) {
      console.log("result", result);
      //   Change PudgyPenguin Eligibilty to true if result is true
      setBadgeEligibility((prev) =>
        prev.map((item) => ({
          ...item,
          eligible: item.badge.id === "pudgy-minter" ? true : item.eligible,
        }))
      );
    }
    // callProver([walletAddress as `0x${string}`]);
    // checkPudgyMinter();
    if (result && walletAddress) {
      console.log("can call prover");
      console.log(callProver);
      //   callProver([walletAddress as `0x${string}`]);
    }
  }, [result, walletAddress]);

  const toggleBadgeSelection = (badgeId: string) => {
    setSelectedBadges((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(badgeId)) {
        newSet.delete(badgeId);
      } else {
        newSet.add(badgeId);
      }
      return newSet;
    });
  };

  const obtainSelectedBadges = async () => {
    if (!twitterUsername || selectedBadges.size === 0) return;

    setObtainingBadges(true);
    try {
      const randomId = Math.floor(Math.random() * 10000);
      if (selectedBadges.has("pudgy-minter") && proverResult) {
        console.log("minting pudgy minter");
        console.log("proverResult", proverResult);
        const [proof, owner, balance] = JSON.parse(proverResult as string) as [
          unknown,
          `0x${string}`,
          string,
        ];
        console.log("proof", proof);
        console.log("owner", owner);
        console.log("balance", balance);
        await writeContract({
          address: PudgyMinterVerifierAddress,
          abi: pudgyMinterVerifierAbi,
          functionName: "claim",
          //@ts-expect-error proof is unknown
          args: [proof, owner, BigInt(balance)],
        });
      } else {
        await writeContract({
          address: personaBadgeAddress,
          abi: erc721Abi,
          functionName: "mint",
          args: [walletAddress as `0x${string}`, BigInt(randomId)],
        });
      }
      const supabase = createClient();
      const badgesToInsert = Array.from(selectedBadges)
        .map((badgeId) => {
          const badgeInfo = badgeEligibility.find(
            (item) => item.badge.id === badgeId
          );
          if (!badgeInfo || badgeInfo.obtained) return null;

          return {
            username: twitterUsername,
            description: `${badgeInfo.badge.emoji} ${badgeInfo.badge.title}`,
          };
        })
        .filter(Boolean);

      if (badgesToInsert.length === 0) {
        toast("No new badges to obtain");
        return;
      }

      const { error } = await supabase.from("persona").insert(badgesToInsert);

      if (error) throw error;

      toast(`Successfully obtained ${badgesToInsert.length} badge(s)!`);
      setSelectedBadges(new Set());
      loadObtainedBadges(); // Refresh obtained badges
    } catch (error) {
      console.error("Error obtaining badges:", error);
      toast("Failed to obtain badges. Please try again.");
    } finally {
      setObtainingBadges(false);
    }
  };

  if (!walletAddress || !twitterUsername) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Please connect both your wallet and Twitter account to view
            available badges.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">
              Loading badge eligibility...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const eligibleBadges = badgeEligibility.filter(
    (item) => item.eligible && !item.obtained
  );
  const selectedCount = selectedBadges.size;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏆 Available Badges
            {analyzing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select badges you qualify for and click &ldquo;Obtain
            Selected&rdquo; to add them to your profile.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badgeEligibility.map((item) => {
              const { badge, eligible, obtained } = item;
              const isSelected = selectedBadges.has(badge.id);
              const isDisabled = !eligible || obtained;

              return (
                <Card
                  key={badge.id}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? "ring-2 ring-primary border-primary"
                      : isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-md"
                  }`}
                  onClick={() => !isDisabled && toggleBadgeSelection(badge.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{badge.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">
                            {badge.title}
                          </h3>
                          {obtained && (
                            <Badge variant="secondary" className="text-xs">
                              Obtained
                            </Badge>
                          )}
                          {eligible && !obtained && (
                            <Badge variant="default" className="text-xs">
                              Eligible
                            </Badge>
                          )}
                          {!eligible && (
                            <Badge variant="outline" className="text-xs">
                              Not Eligible
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {eligibleBadges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {badgeEligibility.every((item) => item.obtained)
                  ? "🎉 Congratulations! You've obtained all available badges."
                  : "Keep building your Web3 portfolio to unlock more badges!"}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {selectedCount} badge{selectedCount !== 1 ? "s" : ""} selected
              </div>
              <Button
                onClick={obtainSelectedBadges}
                disabled={selectedCount === 0 || obtainingBadges}
                size="sm"
              >
                {obtainingBadges
                  ? "Obtaining..."
                  : `Obtain Selected (${selectedCount})`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Wallet Analysis (Powered by Blockscout)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Twitter:</p>
              <p className="text-muted-foreground">@{twitterUsername}</p>
            </div>
            <div>
              <p className="font-medium">Wallet:</p>
              <p className="text-muted-foreground font-mono">
                {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
              </p>
            </div>
          </div>
          <Button
            onClick={checkBadgeEligibility}
            variant="outline"
            size="sm"
            className="mt-4"
            disabled={analyzing}
          >
            {analyzing ? "Analyzing..." : "Re-analyze Wallet"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
