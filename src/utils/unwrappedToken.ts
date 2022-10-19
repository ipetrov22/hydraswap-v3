import { Currency } from '@uniswap/sdk-core'
import { HYDRA_CURRENCIES, WHYDRA } from 'hydra/sdk'

export function unwrappedToken(currency: Currency): Currency {
  const chainId: keyof typeof WHYDRA = currency.chainId
  if (currency.equals(WHYDRA[chainId])) return HYDRA_CURRENCIES[chainId]
  return currency
}
