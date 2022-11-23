import { JsonRpcProvider, TransactionResponse } from '@ethersproject/providers'
// eslint-disable-next-line no-restricted-imports
import { Currency, TradeType } from '@uniswap/sdk-core'
import { formatUnits } from 'ethers/lib/utils'
import { rawSend } from 'hydra/contracts/rawFunctions'
import { Trade } from 'hydra-router-sdk'
import { useMemo } from 'react'

interface SwapCall {
  address: string
  calldata: string
  value: string
}
// returns a function that will execute a swap, if the parameters are all valid
export default function useSendSwapTransaction(
  account: string | null | undefined,
  chainId: number | undefined,
  provider: JsonRpcProvider | undefined,
  trade: Trade<Currency, Currency, TradeType> | undefined, // trade to execute, required
  swapCalls: SwapCall[]
): { callback: null | (() => Promise<TransactionResponse>) } {
  return useMemo(() => {
    if (!trade || !provider || !account || !chainId) {
      return { callback: null }
    }
    return {
      callback: async function onSwap(): Promise<TransactionResponse> {
        // TODO: gas estimation
        const bestCallOption = swapCalls[0] // TODO: Logic to chose which swap call is best
        const { address, calldata, value } = bestCallOption
        const hydraValue = formatUnits(value, 8)

        return rawSend(provider, address, calldata, hydraValue, account)
          .then((res) => {
            res.hash = res.id
            return res
          })
          .catch((error) => {
            console.error(error)
            throw new Error(`Swap failed: ${error}`)
          })
      },
    }
  }, [account, chainId, provider, swapCalls, trade])
}
