import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import { InterfaceTrade, TradeState } from 'state/routing/types'
import { isTradeBetter } from 'utils/trades'

import { useClientSideV2Trade } from './useClientSideV2Trade'
import { useClientSideV3Trade } from './useClientSideV3Trade'
import useDebounce from './useDebounce'

/**
 * Returns the best v2+v3 trade for a desired swap.
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useBestTrade(
  tradeType: TradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency
): {
  state: TradeState
  trade: InterfaceTrade<Currency, Currency, TradeType> | undefined
} {
  const [debouncedAmount, debouncedOtherCurrency] = useDebounce(
    useMemo(() => [amountSpecified, otherCurrency], [amountSpecified, otherCurrency]),
    200
  )
  // only use client side router if routing api trade failed or is not supported
  const bestV2Trade = useClientSideV2Trade(tradeType, debouncedAmount, debouncedOtherCurrency)
  const bestV3Trade = useClientSideV3Trade(tradeType, debouncedAmount, debouncedOtherCurrency)
  const v2IsBetter = useMemo(() => isTradeBetter(bestV3Trade.trade, bestV2Trade.trade), [bestV3Trade, bestV2Trade])
  const bestTrade = useMemo(() => (v2IsBetter ? bestV2Trade : bestV3Trade), [v2IsBetter, bestV2Trade, bestV3Trade])

  // only return gas estimate from api if routing api trade is used
  return useMemo(
    () => ({
      ...bestTrade,
    }),
    [bestTrade]
  )
}
