import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { HYDRA } from 'hydra/sdk'

export default function useNativeCurrency(): NativeCurrency | Token {
  return HYDRA
}
