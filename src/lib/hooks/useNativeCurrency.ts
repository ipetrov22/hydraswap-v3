import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { useHydraChainId } from 'hooks/useAddHydraAccExtension'
import { HYDRA_CURRENCIES } from 'hydra/sdk'

export default function useNativeCurrency(): NativeCurrency | Token {
  const [chainId] = useHydraChainId()
  return HYDRA_CURRENCIES[chainId]
}
