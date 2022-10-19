import { BigNumber } from '@ethersproject/bignumber'
import { BigintIsh } from '@uniswap/sdk-core'
import { hydraweb3RPC, useHydraAccount, useHydraWalletAddress } from 'hooks/useAddHydraAccExtension'
import { AbiHydraV2Pair } from 'hydra/contracts/abi'
import { getContract } from 'hydra/contracts/utils'
import { getReserves, token0, token1 } from 'hydra/contracts/v2PairFunctions'
import { useEffect, useMemo, useState } from 'react'
import { CallState, Result } from 'state/hydra/hrc20calls'

const getResult = (reserve0: BigNumber, reserve1: BigNumber) => {
  const result: Result | undefined = []
  result['reserve0'] = reserve0
  result['reserve1'] = reserve1
  return result
}

export function useGetReserves(pairAddresses: (string | undefined)[]): CallState[] {
  const [account] = useHydraWalletAddress()
  const pairAddressesStringified = useMemo(() => JSON.stringify(pairAddresses), [pairAddresses])

  const [reserves, setReserves] = useState<CallState[]>([
    { valid: false, result: undefined, loading: false, syncing: false, error: false },
  ] as CallState[])

  useEffect(() => {
    const pairAddresses = JSON.parse(pairAddressesStringified)
    if (pairAddresses?.length < 1 || !account) return
    ;(async () => {
      const reserves: CallState[] = []
      for (let i = 0; i < pairAddresses.length; i++) {
        let result
        try {
          result = await getReserves(
            getContract(hydraweb3RPC, pairAddresses[i]?.toLowerCase(), AbiHydraV2Pair),
            account
          )
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
  }, [pairAddressesStringified, account])

  return reserves
}

export function useGetReservesRaw(pairAddress: string | undefined): {
  reserve0Raw: BigintIsh | undefined
  reserve1Raw: BigintIsh | undefined
} {
  const results = useGetReserves([pairAddress])
  const rawReserves = useMemo(() => {
    const { result } = results[0]
    if (result) {
      const { reserve0, reserve1 } = result
      return { reserve0Raw: reserve0, reserve1Raw: reserve1 }
    }
    return { reserve0Raw: undefined, reserve1Raw: undefined }
  }, [results])

  return rawReserves
}

export function useToken0Address(pairAddress: string | undefined): string | undefined {
  const [token0Address, setToken0Address] = useState<string | undefined>()
  const [account] = useHydraAccount()

  useEffect(() => {
    if (!pairAddress || !account?.address) {
      return
    }

    const pairContract = getContract(hydraweb3RPC, pairAddress?.toLowerCase(), AbiHydraV2Pair)
    if (pairContract) {
      token0(pairContract, account)
        .then(({ executionResult }) => {
          if (executionResult?.excepted === 'None') {
            setToken0Address('0x' + executionResult?.formattedOutput[0])
          }
        })
        .catch((e) => {
          setToken0Address(undefined)
        })
    }
  }, [pairAddress, account])

  return token0Address
}

export function useToken1Address(pairAddress: string | undefined): string | undefined {
  const [token1Address, setToken1Address] = useState<string | undefined>()
  const [account] = useHydraAccount()

  useEffect(() => {
    if (!pairAddress || !account?.address) {
      return
    }

    const pairContract = getContract(hydraweb3RPC, pairAddress?.toLowerCase(), AbiHydraV2Pair)
    if (pairContract) {
      token1(pairContract, account)
        .then(({ executionResult }) => {
          if (executionResult?.excepted === 'None') {
            setToken1Address('0x' + executionResult?.formattedOutput[0])
          }
        })
        .catch((e) => {
          setToken1Address(undefined)
        })
    }
  }, [pairAddress, account])

  return token1Address
}
