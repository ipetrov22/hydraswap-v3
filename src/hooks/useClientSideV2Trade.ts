import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import { InterfaceTrade, TradeState } from 'state/routing/types'

import { useTradeExactIn, useTradeExactOut } from './V2Trades'

/**
 * Returns the best v2 trade for a desired swap
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useClientSideV2Trade<TTradeType extends TradeType>(
  tradeType: TTradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency
): { state: TradeState; trade: InterfaceTrade<Currency, Currency, TTradeType> | undefined } {
  const bestTradeExactIn = useTradeExactIn(!tradeType ? amountSpecified : undefined, otherCurrency ?? undefined)
  const bestTradeExactOut = useTradeExactOut(otherCurrency ?? undefined, tradeType ? amountSpecified : undefined)
  const bestV2Trade = useMemo(
    () => (tradeType ? bestTradeExactOut : bestTradeExactIn),
    [tradeType, bestTradeExactIn, bestTradeExactOut]
  )

  return useMemo(() => {
    if (!amountSpecified || !otherCurrency) {
      return {
        state: TradeState.INVALID,
        trade: undefined,
      }
    }

    const { inputAmount, outputAmount } = bestV2Trade || {}
    if (!bestV2Trade || !inputAmount || !outputAmount) {
      return {
        state: TradeState.NO_ROUTE_FOUND,
        trade: undefined,
      }
    }

    return {
      state: TradeState.VALID,
      trade: new InterfaceTrade({
        v2Routes: [
          {
            routev2: bestV2Trade.route,
            inputAmount,
            outputAmount,
          },
        ],
        v3Routes: [],
        tradeType,
      }),
    }
  }, [bestV2Trade, tradeType, amountSpecified, otherCurrency])
}
