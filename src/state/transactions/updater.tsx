import { EXPLORER_URL } from 'constants/index'
import { useHydraLibrary } from 'hooks/useAddHydraAccExtension'
import { ChainId } from 'hydra/sdk'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'state'

import { useAddPopup, useBlockNumber } from '../application/hooks'
import { checkedTransaction, finalizeTransaction } from './reducer'

export function shouldCheck(
  lastBlockNumber: number,
  tx: { addedTime: number; receipt?: unknown; lastCheckedBlockNumber?: number }
): boolean {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  } else if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  } else {
    // otherwise every block
    return true
  }
}

export default function Updater(): null {
  const [library] = useHydraLibrary()
  const chainId = ChainId.MAINNET

  const lastBlockNumber = useBlockNumber()

  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector<AppState, AppState['transactions']>((state) => state.transactions)

  // show popup on confirm
  const addPopup = useAddPopup()

  useEffect(() => {
    const transactions = chainId ? state[chainId] ?? {} : {}
    if (!chainId || !library || !lastBlockNumber) return
    Object.keys(transactions)
      .filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
      .forEach((hash) => {
        fetch(EXPLORER_URL + '/api/tx/' + hash)
          .then((r) => {
            r.json().then((resp) => {
              if (resp?.blockHash) {
                dispatch(
                  finalizeTransaction({
                    chainId,
                    hash,
                    receipt: {
                      blockHash: resp.blockHash,
                      blockNumber: resp.blockHeight,
                      contractAddress: resp.outputs[0].receipt.contractAddressHex,
                      from: transactions[hash].from,
                      status: resp.confirmations > 0 ? 1 : 0,
                      to: resp.inputs[0].address,
                      transactionHash: resp.hash,
                      transactionIndex: resp.weight,
                      excepted: resp.outputs[0].receipt.excepted,
                    },
                  })
                )

                addPopup(
                  {
                    txn: {
                      hash,
                      success: resp.confirmations > 0,
                      summary: transactions[hash]?.summary,
                      excepted: resp.outputs[0].receipt.excepted,
                    },
                  },
                  hash
                )
              } else {
                dispatch(checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }))
              }
            })
          })
          .catch((error) => {
            console.error(`failed to check transaction hash: ${hash}`, error)
          })
      })
  }, [chainId, library, state, lastBlockNumber, dispatch, addPopup])

  return null
}
