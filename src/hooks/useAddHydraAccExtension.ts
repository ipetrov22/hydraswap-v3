import { hydraToHexAddress } from 'hydra/contracts/utils'
import { ChainId } from 'hydra/sdk'
import { getChainId } from 'hydra/utils'
import { useEffect, useMemo, useState } from 'react'

import useHydra from './useHydra'

export function isEmptyObj(obj: Record<string, any>) {
  if (!obj) {
    return true
  }
  return Object.keys(obj).length === 0
}

export interface Account {
  address: string
  balance: string
  loggedIn: boolean
  name: string
  network: string
}

export let account: Account
export let hydraweb3RPC: any

export default function useAddHydraAccExtension(walletExtension: any, hydraweb3Extension: any) {
  if (!isEmptyObj(walletExtension)) {
    account = walletExtension
  }
  if (!isEmptyObj(hydraweb3Extension)) {
    hydraweb3RPC = hydraweb3Extension
  }
}

export function useHydraLibrary() {
  const { hydraweb3Extension } = useHydra()
  const [library, setLibrary] = useState(hydraweb3RPC)

  useEffect(() => {
    if (!isEmptyObj(hydraweb3Extension)) {
      setLibrary(hydraweb3Extension)
    }
  }, [hydraweb3Extension])

  return [library]
}

export function useHydraAccount() {
  const { walletExtension } = useHydra()
  const [acc, setAccount] = useState(account)

  useEffect(() => {
    setAccount(account)
  }, [walletExtension])

  return [acc]
}

export function useHydraWalletAddress() {
  const [account] = useHydraAccount()
  const [addr, setAddr] = useState(account?.address)

  useEffect(() => {
    setAddr(account?.address)
  }, [account])

  return [addr]
}

export function useHydraHexAddress(noPrefix?: boolean | undefined) {
  const [addr] = useHydraWalletAddress()
  const hexAddr = useMemo(() => addr && hydraToHexAddress(addr, noPrefix), [addr, noPrefix])
  return [hexAddr]
}

export function useHydraChainId(): ChainId[] {
  const [account] = useHydraAccount()
  const [chainId, setChainId] = useState(getChainId(account?.network))

  useEffect(() => {
    setChainId(getChainId(account?.network))
  }, [account?.network])

  return [chainId ?? ChainId.MAINNET]
}
