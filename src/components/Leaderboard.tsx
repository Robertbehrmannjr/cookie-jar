import type { JarTip } from '../lib/useJarActivity'

function short(address: string | null) {
  if (!address) return 'unknown'
  return `${address.slice(0, 4)}…${address.slice(-4)}`
}

const MEDALS = ['🥇', '🥈', '🥉']

export function Leaderboard({ tips }: { tips: JarTip[] }) {
  const totals = new Map<string, number>()
  for (const tip of tips) {
    if (!tip.from) continue
    totals.set(tip.from, (totals.get(tip.from) ?? 0) + tip.amountCook)
  }

  const ranked = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="card leaderboard">
      <h2>Top tippers</h2>
      {ranked.length === 0 ? (
        <p className="muted">Nobody's cracked the top spot yet — could be you.</p>
      ) : (
        <ol>
          {ranked.map(([address, total], i) => (
            <li key={address} className="leaderboard-row">
              <span className="leaderboard-rank">{MEDALS[i] ?? `#${i + 1}`}</span>
              <span className="leaderboard-address">{short(address)}</span>
              <span className="leaderboard-total">{total.toFixed(3)} COOK</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
