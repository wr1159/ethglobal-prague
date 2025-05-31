# Persona – Wallet-Verified Badges for Twitter  

_An ETHGlobal Prague 2025 hackathon project_

Persona lets anyone **prove on Twitter their on-chain activity**.  
Users link a wallet and Twitter account once, pick which on-chain facts they wish to show (e.g., _Owns a Pudgy Penguin NFT_), then mint a badge NFT that our Chrome extension displays beside their tweets.  
The result: fewer larps, richer identity.

---

## ✨ Why Now?

- Nearly every Web3 user signs messages with their wallet daily, yet social timelines still show anonymous @handles with no on-chain context.  
- Hackathon theme: **on-chain reputation & identity**. ETHGlobal Prague (May 30 – June 1 2025) spotlights this problem.

---

## User Flow

1. User Logins to Webapp and link Twitter with Wallet
2. User gets shown different possible badges to show
3. User selects and mints badges to display (Sign Transaction and upload to Supabase)
4. User will be able to see badges on X with extension

## ⚙️  Architecture

| Layer | Service | Role |
|-------|---------|------|
| **Auth & Linking** | **Privy** | Securely link Twitter ↔ wallet in-browser; progressive onboarding.  |
| **On-chain Data** | **Blockscout** | Fetch holdings / balances & stats via public REST API. |
| **Database** | **Supabase** (Postgres + RLS) | Stores user profile + selected badges; row-level security restricts writes to the owner’s wallet.  |
| **Badge NFT** | **Vlayer TimeTravel** | verifier contract to mint proof-of-holding NFTs.  |
| **Front-end** | **Next.js App Router** | Single webapp for connecting accounts & choosing badges (no FastAPI layer). |
| **Browser Extension** | **Vanilla JS** | Reads Supabase via REST, injects avatar & badge icons into Twitter DOM. |

---

## Project Structure

```text
ethglobal-prague/
├─ contracts/          # Badge Contracts
├─ frontend/           # Next.js pages, components, hooks
├─ extension/          # Chrome extension
└─ README.md           
```

## Set up

1. Clone Repo

```bash
git clone https://github.com/wr1159/ethglobal-prague.git
cd frontend&& pnpm i
```

2. Create .env

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON=
PRIVY_APP_ID=
PRIVY_SECRET=
BLOCKSCOUT_BASE_URL=
````

3. Run

`pnpm dev`
