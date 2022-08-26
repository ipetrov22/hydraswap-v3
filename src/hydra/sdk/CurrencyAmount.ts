import { CurrencyAmount as CurrencyAmountUNI } from '@uniswap/sdk-core'

import { BigintIsh } from './constants'
import { Currency, HYDRA } from './Currency'

export class CurrencyAmount extends CurrencyAmountUNI<Currency> {
  /**
   * Helper that calls the constructor with the ETHER currency
   * @param amount ether amount in wei
   */
  public static hydra(amount: BigintIsh): CurrencyAmount {
    return new CurrencyAmount(HYDRA, amount)
  }
}
