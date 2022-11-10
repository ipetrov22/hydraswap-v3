import { ChainId } from 'hydra/sdk'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
// V2 Contracts
export const MAINNET_V2_FACTORY = '0x5a2a927bea6c5f4a48d4e0116049c1e36d52a528'
export const TESTNET_V2_FACTORY = '0xd8350cf44cb326c81fdf91ded2bf92e6b785d64c'
export const MAINNET_V2_ROUTER = '0xdf60e3babacfce81c9efcb268c14a7d33efe567b'
export const TESTNET_V2_ROUTER = '0xd048412e0500b80c1f8c4dcc3e0dc189ed636251'
export const MAINNET_BALANCE_RESOLVER = '0xa57b9a85b63899b9d46c5a9c35bf53de7ea1c488'
export const TESTNET_BALANCE_RESOLVER = '0x99ebd45793173ef3e3f35359f9f11487fc575f49'
export const MAINNET_MULTICALL = ZERO_ADDRESS
export const TESTNET_MULTICALL = '0x1fa26bfb19c8ff0d193e946eddf80f5bd9a10468'

// V3 Contracts
export const MAINNET_V3_FACTORY = ZERO_ADDRESS
export const TESTNET_V3_FACTORY = '0x0f5d2434f6ddd9f4ee9ca0789005b31792eda300'
export const MAINNET_V3_MIGRATOR = ZERO_ADDRESS
export const TESTNET_V3_MIGRATOR = '0x1ff16db823020d0a318a8d776e47151fddc2422c'
export const MAINNET_NONFUNGIBLE_POSITION_MANAGER = ZERO_ADDRESS
export const TESTNET_NONFUNGIBLE_POSITION_MANAGER = '0x11413b1e0377b84524bbb5824af3513548c70994'
export const MAINNET_TICK_LENS = ZERO_ADDRESS
export const TESTNET_TICK_LENS = '0x8b1aa1b794ff9339f3ebd8e514c28e93abcb68a1'
export const MAINNET_QUOTER = ZERO_ADDRESS
export const TESTNET_QUOTER = '0x409c1f88cbc52443c3147e1e419ba1c1c98b951a'

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

export const getAddressMulticall = (chainId: ChainId | undefined) => {
  if (!chainId) return undefined
  return chainId === ChainId.MAINNET ? MAINNET_MULTICALL : TESTNET_MULTICALL
}

export const getAddressV3Migrator = (chainId: ChainId | undefined) => {
  if (!chainId) return undefined
  return chainId === ChainId.MAINNET ? MAINNET_V3_MIGRATOR : TESTNET_V3_MIGRATOR
}
