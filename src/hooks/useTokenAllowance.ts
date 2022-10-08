import { BigNumber } from '@ethersproject/bignumber'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { AbiToken } from 'hydra/contracts/abi'
import { allowance } from 'hydra/contracts/tokenFunctions'
import { getContract } from 'hydra/contracts/utils'
import { BigintIsh } from 'hydra/sdk'
import { useEffect, useMemo, useState } from 'react'

import { useHydraAccount, useHydraLibrary } from './useAddHydraAccExtension'

export function useTokenAllowance(token?: Token, owner?: string, spender?: string): CurrencyAmount<Token> | undefined {
  const [allowanceState, setAllowanceState] = useState<BigintIsh | undefined>(undefined)
  const [account] = useHydraAccount()
  const [library] = useHydraLibrary()

  useEffect(() => {
    const contract = getContract(library, token?.address.toLowerCase(), AbiToken)
    if (contract?.address && account?.address && spender) {
      allowance(contract, account, spender).then(({ executionResult }) => {
        const allowedBN = BigNumber.from('0x' + executionResult.output)
        setAllowanceState(allowedBN.toString())
      })
    }
  }, [account, library, spender, token])

  return useMemo(
    () => (token && allowanceState ? CurrencyAmount.fromRawAmount(token, allowanceState) : undefined),
    [token, allowanceState]
  )
}
