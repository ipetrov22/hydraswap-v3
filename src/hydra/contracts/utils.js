import { base58 } from 'ethers/lib/utils'

import { MulticallAbi } from './abi'
import { TESTNET_MULTICALL } from './contractAddresses'

export const hydraToHexAddress = (address) => {
  return '0x' + Buffer.from(base58.decode(address)).toString('hex').substring(2, 42)
}

export const getContract = (hydraweb3Extension, contractAddress, abi) => {
  try {
    const contract = hydraweb3Extension.Contract(contractAddress, abi)

    return contract
  } catch (e) {}
}

export const contractCall = async (contract, method, methodArgs, senderAddress) => {
  const tx = await contract.call(method, {
    methodArgs,
    senderAddress,
  })

  return tx
}

export const contractSend = async (contract, method, methodArgs, senderAddress, gasLimit = 250000, amountHYDRA = 0) => {
  const tx = await contract.send(method, {
    methodArgs,
    gasLimit,
    senderAddress,
    amount: amountHYDRA,
  })

  return tx
}

const getMulticallContract = (hydraweb3Extension) => {
  return getContract(hydraweb3Extension, TESTNET_MULTICALL, MulticallAbi)
}

export const getMultipleContractSingleData = async (
  hydraweb3Extension,
  senderAddress = '',
  targets = [],
  iface,
  methodName = '',
  callInputs = []
) => {
  const multicall = getMulticallContract(hydraweb3Extension)
  const callData = iface.encodeFunctionData(methodName, callInputs)
  const calls = targets.map((target) => ({ target, callData }))

  const tx = await contractCall(multicall, 'aggregate', [calls], senderAddress)
  return tx
}
