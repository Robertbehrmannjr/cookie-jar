import { useMemo, type ReactNode } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { COOKIE_CHAIN_RPC, COOKIE_CHAIN_WS } from '../lib/constants'

import '@solana/wallet-adapter-react-ui/styles.css'

export function AppWalletProvider({ children }: { children: ReactNode }) {
  // Nightly (and any other Wallet Standard wallet) is auto-detected by the
  // adapter registry at runtime — no explicit adapter needed. These two are
  // kept only as a fallback for browsers/extensions that predate the
  // Wallet Standard.
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={COOKIE_CHAIN_RPC} config={{ wsEndpoint: COOKIE_CHAIN_WS }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
