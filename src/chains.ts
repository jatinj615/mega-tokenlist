// Chain configuration for MegaETH + Ethereum

export const CHAINS = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    layer: 1,
  },
  megaeth: {
    id: 4326,
    name: 'MegaETH',
    layer: 2,
  },
} as const

export type Chain = keyof typeof CHAINS
export type L1Chain = 'ethereum'
export type L2Chain = 'megaeth'

// Chain ID lookup
export const CHAIN_IDS: Record<Chain, number> = {
  ethereum: 1,
  megaeth: 4326,
}

// L2 to L1 mapping (for bridge relationships)
export const L2_TO_L1: Record<L2Chain, L1Chain> = {
  megaeth: 'ethereum',
}
