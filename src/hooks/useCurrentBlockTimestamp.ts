import { BigNumber } from '@ethersproject/bignumber'
import { useMulticallContract } from 'hydra/hooks/useContract'
import { useSingleCallResult } from 'lib/hooks/multicall'
import { useMemo } from 'react'

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): BigNumber | undefined {
  const multicall = useMulticallContract()
  const resultStr = useSingleCallResult(multicall, 'getCurrentBlockTimestamp')?.result?.[0]?.toString()
  return useMemo(() => (typeof resultStr === 'string' ? BigNumber.from(resultStr) : undefined), [resultStr])
}
