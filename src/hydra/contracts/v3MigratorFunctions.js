import { contractSend } from './utils'

const _multicall = 'multicall'

export const multicall = async (contract, data, walletExtension) => {
  const result = await contractSend(contract, _multicall, [data], walletExtension.address || walletExtension, 25000000)
  return result
}
