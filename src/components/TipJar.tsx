import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js'
import { COOKIE_JAR_ADDRESS, LAMPORTS_PER_COOK, MIN_TIP_COOK } from '../lib/constants'
import { fortuneFromSignature } from '../lib/fortunes'
import { confirmBySignaturePolling } from '../lib/confirmTx'

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')

type Status =
  | { kind: 'idle' }
  | { kind: 'building' }
  | { kind: 'awaiting-signature' }
  | { kind: 'confirming'; signature: string }
  | { kind: 'success'; signature: string; fortune: string }
  | { kind: 'error'; message: string }

export function TipJar() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, connected } = useWallet()
  const [amount, setAmount] = useState('0.01')
  const [memo, setMemo] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function handleTip(e: React.FormEvent) {
    e.preventDefault()
    if (!publicKey) return

    const sol = Number(amount)
    if (!Number.isFinite(sol) || sol < MIN_TIP_COOK) {
      setStatus({ kind: 'error', message: `Tip must be at least ${MIN_TIP_COOK} COOK.` })
      return
    }

    try {
      setStatus({ kind: 'building' })
      const jar = new PublicKey(COOKIE_JAR_ADDRESS)
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: jar,
          lamports: Math.round(sol * LAMPORTS_PER_COOK),
        }),
      )
      if (memo.trim()) {
        tx.add(
          new TransactionInstruction({
            keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
            programId: MEMO_PROGRAM_ID,
            data: Buffer.from(memo.trim().slice(0, 200), 'utf-8'),
          }),
        )
      }

      setStatus({ kind: 'awaiting-signature' })
      const signature = await sendTransaction(tx, connection)

      setStatus({ kind: 'confirming', signature })
      await confirmBySignaturePolling(connection, signature)

      setStatus({ kind: 'success', signature, fortune: fortuneFromSignature(signature) })
      setMemo('')
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Transaction failed. Please try again.',
      })
    }
  }

  return (
    <form className="tip-jar card" onSubmit={handleTip}>
      <h2>Drop a cookie in the jar</h2>
      <p className="muted">
        Send a tip to the community jar and crack open an on-chain fortune cookie.
      </p>

      <label className="field">
        <span>Amount (COOK)</span>
        <input
          type="number"
          step="0.001"
          min={MIN_TIP_COOK}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!connected || status.kind === 'building' || status.kind === 'awaiting-signature'}
        />
      </label>

      <label className="field">
        <span>Message (optional, on-chain memo)</span>
        <input
          type="text"
          maxLength={200}
          placeholder="gm cookie chain"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          disabled={!connected || status.kind === 'building' || status.kind === 'awaiting-signature'}
        />
      </label>

      <button
        type="submit"
        className="primary-btn"
        disabled={!connected || status.kind === 'building' || status.kind === 'awaiting-signature' || status.kind === 'confirming'}
      >
        {connected ? 'Tip the jar 🍪' : 'Connect a wallet first'}
      </button>

      <StatusBanner status={status} />
    </form>
  )
}

function StatusBanner({ status }: { status: Status }) {
  if (status.kind === 'idle') return null

  if (status.kind === 'building' || status.kind === 'awaiting-signature') {
    return <div className="status-banner status-pending">Waiting for wallet approval…</div>
  }

  if (status.kind === 'confirming') {
    return (
      <div className="status-banner status-pending">
        Confirming on-chain… <code>{status.signature.slice(0, 12)}…</code>
      </div>
    )
  }

  if (status.kind === 'success') {
    return (
      <div className="status-banner status-success">
        <strong>Tip confirmed! 🎉</strong>
        <p className="fortune">"{status.fortune}"</p>
        <a
          href={`https://cookiescan.io/tx/${status.signature}`}
          target="_blank"
          rel="noreferrer"
        >
          View on CookieScan ↗
        </a>
      </div>
    )
  }

  return <div className="status-banner status-error">⚠ {status.message}</div>
}
