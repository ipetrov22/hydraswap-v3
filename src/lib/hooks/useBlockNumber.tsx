import { useWeb3React } from '@web3-react/core'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { ChainId } from 'hydra/sdk'
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'state'

const MISSING_PROVIDER = Symbol()
const BlockNumberContext = createContext<
  | {
      value?: number
    }
  | typeof MISSING_PROVIDER
>(MISSING_PROVIDER)

export default function useBlockNumber(): number | undefined {
  const chainId = ChainId.MAINNET

  return useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])
}

export function BlockNumberProvider({ children }: { children: ReactNode }) {
  const { chainId: activeChainId, provider } = useWeb3React()
  const [{ chainId, block }, setChainBlock] = useState<{ chainId?: number; block?: number }>({ chainId: activeChainId })

  const onBlock = useCallback(
    (block: number) => {
      setChainBlock((chainBlock) => {
        if (chainBlock.chainId === activeChainId) {
          if (!chainBlock.block || chainBlock.block < block) {
            return { chainId: activeChainId, block }
          }
        }
        return chainBlock
      })
    },
    [activeChainId, setChainBlock]
  )

  const windowVisible = useIsWindowVisible()
  useEffect(() => {
    let stale = false

    if (provider && activeChainId && windowVisible) {
      // If chainId hasn't changed, don't clear the block. This prevents re-fetching still valid data.
      setChainBlock((chainBlock) => (chainBlock.chainId === activeChainId ? chainBlock : { chainId: activeChainId }))

      provider
        .getBlockNumber()
        .then((block) => {
          if (!stale) onBlock(block)
        })
        .catch((error) => {
          console.error(`Failed to get block number for chainId ${activeChainId}`, error)
        })

      provider.on('block', onBlock)

      return () => {
        stale = true
        provider.removeListener('block', onBlock)
      }
    }

    return void 0
  }, [activeChainId, provider, onBlock, setChainBlock, windowVisible])

  const value = useMemo(
    () => ({
      value: chainId === activeChainId ? block : undefined,
    }),
    [activeChainId, block, chainId]
  )
  return <BlockNumberContext.Provider value={value}>{children}</BlockNumberContext.Provider>
}
