export const getContract = (hydraweb3Extension, contractAddress, abi) => {
  try {
    const contract = hydraweb3Extension.Contract(contractAddress, abi)

    return contract
  } catch (e) {}
}
