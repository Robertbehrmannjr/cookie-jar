export const COOKIE_CHAIN_RPC =
  import.meta.env.VITE_RPC_ENDPOINT ?? 'https://rpc.cookiescan.io'

// Cookie Chain's websocket endpoint lives on a different host than the RPC
// one (wss.cookiescan.io, not rpc.cookiescan.io) — @solana/web3.js can't
// derive it automatically, so it must be passed explicitly or signature
// subscriptions (used by confirmTransaction) silently never resolve.
export const COOKIE_CHAIN_WS =
  import.meta.env.VITE_WS_ENDPOINT ?? 'wss://wss.cookiescan.io'

export const COOKIE_JAR_ADDRESS =
  import.meta.env.VITE_COOKIE_JAR_ADDRESS ??
  '5cQ5Sb6mhnqfYZUvAx6DXtb6Z4oW3FhTT3KB7ZiNwQHX'

export const COOKIESCAN_API = 'https://api.cookiescan.io'

export const MIN_TIP_COOK = 0.001
// Cookie Chain is SVM-compatible and uses the same lamport denomination as
// Solana, just for its own native gas token, COOK (not SOL).
export const LAMPORTS_PER_COOK = 1_000_000_000
// Cookie Chain advertises sub-second finality, so poll aggressively for a
// near-instant feel; a manual refresh() is also triggered right after a tip
// confirms instead of waiting for the next tick.
export const FEED_POLL_MS = 1500
