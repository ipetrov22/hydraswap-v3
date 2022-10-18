import { Token } from '@uniswap/sdk-core'

import { ChainId } from './constants'

export const WHYDRA = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x6d9115a21863ce31b44cd231e4c4ccc87566222f',
    8,
    'WHYDRA',
    'Wrapped Hydra'
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0xcc74ab8d0e2366956b3cb6d8a8c7f14872c9a987',
    8,
    'WHYDRA',
    'Wrapped Hydra'
  ),
}
