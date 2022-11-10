import { Currency, CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core'
import { SWAP_ROUTER_ADDRESSES } from 'constants/addresses'
import { useHydraChainId } from 'hooks/useAddHydraAccExtension'
import { Trade } from 'hydra-router-sdk'
import { useMemo } from 'react'

import { useApproval } from '../useApproval'

export { ApprovalState } from '../useApproval'

// wraps useApproveCallback in the context of a swap
export default function useSwapApproval(
  trade: Trade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: Percent,
  useIsPendingApproval: (token?: Token, spender?: string) => boolean,
  amount?: CurrencyAmount<Currency> // defaults to trade.maximumAmountIn(allowedSlippage)
) {
  const [chainId] = useHydraChainId()

  const amountToApprove = useMemo(
    () =>
      amount ||
      (trade && trade.inputAmount.currency.wrapped.isToken ? trade.maximumAmountIn(allowedSlippage) : undefined),
    [amount, trade, allowedSlippage]
  )
  const spender = chainId ? SWAP_ROUTER_ADDRESSES[chainId] : undefined

  return useApproval(amountToApprove, spender, useIsPendingApproval)
}
