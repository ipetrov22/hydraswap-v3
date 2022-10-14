import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import useDebounce from 'hooks/useDebounce'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { ChainId } from 'hydra/sdk'
import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch } from 'state/hooks'

import { EXPLORER_URL } from '../../constants'
import { updateBlockNumber } from './reducer'

let interval: NodeJS.Timeout | undefined

export default function Updater(): null {
  const { provider } = useWeb3React()
  const chainId = ChainId.MAINNET
  const dispatch = useAppDispatch()
  const windowVisible = useIsWindowVisible()

  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null,
  })

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((state) => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number') return { chainId, blockNumber }
          return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) }
        }
        return state
      })
    },
    [chainId, setState]
  )

  const fetchBlock = useCallback(
    (library: Web3Provider | undefined, isAttachListener: boolean) => {
      fetch(EXPLORER_URL + '/api/info')
        .then((r) => {
          r.json().then((info) => {
            blockNumberCallback(info.height)
            if (isAttachListener) {
              library?.on('block', () => blockNumberCallback(info.height))
            }
          })
        })
        .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error))
    },
    [blockNumberCallback, chainId]
  )

  useEffect(() => {
    if (provider && chainId && windowVisible) {
      setState({ chainId, blockNumber: null })
      fetchBlock(provider, true)
      if (!interval) {
        interval = setInterval(() => fetchBlock(provider, false), 15000)
      }
    }
    return () => {
      provider && provider.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, provider, windowVisible, blockNumberCallback, fetchBlock])

  const debouncedState = useDebounce(state, 100)

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
  }, [windowVisible, dispatch, debouncedState])

  return null
}
