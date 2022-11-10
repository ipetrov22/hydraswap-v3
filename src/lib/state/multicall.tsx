import { Call, createMulticall, ListenerOptions } from '@uniswap/redux-multicall'
import { SupportedChainId } from 'constants/chains'
import { useHydraChainId, useHydraWalletAddress } from 'hooks/useAddHydraAccExtension'
import { contractCall } from 'hydra/contracts/utils'
import { useMulticallContract } from 'hydra/hooks/useContract'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import { useMemo } from 'react'
import { combineReducers, createStore } from 'redux'

const multicall = createMulticall()
const reducer = combineReducers({ [multicall.reducerPath]: multicall.reducer })
export const store = createStore(reducer)
export default multicall

function getBlocksPerFetchForChainId(chainId: number | undefined): number {
  switch (chainId) {
    case SupportedChainId.ARBITRUM_ONE:
    case SupportedChainId.OPTIMISM:
      return 15
    case SupportedChainId.CELO:
    case SupportedChainId.CELO_ALFAJORES:
      return 5
    default:
      return 1
  }
}

export function MulticallUpdater() {
  const [chainId] = useHydraChainId()
  const [account] = useHydraWalletAddress()
  const latestBlockNumber = useBlockNumber()
  const listenerOptions: ListenerOptions = useMemo(
    () => ({
      blocksPerFetch: getBlocksPerFetchForChainId(chainId),
    }),
    [chainId]
  )
  const multicallContract = useMulticallContract()
  const contractMock = {
    callStatic: {
      multicall: async (chunk: Call[]) => {
        const res = { success: false, gasUsed: 0, returnData: [{ success: false, returnData: '0x' }] }

        if (!multicallContract) {
          res.returnData = chunk.map(() => ({ success: false, returnData: '0x' }))
        } else {
          const { executionResult } = await contractCall(multicallContract, 'aggregate', [chunk], account)
          if (executionResult?.excepted === 'None') {
            res.returnData = chunk.map((_, i) => ({
              success: true,
              returnData: `0x${executionResult.formattedOutput[1][i]}`,
            }))
          } else {
            res.returnData = chunk.map((_, i) => ({
              success: false,
              returnData: `0x${executionResult.formattedOutput[1][i]}`,
            }))
          }
        }

        return res
      },
    },
  }

  return (
    <multicall.Updater
      chainId={chainId}
      latestBlockNumber={latestBlockNumber}
      contract={contractMock}
      listenerOptions={listenerOptions}
    />
  )
}
