import { useConnection } from '@solana/wallet-adapter-react'
import { AppWalletProvider } from './context/AppWalletProvider'
import { WalletBar } from './components/WalletBar'
import { TipJar } from './components/TipJar'
import { ActivityFeed } from './components/ActivityFeed'
import { Analytics } from './components/Analytics'
import { useJarActivity } from './lib/useJarActivity'
import { COOKIE_JAR_ADDRESS } from './lib/constants'
import './App.css'

function Dashboard() {
  const { connection } = useConnection()
  const { tips, jarBalance, loading } = useJarActivity(connection)

  return (
    <div className="app-shell">
      <WalletBar />

      <main className="layout">
        <div className="layout-left">
          <TipJar />
          <div className="jar-address card">
            <span className="muted">Community jar address</span>
            <code>{COOKIE_JAR_ADDRESS}</code>
          </div>
        </div>
        <div className="layout-right">
          <Analytics tips={tips} jarBalance={jarBalance} />
          <ActivityFeed tips={tips} loading={loading} />
        </div>
      </main>

      <footer className="app-footer">
        Built on <a href="https://www.cookiechain.wtf" target="_blank" rel="noreferrer">Cookie Chain</a> ·
        {' '}<a href="https://cookieswap.fun/" target="_blank" rel="noreferrer">Cookieswap</a> ·
        {' '}<a href="https://cookiescan.io" target="_blank" rel="noreferrer">CookieScan</a>
      </footer>
    </div>
  )
}

function App() {
  return (
    <AppWalletProvider>
      <Dashboard />
    </AppWalletProvider>
  )
}

export default App
