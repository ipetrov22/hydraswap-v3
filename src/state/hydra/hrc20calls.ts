import { BigNumber } from '@ethersproject/bignumber'
import { account, hydraweb3RPC } from 'hooks/useAddHydraAccExtension'
import { addressGetBalancesResolver } from 'hydra/contracts/contractAddresses'
import { useEffect, useState } from 'react'

import { AbiGetBalanceResolver } from '../../hydra/contracts/abi'
import { getContract } from '../../hydra/contracts/utils'

export interface Result extends Array<any> {
  [key: string]: any
}

export interface CallState {
  readonly valid: boolean
  // the result, or undefined if loading or errored/no data
  readonly result: Result | undefined
  // true if the result has never been fetched
  readonly loading: boolean
  // true if the result is not for the latest block
  readonly syncing: boolean
  // true if the call was made and is synced, but the return data is invalid
  readonly error: boolean
}

const isEmpty = (obj: Record<string, any>): boolean => {
  if (!obj) {
    return true
  }
  return Object.keys(obj).length === 0
}

const getResult = (e: BigNumber) => {
  const result: Result | undefined = []
  result[0] = e
  result['balance'] = e
  return result
}

export function useBalancesOf(tokenAddresses: string[]): CallState[] {
  const [balances, setBalances] = useState<CallState[]>([])
  useEffect(() => {
    if (isEmpty(hydraweb3RPC) || !account?.loggedIn) {
      setBalances([{ valid: true, result: undefined, loading: false, syncing: false, error: false }])
      return
    }
    if (tokenAddresses.length > 0) {
      ;(async () => {
        try {
          const resolver = getContract(hydraweb3RPC, addressGetBalancesResolver, AbiGetBalanceResolver)
          const tx = await resolver.call('getBalances', {
            methodArgs: [account.address, tokenAddresses],
            senderAddress: account.address,
          })
          const r = tx.executionResult?.formattedOutput[0] as Array<BigNumber>

          setBalances(
            r.map<CallState>((e) => ({
              valid: true,
              result: getResult(e),
              loading: false,
              syncing: false,
              error: false,
            }))
          )
        } catch (e) {
          setBalances([{ valid: true, result: undefined, loading: false, syncing: false, error: false }])
        }
      })()
    }
    return () => {
      setBalances([])
    }
  }, [tokenAddresses])

  return balances
}
