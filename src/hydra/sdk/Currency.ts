import { NativeCurrency, Token } from '@uniswap/sdk-core'

import { ChainId } from './constants'
import { WHYDRA } from './Token'

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
  public static readonly HYDRA_TESTNET: Currency = new Currency(ChainId.TESTNET, 8, 'HYDRA', 'Hydra')
  equals(other: Currency): boolean {
    return other.chainId === this.chainId && other.name?.toLowerCase() === this.name?.toLowerCase()
  }
  get wrapped(): Token {
    const chainId: keyof typeof WHYDRA = this.chainId
    return WHYDRA[chainId]
  }
}

const { HYDRA, HYDRA_TESTNET } = Currency
const HYDRA_CURRENCIES = {
  [ChainId.MAINNET]: HYDRA,
  [ChainId.TESTNET]: HYDRA_TESTNET,
}
export { HYDRA, HYDRA_CURRENCIES }
