const FORTUNES = [
  'A fresh block is coming your way — finality favors the bold.',
  'The jar remembers every hand that feeds it.',
  'Your next trade will be sub-second and regret-free.',
  'Community-owned chains keep community-sized secrets.',
  'A cookie shared on-chain is a cookie that compounds.',
  'Low fees today, high conviction tomorrow.',
  'The wallet you connect is the wallet fortune favors.',
  'Somewhere, a validator smiles at your transaction.',
  'Degen energy detected. Proceed with snacks.',
  'This jar has seen wilder tips than yours. Keep going.',
  'Sub-second finality, unlimited good vibes.',
  'The chain is fast. Be faster.',
  'Every signature tells a story. Yours just got interesting.',
  'Cookies baked on-chain never crumble.',
  'Your generosity is now immutable.',
]

/** Deterministic fortune derived from the tx signature so it's reproducible/verifiable. */
export function fortuneFromSignature(signature: string): string {
  let hash = 0
  for (let i = 0; i < signature.length; i++) {
    hash = (hash * 31 + signature.charCodeAt(i)) >>> 0
  }
  return FORTUNES[hash % FORTUNES.length]
}
