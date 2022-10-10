import { BigNumberish } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'
import { AbiToken } from 'hydra/contracts/abi'
import { totalSupply } from 'hydra/contracts/tokenFunctions'
import { getContract } from 'hydra/contracts/utils'
import { useSingleCallResult } from 'lib/hooks/multicall'
import { useEffect, useMemo, useState } from 'react'

import { account, hydraweb3RPC } from './useAddHydraAccExtension'
import { useTokenContract } from './useContract'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Currency): CurrencyAmount<Token> | undefined {
  const contract = useTokenContract(token?.isToken ? token.address : undefined, false)

  const totalSupplyStr: string | undefined = useSingleCallResult(contract, 'totalSupply')?.result?.[0]?.toString()

  return useMemo(
    () => (token?.isToken && totalSupplyStr ? CurrencyAmount.fromRawAmount(token, totalSupplyStr) : undefined),
    [token, totalSupplyStr]
  )
}

export function useTotalSupplyHydra(token?: Token): CurrencyAmount<Token> | undefined {
  const [tS, setTS] = useState<BigNumberish | undefined>(undefined)
  useEffect(() => {
    if (!token || !account?.loggedIn) {
      return
    }
    ;(async () => {
      try {
        const contract = getContract(hydraweb3RPC, token?.address.toLowerCase(), AbiToken)
        const result = await totalSupply(contract, account)
        setTS(result.executionResult?.formattedOutput?.[0])
      } catch (e) {
        console.log(e)
        setTS(undefined)
      }
    })()
  }, [token])
  return token && tS ? CurrencyAmount.fromRawAmount(token, tS.toString()) : undefined
}
