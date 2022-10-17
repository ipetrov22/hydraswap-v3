import { contractCall } from './utils'

const _getReserves = 'getReserves',
  _token0 = 'token0',
  _token1 = 'token1'

export const getReserves = async (uniPair, walletExtension) => {
  const reserves = await contractCall(uniPair, _getReserves, [], walletExtension.address || walletExtension)
  return reserves
}

export const token1 = async (uniPair, walletExtension) => {
  const result = await contractCall(uniPair, _token1, [], walletExtension.address || walletExtension)
  return result
}

export const token0 = async (uniPair, walletExtension) => {
  const result = await contractCall(uniPair, _token0, [], walletExtension.address || walletExtension)
  return result
}
