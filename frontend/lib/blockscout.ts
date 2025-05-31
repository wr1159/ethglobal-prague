/**
 * Blockscout API utilities for fetching on-chain data
 * Supports fetching address statistics, holdings, NFTs, and calculating net worth
 */

// Types for Blockscout API responses
export interface BlockscoutToken {
  address: string;
  name: string;
  symbol: string;
  decimals: string;
  type: string;
  exchange_rate?: string;
  total_supply?: string;
  icon_url?: string;
}

export interface TokenBalance {
  token: BlockscoutToken;
  value: string;
  token_id?: string;
  token_instance?: {
    id: string;
    metadata?: {
      name?: string;
      description?: string;
      image?: string;
      attributes?: Array<{
        trait_type: string;
        value: string;
      }>;
    };
  };
}

export interface AddressInfo {
  hash: string;
  is_contract: boolean;
  is_verified: boolean;
  name?: string;
  exchange_rate?: string;
  coin_balance: string;
  total_sent: string;
  total_received: string;
  transactions_count: string;
  token_transfers_count: string;
}

export interface TopHolding {
  token: BlockscoutToken;
  balance: string;
  balanceFormatted: string;
  valueUSD?: number;
}

export interface NFTHolding {
  token: BlockscoutToken;
  tokenId: string;
  name?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface NetWorthData {
  totalValueUSD: number;
  nativeTokenValue: number;
  erc20TokensValue: number;
  nftEstimatedValue: number;
  breakdown: {
    nativeToken: {
      symbol: string;
      balance: string;
      valueUSD: number;
    };
    topTokens: TopHolding[];
    nftCount: number;
  };
}

// Additional types for API responses
export interface BlockscoutStatsResponse {
  coin_price?: string;
  gas_price_symbol?: string;
  total_blocks?: string;
  total_addresses?: string;
  total_transactions?: string;
  average_block_time?: string;
  coin_market_cap?: string;
  network_utilization_percentage?: number;
}

export interface BlockscoutTokensResponse {
  items: TokenBalance[];
  next_page_params?: {
    items_count: number;
    value: string;
  };
}

// Configuration
const BLOCKSCOUT_CONFIG = {
  baseUrl: process.env.BLOCKSCOUT_BASE_URL || "https://eth.blockscout.com",
  apiVersion: "v2",
  requestTimeout: 10000,
  maxRetries: 3,
};

/**
 * Base API client for Blockscout
 */
class BlockscoutAPI {
  private baseUrl: string;

  constructor(baseUrl = BLOCKSCOUT_CONFIG.baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
  }

  /**
   * Make authenticated request to Blockscout API
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api/${BLOCKSCOUT_CONFIG.apiVersion}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      BLOCKSCOUT_CONFIG.requestTimeout
    );

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `Blockscout API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout");
      }

      throw error;
    }
  }

  /**
   * Get address information including basic stats
   */
  async getAddressInfo(address: string): Promise<AddressInfo> {
    return this.makeRequest<AddressInfo>(`/addresses/${address}`);
  }

  /**
   * Get ERC-20 token balances for an address
   */
  async getTokenBalances(
    address: string,
    options: { type?: "ERC-20" | "ERC-721" | "ERC-1155"; limit?: number } = {}
  ): Promise<BlockscoutTokensResponse> {
    const params = new URLSearchParams();
    if (options.type) params.append("type", options.type);
    if (options.limit) params.append("limit", options.limit.toString());

    const queryString = params.toString();
    const endpoint = `/addresses/${address}/tokens${
      queryString ? `?${queryString}` : ""
    }`;

    return this.makeRequest<BlockscoutTokensResponse>(endpoint);
  }

  /**
   * Get NFT tokens (ERC-721 and ERC-1155) for an address
   */
  async getNFTBalances(
    address: string,
    limit = 50
  ): Promise<BlockscoutTokensResponse> {
    const params = new URLSearchParams({
      type: "ERC-721,ERC-1155",
      limit: limit.toString(),
    });

    return this.makeRequest<BlockscoutTokensResponse>(
      `/addresses/${address}/tokens?${params}`
    );
  }

  /**
   * Get native token price (ETH price for Ethereum)
   */
  async getNativeTokenPrice(): Promise<{ usd: number; symbol: string }> {
    const stats = await this.makeRequest<BlockscoutStatsResponse>("/stats");
    return {
      usd: parseFloat(stats.coin_price || "0"),
      symbol: stats.gas_price_symbol || "ETH",
    };
  }
}

// Create singleton instance
const blockscoutAPI = new BlockscoutAPI();

/**
 * Utility functions for external use
 */

/**
 * Get top ERC-20 token holdings for an address
 * Returns tokens sorted by USD value (if available) or balance
 */
export async function getTopHoldings(
  address: string,
  limit = 10
): Promise<TopHolding[]> {
  try {
    const response = await blockscoutAPI.getTokenBalances(address, {
      type: "ERC-20",
      limit: Math.max(limit, 50), // Fetch more to filter and sort
    });

    const holdings: TopHolding[] = response.items
      .map((item) => {
        const balance = item.value;
        const decimals = parseInt(item.token.decimals);
        const balanceFormatted = formatTokenBalance(balance, decimals);

        // Calculate USD value if exchange rate is available
        let valueUSD: number | undefined;
        if (item.token.exchange_rate) {
          const rate = parseFloat(item.token.exchange_rate);
          valueUSD = parseFloat(balanceFormatted) * rate;
        }

        return {
          token: item.token,
          balance,
          balanceFormatted,
          valueUSD,
        };
      })
      .filter((holding) => parseFloat(holding.balanceFormatted) > 0)
      .sort((a, b) => {
        // Sort by USD value if available, otherwise by balance
        if (a.valueUSD !== undefined && b.valueUSD !== undefined) {
          return b.valueUSD - a.valueUSD;
        }
        return parseFloat(b.balanceFormatted) - parseFloat(a.balanceFormatted);
      })
      .slice(0, limit);

    return holdings;
  } catch (error) {
    console.error("Error fetching top holdings:", error);
    throw new Error("Failed to fetch top holdings");
  }
}

/**
 * Get NFT holdings for an address
 * Returns both ERC-721 and ERC-1155 tokens with metadata
 */
export async function getNFTHoldings(
  address: string,
  limit = 20
): Promise<NFTHolding[]> {
  try {
    const response = await blockscoutAPI.getNFTBalances(address, limit);

    const nfts: NFTHolding[] = response.items.map((item) => {
      const metadata = item.token_instance?.metadata;

      return {
        token: item.token,
        tokenId: item.token_id || item.token_instance?.id || "0",
        name: metadata?.name || `${item.token.name} #${item.token_id}`,
        image: metadata?.image,
        attributes: metadata?.attributes,
      };
    });

    return nfts;
  } catch (error) {
    console.error("Error fetching NFT holdings:", error);
    throw new Error("Failed to fetch NFT holdings");
  }
}

/**
 * Calculate estimated net worth for an address
 * Includes native token balance, ERC-20 tokens, and rough NFT estimates
 */
export async function getNetWorth(address: string): Promise<NetWorthData> {
  try {
    // Fetch data in parallel
    const [addressInfo, topHoldings, nftHoldings, nativePrice] =
      await Promise.all([
        blockscoutAPI.getAddressInfo(address),
        getTopHoldings(address, 20),
        getNFTHoldings(address, 50),
        blockscoutAPI.getNativeTokenPrice(),
      ]);

    // Calculate native token value
    const nativeBalance = formatTokenBalance(addressInfo.coin_balance, 18); // ETH has 18 decimals
    const nativeTokenValue = parseFloat(nativeBalance) * nativePrice.usd;

    // Calculate ERC-20 tokens value
    const erc20TokensValue = topHoldings.reduce(
      (total, holding) => total + (holding.valueUSD || 0),
      0
    );

    // Rough NFT estimation (this is very approximate)
    // In a real implementation, you'd want to use NFT pricing APIs
    const nftEstimatedValue = nftHoldings.length * 50; // Very rough $50 per NFT estimate

    const totalValueUSD =
      nativeTokenValue + erc20TokensValue + nftEstimatedValue;

    return {
      totalValueUSD,
      nativeTokenValue,
      erc20TokensValue,
      nftEstimatedValue,
      breakdown: {
        nativeToken: {
          symbol: nativePrice.symbol,
          balance: nativeBalance,
          valueUSD: nativeTokenValue,
        },
        topTokens: topHoldings.slice(0, 10), // Top 10 for breakdown
        nftCount: nftHoldings.length,
      },
    };
  } catch (error) {
    console.error("Error calculating net worth:", error);
    throw new Error("Failed to calculate net worth");
  }
}

/**
 * Format token balance from wei/smallest unit to human readable format
 */
function formatTokenBalance(balance: string, decimals: number): string {
  const balanceBN = BigInt(balance);
  const divisor = BigInt(10 ** decimals);

  const wholePart = balanceBN / divisor;
  const fractionalPart = balanceBN % divisor;

  if (fractionalPart === BigInt(0)) {
    return wholePart.toString();
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, "0");
  const trimmedFractional = fractionalStr.replace(/0+$/, "");

  if (trimmedFractional === "") {
    return wholePart.toString();
  }

  return `${wholePart}.${trimmedFractional}`;
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Get a summary of address activity suitable for badge generation
 */
export async function getAddressSummary(address: string) {
  if (!isValidAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }

  try {
    const [addressInfo, topHoldings, nftHoldings, netWorth] = await Promise.all(
      [
        blockscoutAPI.getAddressInfo(address),
        getTopHoldings(address, 5),
        getNFTHoldings(address, 10),
        getNetWorth(address),
      ]
    );

    return {
      address,
      isContract: addressInfo.is_contract,
      isVerified: addressInfo.is_verified,
      transactionCount: parseInt(addressInfo.transactions_count),
      tokenTransferCount: parseInt(addressInfo.token_transfers_count),
      topHoldings,
      nftHoldings,
      netWorth,
      summary: {
        hasSignificantHoldings: netWorth.totalValueUSD > 1000,
        isActiveTrader: parseInt(addressInfo.transactions_count) > 100,
        isNFTCollector: nftHoldings.length > 5,
        isWhale: netWorth.totalValueUSD > 100000,
      },
    };
  } catch (error) {
    console.error("Error getting address summary:", error);
    throw error;
  }
}

export default blockscoutAPI;
