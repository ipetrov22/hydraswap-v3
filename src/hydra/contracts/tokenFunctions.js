import { contractCall, contractSend } from './utils'

const _totalSupply = 'totalSupply',
  _allowance = 'allowance',
  _name = 'name',
  _symbol = 'symbol',
  _decimals = 'decimals',
  _balanceOf = 'balanceOf',
  _approve = 'approve',
  _changeMinterAccess = 'changeMinterAccess',
  _mint = 'mint',
  _burn = 'burn',
  _minters = 'minters',
  _transfer = 'transfer',
  _transferFrom = 'transferFrom'

export const totalSupply = async (token, walletExtension) => {
  const result = await contractCall(token, _totalSupply, [], walletExtension.address)
  return result
}

export const balanceOf = async (token, toAddress, walletExtension) => {
  try {
    const result = await contractCall(token, _balanceOf, [toAddress], walletExtension.address)
    return result
  } catch (e) {
    return e
  }
}

export const allowance = async (token, walletExtension, toAddress) => {
  const result = await contractCall(token, _allowance, [walletExtension.address, toAddress], walletExtension.address)
  return result
}

export const name = async (token, walletExtension) => {
  const result = await contractCall(token, _name, [], walletExtension.address)
  return result
}

export const symbol = async (token, walletExtension) => {
  const result = await contractCall(token, _symbol, [], walletExtension.address)
  return result
}

export const decimals = async (token, walletExtension) => {
  const result = await contractCall(token, _decimals, [], walletExtension.address)
  return result
}

export const approve = async (toAddress, token, walletExtension, amountDesired) => {
  const result = await contractSend(token, _approve, [toAddress, amountDesired], walletExtension.address)
  return result
}

export const changeMinterAccess = async (token, changeTo, canMint, walletExtension) => {
  const result = await contractSend(token, _changeMinterAccess, [changeTo, canMint], walletExtension.address)
  return result
}

export const mint = async (token, mintTo, walletExtension, amountDesired) => {
  const result = await contractSend(token, _mint, [mintTo, amountDesired], walletExtension.address)
  return result
}

export const burn = async (token, walletExtension, amountDesired) => {
  const result = await contractSend(token, _burn, [amountDesired], walletExtension.address)
  return result
}

export const minters = async (token, toAddress, walletExtension) => {
  const result = await contractCall(token, _minters, [toAddress], walletExtension.address)
  return result
}

export const transfer = async (token, walletExtension, toAddress, amountDesired) => {
  const result = await contractSend(token, _transfer, [toAddress, amountDesired], walletExtension.address)
  return result
}

export const transferFrom = async (token, walletExtension, toAddress, amountDesired) => {
  const result = await contractSend(
    token,
    _transferFrom,
    [walletExtension.address, toAddress, amountDesired],
    walletExtension.address
  )
  return result
}
