/**
 * Example usage of Blockscout API utilities
 * This file demonstrates how to use the various functions to fetch on-chain data
 */

import {
  getTopHoldings,
  getNFTHoldings,
  getNetWorth,
  getAddressSummary,
  isValidAddress,
  type TopHolding,
  type NFTHolding,
} from "./blockscout";

/**
 * Example: Fetch top token holdings for an address
 */
export async function exampleGetTopHoldings() {
  const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik.eth

  try {
    const holdings = await getTopHoldings(address, 5);

    console.log("Top Holdings:");
    holdings.forEach((holding: TopHolding, index: number) => {
      console.log(
        `${index + 1}. ${holding.token.symbol}: ${holding.balanceFormatted}`
      );
      if (holding.valueUSD) {
        console.log(`   Value: $${holding.valueUSD.toFixed(2)}`);
      }
    });

    return holdings;
  } catch (error) {
    console.error("Failed to fetch top holdings:", error);
    throw error;
  }
}

/**
 * Example: Fetch NFT collection for an address
 */
export async function exampleGetNFTs() {
  const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik.eth

  try {
    const nfts = await getNFTHoldings(address, 10);

    console.log("NFT Holdings:");
    nfts.forEach((nft: NFTHolding, index: number) => {
      console.log(`${index + 1}. ${nft.name} (${nft.token.symbol})`);
      if (nft.image) {
        console.log(`   Image: ${nft.image}`);
      }
      if (nft.attributes && nft.attributes.length > 0) {
        console.log("   Attributes:", nft.attributes.slice(0, 3)); // Show first 3 attributes
      }
    });

    return nfts;
  } catch (error) {
    console.error("Failed to fetch NFTs:", error);
    throw error;
  }
}

/**
 * Example: Calculate net worth for an address
 */
export async function exampleGetNetWorth() {
  const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik.eth

  try {
    const netWorth = await getNetWorth(address);

    console.log("Net Worth Analysis:");
    console.log(`Total Value: $${netWorth.totalValueUSD.toFixed(2)}`);
    console.log(
      `Native Token (${
        netWorth.breakdown.nativeToken.symbol
      }): $${netWorth.nativeTokenValue.toFixed(2)}`
    );
    console.log(`ERC-20 Tokens: $${netWorth.erc20TokensValue.toFixed(2)}`);
    console.log(`NFTs (estimated): $${netWorth.nftEstimatedValue.toFixed(2)}`);
    console.log(`NFT Count: ${netWorth.breakdown.nftCount}`);

    return netWorth;
  } catch (error) {
    console.error("Failed to calculate net worth:", error);
    throw error;
  }
}

/**
 * Example: Get comprehensive address summary for badge generation
 */
export async function exampleGetAddressSummary() {
  const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik.eth

  if (!isValidAddress(address)) {
    throw new Error("Invalid address format");
  }

  try {
    const summary = await getAddressSummary(address);

    console.log("Address Summary:");
    console.log(`Address: ${summary.address}`);
    console.log(`Transaction Count: ${summary.transactionCount}`);
    console.log(`Token Transfers: ${summary.tokenTransferCount}`);
    console.log(`Is Contract: ${summary.isContract}`);
    console.log(`Is Verified: ${summary.isVerified}`);

    console.log("\nBadge Eligibility:");
    console.log(
      `Significant Holdings (>$1k): ${summary.summary.hasSignificantHoldings}`
    );
    console.log(`Active Trader (>100 txs): ${summary.summary.isActiveTrader}`);
    console.log(`NFT Collector (>5 NFTs): ${summary.summary.isNFTCollector}`);
    console.log(`Whale (>$100k): ${summary.summary.isWhale}`);

    console.log("\nTop 3 Token Holdings:");
    summary.topHoldings
      .slice(0, 3)
      .forEach((holding: TopHolding, index: number) => {
        console.log(
          `${index + 1}. ${holding.token.symbol}: ${holding.balanceFormatted}`
        );
      });

    return summary;
  } catch (error) {
    console.error("Failed to get address summary:", error);
    throw error;
  }
}

/**
 * Example: Generate badge suggestions based on address data
 */
export async function generateBadgeSuggestions(address: string) {
  try {
    const summary = await getAddressSummary(address);
    const badges: string[] = [];

    // Badge suggestions based on holdings and activity
    if (summary.summary.isWhale) {
      badges.push("🐋 Crypto Whale - Portfolio > $100k");
    } else if (summary.summary.hasSignificantHoldings) {
      badges.push("💎 Diamond Hands - Portfolio > $1k");
    }

    if (summary.summary.isActiveTrader) {
      badges.push("⚡ Active Trader - 100+ transactions");
    }

    if (summary.summary.isNFTCollector) {
      badges.push("🎨 NFT Collector - 5+ NFTs");
    }

    // Specific token holdings badges
    summary.topHoldings.forEach((holding: TopHolding) => {
      const symbol = holding.token.symbol.toUpperCase();
      const balance = parseFloat(holding.balanceFormatted);

      if (symbol === "ETH" && balance > 10) {
        badges.push("🔷 ETH Maximalist - 10+ ETH");
      } else if (symbol === "USDC" && balance > 10000) {
        badges.push("🏦 Stablecoin Holder - 10k+ USDC");
      } else if (symbol === "UNI" && balance > 100) {
        badges.push("🦄 Uniswap Supporter - 100+ UNI");
      }
      // Add more token-specific badges as needed
    });

    // Contract interaction badges
    if (summary.isContract) {
      badges.push("🤖 Smart Contract");
    }

    if (summary.isVerified) {
      badges.push("✅ Verified Contract");
    }

    // Activity level badges
    if (summary.transactionCount > 1000) {
      badges.push("🚀 Power User - 1000+ transactions");
    } else if (summary.transactionCount > 500) {
      badges.push("📈 Active User - 500+ transactions");
    }

    console.log(`\nSuggested badges for ${address}:`);
    badges.forEach((badge, index) => {
      console.log(`${index + 1}. ${badge}`);
    });

    return badges;
  } catch (error) {
    console.error("Failed to generate badge suggestions:", error);
    throw error;
  }
}

/**
 * Example: Validate multiple addresses
 */
export function exampleAddressValidation() {
  const addresses = [
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // Valid
    "0x742d35Cc6634C0532925a3b8D4C9db1a7d", // Invalid (too short)
    "not-an-address", // Invalid
    "0x742d35Cc6634C0532925a3b8D4C9db1a7d8b9f90f1c2e3d4a5b6c7e8f9a0b1c2", // Invalid (too long)
  ];

  console.log("Address Validation Results:");
  addresses.forEach((addr, index) => {
    const isValid = isValidAddress(addr);
    console.log(
      `${index + 1}. ${addr}: ${isValid ? "✅ Valid" : "❌ Invalid"}`
    );
  });
}

// Export all example functions for easy testing
export const examples = {
  getTopHoldings: exampleGetTopHoldings,
  getNFTs: exampleGetNFTs,
  getNetWorth: exampleGetNetWorth,
  getAddressSummary: exampleGetAddressSummary,
  generateBadgeSuggestions,
  addressValidation: exampleAddressValidation,
};
