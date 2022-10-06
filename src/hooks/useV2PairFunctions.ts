import { BigNumber } from '@ethersproject/bignumber'
import { hydraweb3RPC, useHydraWalletAddress } from 'hooks/useAddHydraAccExtension'
import { AbiHydraV2Pair } from 'hydra/contracts/abi'
import { getContract } from 'hydra/contracts/utils'
import { getReserves } from 'hydra/contracts/v2PairFunctions'
import { useEffect, useState } from 'react'
import { CallState, Result } from 'state/hydra/hrc20calls'

const getResult = (reserve0: BigNumber, reserve1: BigNumber) => {
  const result: Result | undefined = []
  result['reserve0'] = reserve0
  result['reserve1'] = reserve1
  return result
}

export function useGetReserves(pairAddresses: (string | undefined)[]): CallState[] {
  const [account] = useHydraWalletAddress()

  const [reserves, setReserves] = useState<CallState[]>([
    { valid: false, result: undefined, loading: false, syncing: false, error: false },
  ] as CallState[])

  useEffect(() => {
    if (pairAddresses?.length < 1 || !account) return
    ;(async () => {
      const reserves: CallState[] = []
      for (let i = 0; i < pairAddresses.length; i++) {
        let result
        try {
          result = await getReserves(getContract(hydraweb3RPC, pairAddresses[i], AbiHydraV2Pair), account)
        } catch (e) {
          reserves[i] = {
            valid: false,
            result: undefined,
            loading: false,
            syncing: false,
            error: true,
          }
          continue
        }

        const reserve0 = result.executionResult?.formattedOutput['_reserve0']
        const reserve1 = result.executionResult?.formattedOutput['_reserve1']

        reserves[i] = {
          valid: true,
          result: getResult(reserve0, reserve1),
          loading: false,
          syncing: false,
          error: false,
        }
      }
      if (reserves.length > 0) setReserves(reserves)
    })()
    return () => {
      setReserves([{ valid: false, result: undefined, loading: false, syncing: false, error: false }] as CallState[])
    }
  }, [pairAddresses, account])

  return reserves
}
