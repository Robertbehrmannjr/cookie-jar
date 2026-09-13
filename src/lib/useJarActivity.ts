import { useCallback, useEffect, useRef, useState } from 'react'
import { PublicKey, type Connection } from '@solana/web3.js'
import { COOKIE_JAR_ADDRESS, FEED_POLL_MS, LAMPORTS_PER_COOK } from './constants'

export interface JarTip {
  signature: string
  slot: number
  blockTime: number | null
  amountCook: number
  from: string | null
  memo: string | null
}

const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'

function extractMemo(tx: Awaited<ReturnType<Connection['getParsedTransaction']>>): string | null {
  if (!tx) return null
  const ix = tx.transaction.message.instructions.find(
    (i) => 'programId' in i && i.programId.toBase58() === MEMO_PROGRAM_ID,
  )
  if (!ix) return null
  // Memo instructions are parsed as raw base58 data; decode via the 'parsed' field when present.
  return 'parsed' in ix && typeof ix.parsed === 'string' ? ix.parsed : null
}

function extractTipAmount(
  tx: Awaited<ReturnType<Connection['getParsedTransaction']>>,
  jar: string,
): { amountCook: number; from: string | null } {
  if (!tx?.meta) return { amountCook: 0, from: null }
  const keys = tx.transaction.message.accountKeys.map((k) => k.pubkey.toBase58())
  const jarIndex = keys.indexOf(jar)
  if (jarIndex === -1) return { amountCook: 0, from: null }
  const delta = (tx.meta.postBalances[jarIndex] - tx.meta.preBalances[jarIndex]) / LAMPORTS_PER_COOK
  const from = keys.find((k) => k !== jar) ?? null
  return { amountCook: delta, from }
}

/** Polls the jar address for recent activity directly from the chain (no backend/indexer needed). */
export function useJarActivity(connection: Connection) {
  const [tips, setTips] = useState<JarTip[]>([])
  const [jarBalance, setJarBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const knownSignatures = useRef(new Set<string>())
  const pollRef = useRef<() => Promise<void>>(async () => {})

  useEffect(() => {
    let cancelled = false
    const jar = new PublicKey(COOKIE_JAR_ADDRESS)

    async function poll() {
      try {
        const [balanceLamports, signatures] = await Promise.all([
          connection.getBalance(jar),
          connection.getSignaturesForAddress(jar, { limit: 25 }),
        ])
        if (cancelled) return
        setJarBalance(balanceLamports / LAMPORTS_PER_COOK)

        const fresh = signatures.filter((s) => !knownSignatures.current.has(s.signature))
        if (fresh.length > 0) {
          const parsed = await Promise.all(
            fresh.map((s) => connection.getParsedTransaction(s.signature, { maxSupportedTransactionVersion: 0 })),
          )
          if (cancelled) return

          const newTips: JarTip[] = fresh.map((s, i) => {
            const tx = parsed[i]
            const { amountCook, from } = extractTipAmount(tx, jar.toBase58())
            return {
              signature: s.signature,
              slot: s.slot,
              blockTime: s.blockTime ?? null,
              amountCook,
              from,
              memo: extractMemo(tx),
            }
          })

          fresh.forEach((s) => knownSignatures.current.add(s.signature))
          setTips((prev) =>
            [...newTips, ...prev]
              .filter((t) => t.amountCook > 0)
              .sort((a, b) => (b.blockTime ?? 0) - (a.blockTime ?? 0))
              .slice(0, 50),
          )
        }
      } catch (err) {
        console.error('jar activity poll failed', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    pollRef.current = poll
    poll()
    const id = setInterval(poll, FEED_POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [connection])

  const refresh = useCallback(() => pollRef.current(), [])

  return { tips, jarBalance, loading, refresh }
}
