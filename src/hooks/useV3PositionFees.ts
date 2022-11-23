import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { Pool } from '@uniswap/v3-sdk'
import { callCollect } from 'hydra/contracts/positionManagerFunctions'
import { useV3NFTPositionManagerContract } from 'hydra/hooks/useContract'
import { useSingleCallResult } from 'lib/hooks/multicall'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import { useEffect, useState } from 'react'
import { unwrappedToken } from 'utils/unwrappedToken'

const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)

// compute current + counterfactual fees for a v3 position
export function useV3PositionFees(
  pool?: Pool,
  tokenId?: BigNumber,
  asWETH = false
): [CurrencyAmount<Currency>, CurrencyAmount<Currency>] | [undefined, undefined] {
  const positionManager = useV3NFTPositionManagerContract()
  const owner: string | undefined = useSingleCallResult(tokenId ? positionManager : null, 'ownerOf', [tokenId?._hex])
    .result?.[0]

  const tokenIdHexString = tokenId?.toHexString()
  const latestBlockNumber = useBlockNumber()

  // we can't use multicall for this because we need to simulate the call from a specific address
  // latestBlockNumber is included to ensure data stays up-to-date every block
  const [amounts, setAmounts] = useState<[BigNumber, BigNumber] | undefined>()
  useEffect(() => {
    if (positionManager && tokenIdHexString && owner) {
      callCollect(positionManager, owner.toLowerCase()?.substring(2), {
        tokenId: tokenIdHexString,
        recipient: owner?.substring(2), // some tokens might fail if transferred to address(0)
        amount0Max: MAX_UINT128?._hex,
        amount1Max: MAX_UINT128?._hex,
      })
        .then(({ executionResult }) => {
          if (executionResult?.excepted === 'None') {
            const [res1, res2] = executionResult.formattedOutput
            setAmounts([BigNumber.from(res1?.toString()), BigNumber.from(res2?.toString())])
          }
        })
        .catch(console.log)
    }
  }, [positionManager, tokenIdHexString, owner, latestBlockNumber])

  if (pool && amounts) {
    return [
      CurrencyAmount.fromRawAmount(asWETH ? pool.token0 : unwrappedToken(pool.token0), amounts[0].toString()),
      CurrencyAmount.fromRawAmount(asWETH ? pool.token1 : unwrappedToken(pool.token1), amounts[1].toString()),
    ]
  } else {
    return [undefined, undefined]
  }
}
