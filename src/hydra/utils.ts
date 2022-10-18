import { ChainId } from './sdk'

export const getChainId = (network: string | undefined): ChainId | undefined => {
  if (!network) return undefined
  const nL = network.toLowerCase()
  return nL === 'mainnet' ? ChainId.MAINNET : ChainId.TESTNET
}
