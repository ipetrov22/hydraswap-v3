import { BigNumber } from '@ethersproject/bignumber'
import { V2_FACTORY_ADDRESSES } from 'constants/addresses'
import { account, hydraweb3RPC, useHydraAccount, useHydraChainId, useHydraLibrary } from 'hooks/useAddHydraAccExtension'
import { getAddressBalanceResolver } from 'hydra/contracts/contractAddresses'
import { balanceOf } from 'hydra/contracts/tokenFunctions'
import { allPairs, allPairsLength } from 'hydra/contracts/v2FactoryFunctions'
import { useEffect, useMemo, useState } from 'react'

import { AbiGetBalanceResolver, AbiHydraV2Factory, AbiToken } from '../../hydra/contracts/abi'
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
  const [chainId] = useHydraChainId()
  const tokenAddressesStringifed = JSON.stringify(tokenAddresses)
  const [balances, setBalances] = useState<CallState[]>([])

  useEffect(() => {
    if (isEmpty(hydraweb3RPC) || !account?.loggedIn) {
      setBalances([{ valid: true, result: undefined, loading: false, syncing: false, error: false }])
      return
    }
    const tokenAddresses = JSON.parse(tokenAddressesStringifed)
    if (tokenAddresses.length > 0) {
      ;(async () => {
        try {
          const resolver = getContract(hydraweb3RPC, getAddressBalanceResolver(chainId), AbiGetBalanceResolver)
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
  }, [tokenAddressesStringifed, chainId])

  return balances
}

export function usePairBalancesOf(tokenAddresses: string[]): CallState[] {
  const [chainId] = useHydraChainId()
  const [account] = useHydraAccount()
  const [hydraweb3RPC] = useHydraLibrary()
  const [balances, setBalances] = useState<CallState[]>([])
  const tokenAddressesStringified = useMemo(() => JSON.stringify(tokenAddresses), [tokenAddresses])

  useEffect(() => {
    const tokenAddresses = JSON.parse(tokenAddressesStringified)
    if (isEmpty(hydraweb3RPC) || !account?.loggedIn) {
      setBalances([{ valid: true, result: undefined, loading: false, syncing: false, error: false }])
      return
    }
    if (tokenAddresses.length > 0) {
      ;(async () => {
        try {
          const factory = getContract(hydraweb3RPC, V2_FACTORY_ADDRESSES[chainId], AbiHydraV2Factory)
          const txPairsLength = await allPairsLength(factory, account)
          const pairsLenght = Number((txPairsLength.executionResult?.formattedOutput[0]).toString())
          const pairs: string[] = []
          const _balances: CallState[] = []
          for (let i = 0; i < pairsLenght; i++) {
            const txPair = await allPairs(factory, account, i)
            const pairAddress = txPair.executionResult.formattedOutput[0]
            pairs.push('0x' + pairAddress)
          }
          for (let i = 0; i < tokenAddresses.length; i++) {
            const address = tokenAddresses[i]
            let isBalance = false
            for (let y = 0; y < pairs.length; y++) {
              const pairAddr = pairs[y]
              if (address === pairAddr) {
                const txBalance = await balanceOf(
                  getContract(hydraweb3RPC, pairAddr, AbiToken),
                  account.address,
                  account
                )
                const pairBalance = txBalance.executionResult.formattedOutput[0]
                _balances.push({
                  valid: true,
                  result: getResult(pairBalance),
                  loading: false,
                  syncing: false,
                  error: false,
                })
                isBalance = true
              }
            }
            if (!isBalance) {
              _balances.push({
                valid: true,
                result: undefined,
                loading: false,
                syncing: false,
                error: false,
              })
            }
          }
          setBalances(_balances)
        } catch (e) {
          setBalances([])
        }
      })()
    }
    return () => {
      setBalances([])
    }
  }, [tokenAddressesStringified, account, hydraweb3RPC, chainId])

  return balances
}
