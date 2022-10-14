import { Currency } from '@uniswap/sdk-core'
import { ChainId, HYDRA, WHYDRA } from 'hydra/sdk'

export function unwrappedToken(currency: Currency): Currency {
  const chainId = ChainId.MAINNET
  if (currency.equals(WHYDRA[chainId])) return HYDRA
  return currency
}
