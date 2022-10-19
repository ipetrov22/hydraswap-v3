// // a list of tokens by chain
// import { Currency, Token } from '@uniswap/sdk-core'

// import { SupportedChainId } from './chains'
// import {
//   AMPL,
//   CEUR_CELO,
//   CEUR_CELO_ALFAJORES,
//   CMC02_CELO,
//   CUSD_CELO,
//   CUSD_CELO_ALFAJORES,
//   DAI,
//   DAI_ARBITRUM_ONE,
//   DAI_OPTIMISM,
//   DAI_POLYGON,
//   ETH2X_FLI,
//   FEI,
//   FRAX,
//   FXS,
//   nativeOnChain,
//   PORTAL_ETH_CELO,
//   PORTAL_USDC_CELO,
//   renBTC,
//   rETH2,
//   sETH2,
//   SWISE,
//   TRIBE,
//   USDC_ARBITRUM,
//   USDC_MAINNET,
//   USDC_OPTIMISM,
//   USDC_POLYGON,
//   USDT,
//   USDT_ARBITRUM_ONE,
//   USDT_OPTIMISM,
//   USDT_POLYGON,
//   WBTC,
//   WBTC_ARBITRUM_ONE,
//   WBTC_OPTIMISM,
//   WBTC_POLYGON,
//   WETH_POLYGON,
//   WETH_POLYGON_MUMBAI,
//   WRAPPED_NATIVE_CURRENCY,
// } from './tokens'

// type ChainTokenList = {
//   readonly [chainId: number]: Token[]
// }

// type ChainCurrencyList = {
//   readonly [chainId: number]: Currency[]
// }

// const WRAPPED_NATIVE_CURRENCIES_ONLY: ChainTokenList = Object.fromEntries(
//   Object.entries(WRAPPED_NATIVE_CURRENCY)
//     .map(([key, value]) => [key, [value]])
//     .filter(Boolean)
// )

// // used to construct intermediary pairs for trading
// export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
//   ...WRAPPED_NATIVE_CURRENCIES_ONLY,
//   [SupportedChainId.MAINNET]: [
//     ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.MAINNET],
//     DAI,
//     USDC_MAINNET,
//     USDT,
//     WBTC,
//   ],
//   [SupportedChainId.OPTIMISM]: [
//     ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.OPTIMISM],
//     DAI_OPTIMISM,
//     USDT_OPTIMISM,
//     WBTC_OPTIMISM,
//   ],
//   [SupportedChainId.ARBITRUM_ONE]: [
//     ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.ARBITRUM_ONE],
//     DAI_ARBITRUM_ONE,
//     USDT_ARBITRUM_ONE,
//     WBTC_ARBITRUM_ONE,
//   ],
//   [SupportedChainId.POLYGON]: [
//     ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.POLYGON],
//     DAI_POLYGON,
//     USDC_POLYGON,
//     USDT_POLYGON,
//     WETH_POLYGON,
//   ],
//   [SupportedChainId.CELO]: [CUSD_CELO, CEUR_CELO, CMC02_CELO, PORTAL_USDC_CELO, PORTAL_ETH_CELO],
// }
// export const ADDITIONAL_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {
//   [SupportedChainId.MAINNET]: {
//     '0xF16E4d813f4DcfDe4c5b44f305c908742De84eF0': [ETH2X_FLI],
//     [rETH2.address]: [sETH2],
//     [SWISE.address]: [sETH2],
//     [FEI.address]: [TRIBE],
//     [TRIBE.address]: [FEI],
//     [FRAX.address]: [FXS],
//     [FXS.address]: [FRAX],
//     [WBTC.address]: [renBTC],
//     [renBTC.address]: [WBTC],
//   },
// }
// /**
//  * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
//  * tokens.
//  */
// export const CUSTOM_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {
//   [SupportedChainId.MAINNET]: {
//     [AMPL.address]: [DAI, WRAPPED_NATIVE_CURRENCY[SupportedChainId.MAINNET] as Token],
//   },
// }

// /**
//  * Shows up in the currency select for swap and add liquidity
//  */
// export const COMMON_BASES: ChainCurrencyList = {
//   [SupportedChainId.MAINNET]: [
//     nativeOnChain(SupportedChainId.MAINNET),
//     DAI,
//     USDC_MAINNET,
//     USDT,
//     WBTC,
//     WRAPPED_NATIVE_CURRENCY[SupportedChainId.MAINNET] as Token,
//   ],
//   [SupportedChainId.ROPSTEN]: [
//     nativeOnChain(SupportedChainId.ROPSTEN),
//     WRAPPED_NATIVE_CURRENCY[SupportedChainId.ROPSTEN] as Token,
//   ],
//   [SupportedChainId.RINKEBY]: [
//     nativeOnChain(SupportedChainId.RINKEBY),
//     WRAPPED_NATIVE_CURRENCY[SupportedChainId.RINKEBY] as Token,
//   ],
//   [SupportedChainId.GOERLI]: [
//     nativeOnChain(SupportedChainId.GOERLI),
//     WRAPPED_NATIVE_CURRENCY[SupportedChainId.GOERLI] as Token,
//   ],
//   [SupportedChainId.KOVAN]: [
//     nativeOnChain(SupportedChainId.KOVAN),
//     WRAPPED_NATIVE_CURRENCY[SupportedChainId.KOVAN] as Token,
//   ],
//   [SupportedChainId.ARBITRUM_ONE]: [
//     nativeOnChain(SupportedChainId.ARBITRUM_ONE),
//     DAI_ARBITRUM_ONE,
//     USDC_ARBITRUM,
//     USDT_ARBITRUM_ONE,
//     WBTC_ARBITRUM_ONE,
//     WRAPPED_NATIVE_CURRENCY[SupportedChainId.ARBITRUM_ONE] as Token,
//   ],
//   [SupportedChainId.ARBITRUM_RINKEBY]: [
//     nativeOnChain(SupportedChainId.ARBITRUM_RINKEBY),
//     WRAPPED_NATIVE_CURRENCY[SupportedChainId.ARBITRUM_RINKEBY] as Token,
//   ],
//   [SupportedChainId.OPTIMISM]: [
//     nativeOnChain(SupportedChainId.OPTIMISM),
//     DAI_OPTIMISM,
//     USDC_OPTIMISM,
//     USDT_OPTIMISM,
//     WBTC_OPTIMISM,
//   ],
//   [SupportedChainId.OPTIMISTIC_KOVAN]: [nativeOnChain(SupportedChainId.OPTIMISTIC_KOVAN)],
//   [SupportedChainId.POLYGON]: [
//     nativeOnChain(SupportedChainId.POLYGON),
//     WETH_POLYGON,
//     USDC_POLYGON,
//     DAI_POLYGON,
//     USDT_POLYGON,
//     WBTC_POLYGON,
//   ],
//   [SupportedChainId.POLYGON_MUMBAI]: [
//     nativeOnChain(SupportedChainId.POLYGON_MUMBAI),
//     WRAPPED_NATIVE_CURRENCY[SupportedChainId.POLYGON_MUMBAI] as Token,
//     WETH_POLYGON_MUMBAI,
//   ],

//   [SupportedChainId.CELO]: [
//     nativeOnChain(SupportedChainId.CELO),
//     CEUR_CELO,
//     CUSD_CELO,
//     PORTAL_ETH_CELO,
//     PORTAL_USDC_CELO,
//     CMC02_CELO,
//   ],
//   [SupportedChainId.CELO_ALFAJORES]: [
//     nativeOnChain(SupportedChainId.CELO_ALFAJORES),
//     CUSD_CELO_ALFAJORES,
//     CEUR_CELO_ALFAJORES,
//   ],
// }

// // used to construct the list of all pairs we consider by default in the frontend
// export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
//   ...WRAPPED_NATIVE_CURRENCIES_ONLY,
//   [SupportedChainId.MAINNET]: [
//     ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.MAINNET],
//     DAI,
//     USDC_MAINNET,
//     USDT,
//     WBTC,
//   ],
// }
// export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
//   [SupportedChainId.MAINNET]: [
//     [
//       new Token(SupportedChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
//       new Token(
//         SupportedChainId.MAINNET,
//         '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
//         8,
//         'cUSDC',
//         'Compound USD Coin'
//       ),
//     ],
//     [USDC_MAINNET, USDT],
//     [DAI, USDT],
//   ],
// }

// a list of tokens by chain
import { Token } from '@uniswap/sdk-core'
import { ChainId, WHYDRA } from 'hydra/sdk'

export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')

// Hydra tokens
export const LOC = new Token(ChainId.MAINNET, '0x4ab26aaa1803daa638910d71075c06386e391147', 8, 'LOC', 'LockTrip')

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WHYDRA[ChainId.MAINNET]],
  [ChainId.TESTNET]: [WHYDRA[ChainId.TESTNET]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], LOC],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
// export const CUSTOM_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {

export const CUSTOM_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    // [AMPL.address]: [DAI, WHYDRA[ChainId.MAINNET]]
  },
}

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainTokenList = {
  ...WETH_ONLY,
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET]],
}

export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
  [ChainId.MAINNET]: [],
}
