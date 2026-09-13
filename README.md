# 🍪 Cookie Jar

A community tip jar cApp for [Cookie Chain](https://www.cookiechain.wtf), built for the *Build a cApp on Cookie Chain* challenge.

Connect a wallet, drop SOL into the shared on-chain jar, attach a message, and crack open a
deterministic on-chain "fortune cookie" the moment your transaction confirms. Every tip is
public, streamed live from the chain (no backend/indexer), and rolled up into a small
analytics dashboard.

## Live features

- **Wallet connect** — any [Wallet Standard](https://github.com/wallet-standard/wallet-standard)
  wallet works out of the box, including **Nightly**. Phantom/Solflare adapters are wired in as
  a fallback for older extensions.
- **Real transactions on Cookie Chain** — a `SystemProgram.transfer` (+ optional memo
  instruction) sent straight to the chain's SVM runtime via `https://rpc.cookiescan.io`.
- **Transaction lifecycle feedback** — building → awaiting signature → confirming → success/error,
  each with its own UI state.
- **Fortune cookies** — a message deterministically derived from your transaction signature, so
  it's reproducible and impossible to game.
- **Live activity feed** — polls `getSignaturesForAddress`/`getParsedTransaction` on the jar
  address directly, no server required.
- **Analytics dashboard** — jar balance, tip count, cumulative volume chart (via Recharts), and
  unique tippers.
- **CookieScan deep links** — every transaction and the jar address link out to CookieScan.

## Tech stack

- React + TypeScript + Vite
- `@solana/web3.js` + `@solana/wallet-adapter-react` (Cookie Chain is Solana/SVM compatible, so
  standard Solana tooling talks to it directly — just point the RPC endpoint at Cookie Chain)
- Recharts for the volume chart

## Getting started

```bash
pnpm install   # or npm install
pnpm dev       # or npm run dev
```

> This repo installs with **pnpm** by default (`corepack pnpm install`). If you use plain `npm`
> and hit a crash while resolving `vite`'s package metadata, that's a local npm/registry cache
> issue unrelated to this project — clearing `npm cache verify` or switching to pnpm resolves it.

Copy `.env.example` to `.env` to override the RPC endpoint or jar address:

```bash
cp .env.example .env
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_RPC_ENDPOINT` | `https://rpc.cookiescan.io` | Cookie Chain JSON-RPC endpoint |
| `VITE_COOKIE_JAR_ADDRESS` | `5cQ5Sb6mhnqfYZUvAx6DXtb6Z4oW3FhTT3KB7ZiNwQHX` | Public address of the community jar |

## Community jar address

```
5cQ5Sb6mhnqfYZUvAx6DXtb6Z4oW3FhTT3KB7ZiNwQHX
```

This is a freshly generated Cookie Chain (SVM) keypair used purely as a receive-only public
address for the demo jar — the app never needs or touches its private key. **Fund it with a
small amount of testnet/devnet SOL before demoing** so `getBalance` renders a live number.

## How a tip flows through the app

1. User connects a wallet (`AppWalletProvider` → `@solana/wallet-adapter-react`).
2. `TipJar` builds a `Transaction` with a `SystemProgram.transfer` to the jar address, plus an
   optional SPL Memo instruction carrying the user's message.
3. `sendTransaction` hands it to the connected wallet for signing, the app awaits confirmation
   via `connection.confirmTransaction`, and shows the fortune cookie on success.
4. `useJarActivity` polls the jar address every few seconds, decodes each transaction's memo and
   balance delta, and feeds both the `ActivityFeed` and `Analytics` components — all client-side,
   directly against Cookie Chain's RPC.

## Extending with the Cookie ecosystem

The dashboard already deep-links to [CookieScan](https://cookiescan.io). Natural next
integrations:

- **Cookiebox** — swap widget so tippers without SOL can acquire it before tipping.
- **Cookieswap** — quote/execute a swap directly from the "Connect a wallet first" empty state.
- **Cookie DAS API** (`api.cookiescan.io`) — replace the client-side polling analytics with richer
  historical data once rate limits/auth are available.

## Project structure

```
src/
  components/       UI: WalletBar, TipJar, ActivityFeed, Analytics
  context/           AppWalletProvider (wallet-adapter wiring)
  lib/                constants, fortunes, useJarActivity hook
```

## Deployment

Any static host works (Vercel/Netlify/Cloudflare Pages) — `pnpm build` outputs `dist/`.
Set the two environment variables above in your host's dashboard.

## Disclosure

Built with assistance from Claude (Anthropic) as a coding agent.
