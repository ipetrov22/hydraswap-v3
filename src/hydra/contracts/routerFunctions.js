import { contractSend } from './utils'

const _addLiquidity = 'addLiquidity',
  _removeLiquidity = 'removeLiquidity',
  _addLiquidityHYDRA = 'addLiquidityHYDRA',
  _removeLiquidityHYDRA = 'removeLiquidityHYDRA'

export const addLiquidity = async (
  uniRouter,
  tokenA,
  tokenB,
  walletExtension,
  amountADesired,
  amountBDesired,
  amountAMin,
  amountBMin,
  noLiquidity
) => {
  const tx = await contractSend(
    uniRouter,
    _addLiquidity,
    [
      tokenA.address,
      tokenB.address,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      walletExtension.address,
      20000000000,
    ],
    walletExtension.address,
    noLiquidity ? 5000000 : 250000
  )
  return tx
}

export const removeLiquidity = async (uniRouter, tokenA, tokenB, walletExtension, tokenAAmount, tokenBAmount, lp) => {
  const tx = await contractSend(
    uniRouter,
    _removeLiquidity,
    [tokenA.address, tokenB.address, lp, tokenAAmount, tokenBAmount, walletExtension.address, 20000000000],
    walletExtension.address
  )
  return tx
}

export const addLiquidityHYDRA = async (
  uniRouter,
  token,
  walletExtension,
  amountTokenDesired,
  amountTokenMin,
  amountHYDRADesired,
  amountHYDRAMin,
  noLiquidity
) => {
  const tx = await contractSend(
    uniRouter,
    _addLiquidityHYDRA,
    [token.address, amountTokenDesired, amountTokenMin, amountHYDRAMin, walletExtension.address, 20000000000],
    walletExtension.address,
    noLiquidity ? 5000000 : 250000,
    amountHYDRADesired
  )
  return tx
}

export const removeLiquidityHYDRA = async (uniRouter, tokenA, walletExtension, lp) => {
  const tx = await contractSend(
    uniRouter,
    _removeLiquidityHYDRA,
    [tokenA.address, lp, 0, 0, walletExtension.address, 20000000000],
    walletExtension.address
  )
  return tx
}
