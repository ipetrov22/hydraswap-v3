import _Big from 'big.js'
import JSBI from 'jsbi'
import toFormat from 'toformat'

import { BigintIsh, Rounding, TEN } from './constants'
import { Currency, HYDRA } from './Currency'
import { Fraction } from './Fraction'
import { parseBigintIsh } from './utils'

const Big = toFormat(_Big)

export class CurrencyAmount extends Fraction {
  public readonly currency: Currency

  /**
   * Helper that calls the constructor with the ETHER currency
   * @param amount ether amount in wei
   */
  public static hydra(amount: BigintIsh): CurrencyAmount {
    return new CurrencyAmount(HYDRA, amount)
  }

  // amount _must_ be raw, i.e. in the native representation
  protected constructor(currency: Currency, amount: BigintIsh) {
    const parsedAmount = parseBigintIsh(amount)

    super(parsedAmount, JSBI.exponentiate(TEN, JSBI.BigInt(currency.decimals)))
    this.currency = currency
  }

  public get raw(): JSBI {
    return this.numerator
  }

  public add(other: CurrencyAmount): CurrencyAmount {
    return new CurrencyAmount(this.currency, JSBI.add(this.raw, other.raw))
  }

  public subtract(other: CurrencyAmount): CurrencyAmount {
    return new CurrencyAmount(this.currency, JSBI.subtract(this.raw, other.raw))
  }

  public toSignificant(
    significantDigits = 6,
    format?: Record<string, unknown>,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: Record<string, unknown>,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: Record<string, unknown> = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(format)
  }
}
