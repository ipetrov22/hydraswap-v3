import { Currency } from '@uniswap/sdk-core'
import { HYDRA, WHYDRA } from 'hydra/sdk'

export function unwrappedToken(currency: Currency): Currency {
  const chainId: keyof typeof WHYDRA = currency.chainId
  if (currency.equals(WHYDRA[chainId])) return HYDRA
  return currency
}
