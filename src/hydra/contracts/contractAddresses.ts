import { ChainId } from 'hydra/sdk'

export const MAINNET_V2_FACTORY = '0x5a2a927bea6c5f4a48d4e0116049c1e36d52a528'
export const TESTNET_V2_FACTORY = '0xd8350cf44cb326c81fdf91ded2bf92e6b785d64c'
export const MAINNET_V2_ROUTER = '0xdf60e3babacfce81c9efcb268c14a7d33efe567b'
export const TESTNET_V2_ROUTER = '0xd048412e0500b80c1f8c4dcc3e0dc189ed636251'
export const MAINNET_BALANCE_RESOLVER = '0xa57b9a85b63899b9d46c5a9c35bf53de7ea1c488'
export const TESTNET_BALANCE_RESOLVER = '0x99ebd45793173ef3e3f35359f9f11487fc575f49'

export const getAddressV2Factory = (chainId: ChainId | undefined) => {
  if (!chainId) return undefined
  return chainId === ChainId.MAINNET ? MAINNET_V2_FACTORY : TESTNET_V2_FACTORY
}

export const getAddressV2Router = (chainId: ChainId | undefined) => {
  if (!chainId) return undefined
  return chainId === ChainId.MAINNET ? MAINNET_V2_ROUTER : TESTNET_V2_ROUTER
}

export const getAddressBalanceResolver = (chainId: ChainId | undefined) => {
  if (!chainId) return undefined
  return chainId === ChainId.MAINNET ? MAINNET_BALANCE_RESOLVER : TESTNET_BALANCE_RESOLVER
}
