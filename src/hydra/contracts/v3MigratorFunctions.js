import { contractCall } from './utils'

const _multicall = 'multicall'

export const multicall = async (contract, data, walletExtension) => {
  const result = await contractCall(contract, _multicall, [data], walletExtension.address || walletExtension)
  return result
}
