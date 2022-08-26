import { NativeCurrency } from '@uniswap/sdk-core'

import { ChainId } from './constants'
import { Token, WHYDRA } from './Token'

/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */
export class Currency extends NativeCurrency {
  /**
   * The only instance of the base class `Currency`.
   */
  public static readonly HYDRA: Currency = new Currency(ChainId.MAINNET, 8, 'HYDRA', 'Hydra')
  equals(other: Currency): boolean {
    return other.chainId === this.chainId && other.isToken && other.name?.toLowerCase() === this.name?.toLowerCase()
  }
  get wrapped(): Token {
    return WHYDRA[ChainId.MAINNET]
  }
}

const HYDRA = Currency.HYDRA
export { HYDRA }
