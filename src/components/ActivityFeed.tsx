import type { JarTip } from '../lib/useJarActivity'

function timeAgo(blockTime: number | null) {
  if (!blockTime) return 'just now'
  const seconds = Math.max(0, Math.floor(Date.now() / 1000 - blockTime))
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  return `${Math.floor(seconds / 3600)}h ago`
}

function short(address: string | null) {
  if (!address) return 'unknown'
  return `${address.slice(0, 4)}…${address.slice(-4)}`
}

export function ActivityFeed({ tips, loading }: { tips: JarTip[]; loading: boolean }) {
  return (
    <div className="card activity-feed">
      <h2>Live jar activity</h2>
      {loading && tips.length === 0 && <p className="muted">Loading recent tips…</p>}
      {!loading && tips.length === 0 && <p className="muted">No tips yet — be the first to drop a cookie.</p>}
      <ul>
        {tips.map((tip) => (
          <li key={tip.signature} className="activity-row">
            <div className="activity-main">
              <span className="activity-amount">+{tip.amountCook.toFixed(4)} COOK</span>
              <span className="activity-from">from {short(tip.from)}</span>
            </div>
            {tip.memo && <p className="activity-memo">"{tip.memo}"</p>}
            <div className="activity-meta">
              <span>{timeAgo(tip.blockTime)}</span>
              <a href={`https://cookiescan.io/tx/${tip.signature}`} target="_blank" rel="noreferrer">
                {tip.signature.slice(0, 8)}…
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
