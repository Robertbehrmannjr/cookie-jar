import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useEffect, useState } from 'react'
import { LAMPORTS_PER_SOL } from '../lib/constants'

function short(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`
}

export function WalletBar() {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    if (!publicKey) {
      setBalance(null)
      return
    }
    let cancelled = false
    const load = () =>
      connection
        .getBalance(publicKey)
        .then((lamports) => !cancelled && setBalance(lamports / LAMPORTS_PER_SOL))
        .catch(() => {})
    load()
    const id = setInterval(load, 10000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [publicKey, connection])

  return (
    <div className="wallet-bar">
      <div className="brand">
        <span className="cookie-emoji">🍪</span>
        <div>
          <h1>Cookie Jar</h1>
          <p className="subtitle">a community tip jar on Cookie Chain</p>
        </div>
      </div>
      <div className="wallet-bar-right">
        {connected && publicKey && (
          <div className="wallet-info">
            <span className="wallet-address">{short(publicKey.toBase58())}</span>
            <span className="wallet-balance">{balance !== null ? `${balance.toFixed(4)} SOL` : '—'}</span>
          </div>
        )}
        <WalletMultiButton />
      </div>
    </div>
  )
}
