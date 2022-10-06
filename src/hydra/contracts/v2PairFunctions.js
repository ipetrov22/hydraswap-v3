import { contractCall } from './utils'

const _getReserves = 'getReserves'

export const getReserves = async (uniPair, walletExtension) => {
  const reserves = await contractCall(uniPair, _getReserves, [], walletExtension.address || walletExtension)
  return reserves
}
