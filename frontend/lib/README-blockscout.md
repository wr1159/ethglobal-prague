# Blockscout API Utilities

This module provides a comprehensive set of utility functions for interacting with the Blockscout API to fetch on-chain data including token holdings, NFTs, and net worth calculations.

## Setup

1. Set the `BLOCKSCOUT_BASE_URL` environment variable in your `.env` file:

```bash
BLOCKSCOUT_BASE_URL=https://eth.blockscout.com
```

For other networks, use the appropriate Blockscout instance URL:

- Ethereum: `https://eth.blockscout.com`
- Polygon: `https://polygon.blockscout.com`
- Optimism: `https://optimism.blockscout.com`
- Base: `https://base.blockscout.com`

## Available Functions

### Core Functions

#### `getTopHoldings(address: string, limit?: number): Promise<TopHolding[]>`

Fetches the top ERC-20 token holdings for an address, sorted by USD value when available.

```typescript
import { getTopHoldings } from './lib/blockscout';

const holdings = await getTopHoldings('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 10);
console.log(holdings);
// Returns array of TopHolding objects with token info, balance, and USD value
```

#### `getNFTHoldings(address: string, limit?: number): Promise<NFTHolding[]>`

Fetches NFT holdings (ERC-721 and ERC-1155) for an address with metadata.

```typescript
import { getNFTHoldings } from './lib/blockscout';

const nfts = await getNFTHoldings('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 20);
console.log(nfts);
// Returns array of NFTHolding objects with token info, metadata, and images
```

#### `getNetWorth(address: string): Promise<NetWorthData>`

Calculates estimated net worth including native tokens, ERC-20 tokens, and rough NFT estimates.

```typescript
import { getNetWorth } from './lib/blockscout';

const netWorth = await getNetWorth('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
console.log(`Total Value: $${netWorth.totalValueUSD}`);
```

#### `getAddressSummary(address: string)`

Comprehensive address analysis including holdings, NFTs, activity metrics, and badge eligibility.

```typescript
import { getAddressSummary } from './lib/blockscout';

const summary = await getAddressSummary('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
console.log(summary.summary); // Badge eligibility flags
```

### Utility Functions

#### `isValidAddress(address: string): boolean`

Validates Ethereum address format.

```typescript
import { isValidAddress } from './lib/blockscout';

if (isValidAddress(userInput)) {
  // Proceed with API calls
}
```

## Types

### `TopHolding`

```typescript
interface TopHolding {
  token: BlockscoutToken;
  balance: string;
  balanceFormatted: string;
  valueUSD?: number;
}
```

### `NFTHolding`

```typescript
interface NFTHolding {
  token: BlockscoutToken;
  tokenId: string;
  name?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}
```

### `NetWorthData`

```typescript
interface NetWorthData {
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
```

## Usage Examples

### Basic Usage

```typescript
import { getTopHoldings, getNFTHoldings, isValidAddress } from './lib/blockscout';

async function analyzeAddress(address: string) {
  if (!isValidAddress(address)) {
    throw new Error('Invalid address');
  }

  // Fetch top 5 token holdings
  const holdings = await getTopHoldings(address, 5);
  
  // Fetch NFT collection
  const nfts = await getNFTHoldings(address, 10);
  
  return { holdings, nfts };
}
```

### Badge Generation

```typescript
import { getAddressSummary } from './lib/blockscout';

async function generateBadges(address: string) {
  const summary = await getAddressSummary(address);
  const badges = [];
  
  if (summary.summary.isWhale) {
    badges.push('🐋 Crypto Whale');
  }
  
  if (summary.summary.isNFTCollector) {
    badges.push('🎨 NFT Collector');
  }
  
  return badges;
}
```

### Error Handling

```typescript
import { getNetWorth } from './lib/blockscout';

async function safeGetNetWorth(address: string) {
  try {
    const netWorth = await getNetWorth(address);
    return netWorth;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Blockscout API error:', error.message);
    }
    return null;
  }
}
```

## Configuration

The utility functions use the following configuration:

- **Base URL**: Configurable via `BLOCKSCOUT_BASE_URL` environment variable
- **API Version**: v2 (latest)
- **Request Timeout**: 10 seconds
- **Retry Logic**: Built-in error handling with descriptive messages

## Rate Limiting

Be mindful of API rate limits when making multiple requests. The functions are designed to be efficient and make parallel requests where possible, but you should implement your own rate limiting if making many requests in succession.

## Examples File

See `blockscout-example.ts` for comprehensive usage examples and badge generation logic.

## Best Practices

1. **Always validate addresses** before making API calls
2. **Handle errors gracefully** - network issues can occur
3. **Cache results** when appropriate to reduce API calls
4. **Use appropriate limits** for your use case to avoid unnecessary data
5. **Implement retry logic** for production applications

## Supported Networks

This utility works with any Blockscout instance. Popular networks include:

- Ethereum Mainnet
- Polygon
- Optimism
- Base
- Arbitrum
- And many more L2s and sidechains

Just update the `BLOCKSCOUT_BASE_URL` to point to the appropriate instance.
