export type FortuneRarity = 'common' | 'rare' | 'legendary'

export interface Fortune {
  message: string
  rarity: FortuneRarity
}

const COMMON = [
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

const RARE = [
  'The jar whispers your name to future tippers. Rare cookie, rare vibes.',
  'One in five. You cracked a rare one — frame this signature.',
  'The validators are talking about you. Good things, probably.',
  'Rare fortune: your bags and your karma are both about to get heavier.',
]

const LEGENDARY = [
  'LEGENDARY. This signature belongs in the CookieScan hall of fame.',
  'You just hit the 3%. Somewhere, the community multi-sig nods in approval.',
  "Legendary pull. Screenshot this before it's too immutable to believe.",
]

function hashOf(signature: string): number {
  let hash = 0
  for (let i = 0; i < signature.length; i++) {
    hash = (hash * 31 + signature.charCodeAt(i)) >>> 0
  }
  return hash
}

/** Deterministic fortune derived from the tx signature so it's reproducible/verifiable. */
export function fortuneFromSignature(signature: string): Fortune {
  const hash = hashOf(signature)
  const roll = hash % 100

  if (roll < 3) {
    return { message: LEGENDARY[hash % LEGENDARY.length], rarity: 'legendary' }
  }
  if (roll < 20) {
    return { message: RARE[hash % RARE.length], rarity: 'rare' }
  }
  return { message: COMMON[hash % COMMON.length], rarity: 'common' }
}
