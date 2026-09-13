export const COOKIE_CHAIN_RPC =
  import.meta.env.VITE_RPC_ENDPOINT ?? 'https://rpc.cookiescan.io'

export const COOKIE_JAR_ADDRESS =
  import.meta.env.VITE_COOKIE_JAR_ADDRESS ??
  '5cQ5Sb6mhnqfYZUvAx6DXtb6Z4oW3FhTT3KB7ZiNwQHX'

export const COOKIESCAN_API = 'https://api.cookiescan.io'

export const MIN_TIP_COOK = 0.001
// Cookie Chain is SVM-compatible and uses the same lamport denomination as
// Solana, just for its own native gas token, COOK (not SOL).
export const LAMPORTS_PER_COOK = 1_000_000_000
export const FEED_POLL_MS = 8000
