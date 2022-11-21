import { Currency, Percent } from '@uniswap/sdk-core'
import { ONE_HUNDRED_PERCENT, ZERO_PERCENT } from 'constants/misc'
import { JSBI, TradeType } from 'hydra/sdk'
import { Trade } from 'hydra-v2-sdk'
import { InterfaceTrade } from 'state/routing/types'

// returns whether tradeB is better than tradeA by at least a threshold percentage amount
export function isTradeBetter(
  tradeA: Trade<Currency, Currency, TradeType> | InterfaceTrade<Currency, Currency, TradeType> | undefined | null,
  tradeB: Trade<Currency, Currency, TradeType> | InterfaceTrade<Currency, Currency, TradeType> | undefined | null,
  minimumDelta: Percent = ZERO_PERCENT
): boolean | undefined {
  if (tradeA && !tradeB) return false
  if (tradeB && !tradeA) return true
  if (!tradeA || !tradeB) return undefined

  if (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeB.outputAmount.currency.equals(tradeB.outputAmount.currency)
  ) {
    throw new Error('Trades are not comparable')
  }

  if (minimumDelta.equalTo(ZERO_PERCENT)) {
    return tradeA.executionPrice.lessThan(tradeB.executionPrice)
  } else {
    return JSBI.lessThan(
      JSBI.multiply(tradeA.executionPrice.numerator, JSBI.add(minimumDelta.numerator, ONE_HUNDRED_PERCENT.numerator)),
      tradeB.executionPrice.numerator
    )
  }
}
