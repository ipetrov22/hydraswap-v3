import { contractCall, contractSend } from './utils'

const _feeTo = 'feeTo',
  _feeToSetter = 'feeToSetter',
  _allPairs = 'allPairs',
  _allPairsLength = 'allPairsLength',
  _createPair = 'createPair',
  _getPair = 'getPair'

export const feeTo = async (uniFactory, walletExtension) => {
  const result = await contractCall(uniFactory, _feeTo, [], walletExtension.address)
  return result
}

export const feeToSetter = async (uniFactory, walletExtension) => {
  const result = await contractCall(uniFactory, _feeToSetter, [], walletExtension.address)
  return result
}

export const allPairs = async (uniFactory, walletExtension, index) => {
  const result = await contractCall(uniFactory, _allPairs, [index], walletExtension.address)
  return result
}

export const allPairsLength = async (uniFactory, walletExtension) => {
  const result = await contractCall(uniFactory, _allPairsLength, [], walletExtension.address)
  return result
}

export const createPair = async (uniFactory, tokenA, tokenB, walletExtension, gasLimit = 7000000) => {
  const result = await contractSend(
    uniFactory,
    _createPair,
    [tokenA.address, tokenB.address],
    walletExtension.address,
    gasLimit
  )
  return result
}

export const getPair = async (uniFactory, tokenA, tokenB, walletExtension) => {
  const result = await contractCall(uniFactory, _getPair, [tokenA.address, tokenB.address], walletExtension.address)
  return result
}
