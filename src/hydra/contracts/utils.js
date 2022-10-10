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
