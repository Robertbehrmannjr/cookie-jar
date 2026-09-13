# X Thread — Cookie Jar

**1/**
Built Cookie Jar 🍪 — a community tip jar cApp for @CookieChain (SVM).

Connect your wallet, drop a tip in the shared on-chain jar, and crack open a fortune cookie the instant your tx confirms. Live analytics, live activity feed, zero backend.

🔗 https://cookie-jar-two.vercel.app
💻 https://github.com/Robertbehrmannjr/cookie-jar

[demo video/gif]

**2/**
How it works:

→ Connect a wallet (Nightly supported natively — Cookie Chain is SVM, so standard Solana tooling just works)
→ Send COOK to the community jar + an optional on-chain memo
→ Confirm in your wallet
→ Get a fortune, deterministically generated from your tx signature

**3/**
Everything you see updates live, straight from the chain:

→ Jar balance & tip count
→ Volume chart
→ Unique tippers
→ A feed of every tip + memo, polled directly via getSignaturesForAddress — no indexer, no backend

Cookie Chain's sub-second finality makes this feel instant.

**4/**
Don't have COOK yet? Bridge it in from Solana in seconds via the official Hyperlane route:

🌉 https://hyperlane.cookiescan.io

It's a 1:1 lock/unlock bridge secured by a community multi-sig — no mint/burn, no single party controlling reserves.

**5/**
Built with React + TypeScript + Vite + @solana/web3.js + @solana/wallet-adapter-react, pointed straight at Cookie Chain's RPC (rpc.cookiescan.io). Fully open source, MIT-style, PRs welcome.

🔗 https://github.com/Robertbehrmannjr/cookie-jar

#CookieChain #SVM #Solana
