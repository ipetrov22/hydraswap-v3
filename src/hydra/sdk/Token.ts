import { Token } from '@uniswap/sdk-core'

import { ChainId } from './constants'

export const WHYDRA = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xcc74ab8d0e2366956b3cb6d8a8c7f14872c9a987',
    8,
    'WHYDRA',
    'Wrapped Hydra'
  ),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0x6d9115a21863ce31b44cd231e4c4ccc87566222f',
    8,
    'WHYDRA',
    'Wrapped Hydra'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0x6d9115a21863ce31b44cd231e4c4ccc87566222f',
    8,
    'WHYDRA',
    'Wrapped Hydra'
  ),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, '0x6d9115a21863ce31b44cd231e4c4ccc87566222f', 8, 'WHYDRA', 'Wrapped Hydra'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0x6d9115a21863ce31b44cd231e4c4ccc87566222f', 8, 'WHYDRA', 'Wrapped Hydra'),
}
