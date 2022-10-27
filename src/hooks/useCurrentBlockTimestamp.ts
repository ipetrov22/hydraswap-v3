import { BigNumber } from '@ethersproject/bignumber'
import { MULTICALL_ADDRESSES } from 'constants/addresses'
import { MulticallAbi } from 'hydra/contracts/abi'
import { useSingleCallResult } from 'lib/hooks/hydraMulticall'
import { useMemo } from 'react'

import { useHydraChainId } from './useAddHydraAccExtension'

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): BigNumber | undefined {
  const [chainId] = useHydraChainId()
  const resultStr = useSingleCallResult(MULTICALL_ADDRESSES[chainId], MulticallAbi, 'getCurrentBlockTimestamp')
  return useMemo(() => (typeof resultStr === 'string' ? BigNumber.from(resultStr) : undefined), [resultStr])
}
