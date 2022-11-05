import { BigNumber } from '@ethersproject/bignumber'
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from 'constants/addresses'
import { NonfungiblePositionManagerAbi } from 'hydra/contracts/abi'
import { useV3NFTPositionManagerContract } from 'hydra/hooks/useContract'
import { useSingleCallResult, useSingleContractMultipleData } from 'lib/hooks/hydraMulticall'
import { useMemo } from 'react'
import { Result } from 'state/hydra/hrc20calls'
import { PositionDetails } from 'types/position'

import { useHydraChainId, useHydraHexAddress } from './useAddHydraAccExtension'

interface UseV3PositionsResults {
  loading: boolean
  positions: PositionDetails[] | undefined
}

function useV3PositionsFromTokenIds(tokenIds: BigNumber[] | undefined): UseV3PositionsResults {
  const [chainId] = useHydraChainId()
  const inputs = useMemo(() => (tokenIds ? tokenIds.map((tokenId) => [BigNumber.from(tokenId)]) : []), [tokenIds])
  const results = useSingleContractMultipleData(
    NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
    NonfungiblePositionManagerAbi,
    'positions',
    inputs
  )
  const loading = useMemo(() => results.some(({ loading }) => loading), [results])
  const error = useMemo(() => results.some(({ error }) => error), [results])

  const positions = useMemo(() => {
    if (!loading && !error && tokenIds && tokenIds.length) {
      return results.map((call, i) => {
        const tokenId = tokenIds[i]
        const result = call.result as Result
        return {
          tokenId,
          fee: result.fee,
          feeGrowthInside0LastX128: result.feeGrowthInside0LastX128,
          feeGrowthInside1LastX128: result.feeGrowthInside1LastX128,
          liquidity: result.liquidity,
          nonce: result.nonce,
          operator: result.operator,
          tickLower: result.tickLower,
          tickUpper: result.tickUpper,
          token0: result.token0?.toLowerCase(),
          token1: result.token1?.toLowerCase(),
          tokensOwed0: result.tokensOwed0,
          tokensOwed1: result.tokensOwed1,
        }
      })
    }
    return undefined
  }, [loading, error, results, tokenIds])

  return {
    loading,
    positions: positions?.map((position, i) => ({ ...position, tokenId: inputs[i][0] })),
  }
}

interface UseV3PositionResults {
  loading: boolean
  position: PositionDetails | undefined
}

export function useV3PositionFromTokenId(tokenId: BigNumber | undefined): UseV3PositionResults {
  const position = useV3PositionsFromTokenIds(tokenId ? [tokenId] : undefined)
  return {
    loading: position.loading,
    position: position.positions?.[0],
  }
}

export function useV3Positions(account: string | null | undefined): UseV3PositionsResults {
  const [chainId] = useHydraChainId()
  const positionManager = useV3NFTPositionManagerContract()
  const [hexAddr] = useHydraHexAddress()

  const { loading: balanceLoading, result: balanceResult } = useSingleCallResult(positionManager, 'balanceOf', [
    account ?? undefined,
  ])

  // we don't expect any account balance to ever exceed the bounds of max safe int
  const accountBalance: number | undefined = balanceResult?.[0]?.toNumber()

  const tokenIdsArgs = useMemo(() => {
    if (accountBalance && hexAddr) {
      const tokenRequests = []
      for (let i = 0; i < accountBalance; i++) {
        tokenRequests.push([hexAddr, i])
      }
      return tokenRequests
    }
    return []
  }, [hexAddr, accountBalance])

  const tokenIdResults = useSingleContractMultipleData(
    NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
    NonfungiblePositionManagerAbi,
    'tokenOfOwnerByIndex',
    tokenIdsArgs
  )
  const someTokenIdsLoading = useMemo(() => tokenIdResults.some(({ loading }) => loading), [tokenIdResults])

  const tokenIds = useMemo(() => {
    if (account) {
      return tokenIdResults
        .map(({ result }) => result)
        .filter((result): result is Result => !!result)
        .map((result) => BigNumber.from(result[0]))
    }
    return []
  }, [account, tokenIdResults])

  const { positions, loading: positionsLoading } = useV3PositionsFromTokenIds(tokenIds)

  return {
    loading: someTokenIdsLoading || balanceLoading || positionsLoading,
    positions,
  }
}
