import { ChainId } from 'hydra/sdk'

import { EXPLORER_URL } from '../constants'

const BLOCK_EXPLORER_PREFIXES: { [chainId: number]: string } = {
  [ChainId.MAINNET]: EXPLORER_URL,
  [ChainId.TESTNET]: 'https://testexplorer.hydrachain.org',
}

export enum ExplorerDataType {
  TRANSACTION = 'transaction',
  TOKEN = 'token',
  ADDRESS = 'address',
  BLOCK = 'block',
}

/**
 * Return the explorer link for the given data and data type
 * @param chainId the ID of the chain for which to return the data
 * @param data the data to return a link for
 * @param type the type of the data
 */
export function getExplorerLink(chainId: number, data: string, type: ExplorerDataType): string {
  switch (type) {
    case 'transaction': {
      return `${BLOCK_EXPLORER_PREFIXES[chainId]}/tx/${data}`
    }
    case 'token': {
      return `${BLOCK_EXPLORER_PREFIXES[chainId]}/contract/${data}`
    }
    case 'block': {
      return `${BLOCK_EXPLORER_PREFIXES[chainId]}/block/${data}`
    }
    case 'address':
    default: {
      return `${BLOCK_EXPLORER_PREFIXES[chainId]}/address/${data}`
    }
  }
}
