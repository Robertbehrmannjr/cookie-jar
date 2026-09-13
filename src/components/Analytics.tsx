import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import type { JarTip } from '../lib/useJarActivity'

function buildVolumeSeries(tips: JarTip[]) {
  const sorted = [...tips].sort((a, b) => (a.blockTime ?? 0) - (b.blockTime ?? 0))
  let running = 0
  return sorted.map((t) => {
    running += t.amountSol
    return {
      time: t.blockTime ? new Date(t.blockTime * 1000).toLocaleTimeString() : '',
      cumulative: Number(running.toFixed(4)),
    }
  })
}

export function Analytics({ tips, jarBalance }: { tips: JarTip[]; jarBalance: number | null }) {
  const totalTips = tips.length
  const totalVolume = tips.reduce((sum, t) => sum + t.amountSol, 0)
  const uniqueTippers = new Set(tips.map((t) => t.from).filter(Boolean)).size
  const series = buildVolumeSeries(tips)

  return (
    <div className="card analytics">
      <h2>Jar analytics</h2>
      <div className="stat-grid">
        <div className="stat">
          <span className="stat-value">{jarBalance !== null ? jarBalance.toFixed(3) : '—'}</span>
          <span className="stat-label">SOL in jar</span>
        </div>
        <div className="stat">
          <span className="stat-value">{totalTips}</span>
          <span className="stat-label">tips (last 25)</span>
        </div>
        <div className="stat">
          <span className="stat-value">{totalVolume.toFixed(3)}</span>
          <span className="stat-label">volume tracked</span>
        </div>
        <div className="stat">
          <span className="stat-value">{uniqueTippers}</span>
          <span className="stat-label">unique tippers</span>
        </div>
      </div>

      {series.length > 1 ? (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={series}>
            <defs>
              <linearGradient id="cookieGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.55} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} minTickGap={30} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} width={40} />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}
              labelStyle={{ color: 'var(--text)' }}
            />
            <Area type="monotone" dataKey="cumulative" stroke="var(--accent)" fill="url(#cookieGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p className="muted">Chart fills in once there's more jar activity to plot.</p>
      )}
    </div>
  )
}
