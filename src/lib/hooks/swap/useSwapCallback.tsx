// eslint-disable-next-line no-restricted-imports
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Trans } from '@lingui/macro'
import { Currency, Percent, TradeType } from '@uniswap/sdk-core'
import { FeeOptions } from '@uniswap/v3-sdk'
import {
  useHydraChainId,
  useHydraHexAddress,
  useHydraLibrary,
  useHydraWalletAddress,
} from 'hooks/useAddHydraAccExtension'
import { SignatureData } from 'hooks/useERC20Permit'
import { useSwapCallArguments } from 'hooks/useSwapCallArguments'
import { Trade } from 'hydra-router-sdk'
import { ReactNode, useMemo } from 'react'

import useSendSwapTransaction from './useSendSwapTransaction'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface UseSwapCallbackReturns {
  state: SwapCallbackState
  callback?: () => Promise<TransactionResponse>
  error?: ReactNode
}
interface UseSwapCallbackArgs {
  trade: Trade<Currency, Currency, TradeType> | undefined // trade to execute, required
  allowedSlippage: Percent // in bips
  recipientAddressOrName: string | null | undefined // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | null | undefined
  deadline: BigNumber | undefined
  feeOptions?: FeeOptions
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback({
  trade,
  allowedSlippage,
  recipientAddressOrName,
  signatureData,
  deadline,
  feeOptions,
}: UseSwapCallbackArgs): UseSwapCallbackReturns {
  const [account] = useHydraWalletAddress()
  const [hexAddr] = useHydraHexAddress()
  const [chainId] = useHydraChainId()
  const [library] = useHydraLibrary()

  const swapCalls = useSwapCallArguments(
    trade,
    allowedSlippage,
    recipientAddressOrName,
    signatureData,
    deadline,
    feeOptions
  )
  console.log(swapCalls)
  const { callback } = useSendSwapTransaction(account, chainId, library, trade, swapCalls)

  const recipient = recipientAddressOrName === null ? hexAddr : recipientAddressOrName

  return useMemo(() => {
    if (!trade || !library || !account || !chainId || !callback) {
      return { state: SwapCallbackState.INVALID, error: <Trans>Missing dependencies</Trans> }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, error: <Trans>Invalid recipient</Trans> }
      } else {
        return { state: SwapCallbackState.LOADING }
      }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async () => callback(),
    }
  }, [trade, library, account, chainId, callback, recipient, recipientAddressOrName])
}
