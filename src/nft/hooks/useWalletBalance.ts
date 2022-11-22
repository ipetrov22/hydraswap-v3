import { BigNumber } from '@ethersproject/bignumber'
import { Web3Provider } from '@ethersproject/providers'
import { parseEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { account as accountHydra } from 'hooks/useAddHydraAccExtension'
import { useHYDRABalance } from 'state/wallets/hooks'

interface WalletBalanceProps {
  address: string
  balance: string
  weiBalance: BigNumber
  provider: Web3Provider | undefined
}

export function useWalletBalance(): WalletBalanceProps {
  const { account: address, provider } = useWeb3React()
  const balanceString = useHYDRABalance(accountHydra)?.[address ?? '']?.toSignificant(3) ?? ''

  return address == null
    ? {
        address: '',
        balance: '0',
        weiBalance: parseEther('0'),
        provider: undefined,
      }
    : {
        address,
        balance: balanceString,
        weiBalance: parseEther(balanceString),
        provider,
      }
}
