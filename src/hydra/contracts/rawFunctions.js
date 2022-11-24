import { trimHexPrefix } from './utils'

export const rawSend = async (library, address, data, amountHydra, senderAddress, gasLimit = 250000) => {
  const tx = await library?.provider?.rawCall('sendtocontract', [
    trimHexPrefix(address),
    trimHexPrefix(data),
    amountHydra,
    gasLimit,
    senderAddress,
  ])
  return tx
}

export const rawCall = async (library, address, data, senderAddress) => {
  const tx = await library?.provider?.rawCall('callcontract', [
    trimHexPrefix(address),
    trimHexPrefix(data),
    senderAddress,
  ])
  return tx
}
