import type { Chain } from './chains'

// Token address on a specific chain
export interface Token {
  address: string
  bridge?: string // Bridge address if token is bridged (not native)
}

// Token data.json schema
export interface TokenData {
  name: string
  symbol: string
  decimals: number
  description?: string
  website?: string
  tokens: Partial<Record<Chain, Token>>
}

// Token extensions for native/bridged status
export interface TokenExtensions {
  isNative: boolean
  bridgeAddress?: string
  bridgeType?: 'canonical'
}

// Uniswap TokenList standard types
export interface TokenListToken {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI?: string
  extensions: TokenExtensions
}

export interface TokenListVersion {
  major: number
  minor: number
  patch: number
}

export interface TokenList {
  name: string
  timestamp: string
  version: TokenListVersion
  tokens: TokenListToken[]
}
