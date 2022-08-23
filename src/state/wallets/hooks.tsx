import { BigNumber } from '@ethersproject/bignumber'
import { Account } from 'hooks/useAddHydraAccExtension'
import { CurrencyAmount, JSBI } from 'hydra/sdk'
import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { Result } from 'state/hydra/hrc20calls'

import { addConnectedWallet } from './reducer'
import { Wallet } from './types'

export function useConnectedWallets(): [Wallet[], (wallet: Wallet) => void] {
  const dispatch = useAppDispatch()
  const connectedWallets = useAppSelector((state) => state.wallets.connectedWallets)
  const addWallet = useCallback(
    (wallet: Wallet) => {
      dispatch(addConnectedWallet(wallet))
    },
    [dispatch]
  )
  return [connectedWallets, addWallet]
}

export function useHYDRABalance(account?: Account | undefined): { [address: string]: CurrencyAmount | undefined } {
  const getResult = useCallback(
    (addresses: string[]): Result | undefined => {
      if (addresses[0] === '') {
        return undefined
      }
      const result: Result | undefined = []
      const output: BigNumber = BigNumber.from(account ? account.balance : 0)
      result[0] = output
      result['balance'] = output
      return result
    },
    [account]
  )

  const addresses: string[] = useMemo(() => [account ? account.address : ''], [account])

  const results = useMemo(
    () => [
      {
        valid: true,
        result: getResult(addresses),
        loading: false,
        syncing: false,
        error: false,
      },
    ],
    [addresses, getResult]
  )

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value) memo[address] = CurrencyAmount.hydra(JSBI.BigInt(value.toString()))
        return memo
      }, {}),
    [addresses, results]
  )
}
