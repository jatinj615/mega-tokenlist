import * as fs from 'fs'
import * as path from 'path'
import { CHAIN_IDS, type Chain } from './chains'
import type { TokenData, TokenList, TokenListToken } from './types'

const DATA_DIR = path.join(__dirname, '..', 'data')
const OUTPUT_FILE = path.join(__dirname, '..', 'megaeth.tokenlist.json')
const LOGO_BASE_URL =
  'https://raw.githubusercontent.com/megaeth-labs/mega-tokenlist/main/data'

function getLogoExtension(tokenDir: string): string | null {
  const svgPath = path.join(tokenDir, 'logo.svg')
  const pngPath = path.join(tokenDir, 'logo.png')

  if (fs.existsSync(svgPath)) return 'svg'
  if (fs.existsSync(pngPath)) return 'png'
  return null
}

function readTokenData(symbol: string): TokenData {
  const dataPath = path.join(DATA_DIR, symbol, 'data.json')
  const content = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(content) as TokenData
}

export function generate(): TokenList {
  // Read all token directories
  const tokenDirs = fs
    .readdirSync(DATA_DIR)
    .filter((name) => {
      const stat = fs.statSync(path.join(DATA_DIR, name))
      return stat.isDirectory()
    })
    .sort()

  const tokens: TokenListToken[] = []

  for (const symbol of tokenDirs) {
    const tokenDir = path.join(DATA_DIR, symbol)
    const tokenData = readTokenData(symbol)
    const logoExt = getLogoExtension(tokenDir)

    // Create token entries for each chain
    for (const [chain, chainToken] of Object.entries(tokenData.tokens)) {
      if (!chainToken?.address) continue

      const chainId = CHAIN_IDS[chain as Chain]
      if (!chainId) continue

      const token: TokenListToken = {
        chainId,
        address: chainToken.address,
        name: tokenData.name,
        symbol: tokenData.symbol,
        decimals: tokenData.decimals,
        extensions: chainToken.bridge
          ? {
              isNative: false,
              bridgeAddress: chainToken.bridge,
              bridgeType: 'canonical' as const,
            }
          : { isNative: true },
      }

      if (logoExt) {
        token.logoURI = `${LOGO_BASE_URL}/${symbol}/logo.${logoExt}`
      }

      tokens.push(token)
    }
  }

  // Sort tokens by chainId, then symbol
  tokens.sort((a, b) => {
    if (a.chainId !== b.chainId) return a.chainId - b.chainId
    return a.symbol.localeCompare(b.symbol)
  })

  const tokenList: TokenList = {
    name: 'MegaETH Token List',
    timestamp: new Date().toISOString(),
    version: {
      major: 1,
      minor: 0,
      patch: 0,
    },
    tokens,
  }

  return tokenList
}

// Main execution
if (require.main === module) {
  const tokenList = generate()
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tokenList, null, 2))
  console.log(`Generated ${OUTPUT_FILE} with ${tokenList.tokens.length} tokens`)
}
