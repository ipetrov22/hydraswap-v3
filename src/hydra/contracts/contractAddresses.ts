import { ChainId } from 'hydra/sdk'

// V2 Contracts
export const MAINNET_V2_FACTORY = '0x5a2a927bea6c5f4a48d4e0116049c1e36d52a528'
export const TESTNET_V2_FACTORY = '0xd8350cf44cb326c81fdf91ded2bf92e6b785d64c'
export const MAINNET_V2_ROUTER = '0xdf60e3babacfce81c9efcb268c14a7d33efe567b'
export const TESTNET_V2_ROUTER = '0xd048412e0500b80c1f8c4dcc3e0dc189ed636251'
export const MAINNET_BALANCE_RESOLVER = '0xa57b9a85b63899b9d46c5a9c35bf53de7ea1c488'
export const TESTNET_BALANCE_RESOLVER = '0x99ebd45793173ef3e3f35359f9f11487fc575f49'
export const MAINNET_MULTICALL = '0x3b42289638b68a7a7f61fb8729b3357694f2ba8e'
export const TESTNET_MULTICALL = '0x2a6cd8b017f2f7b348b8e258625566465afe5f9a'

// V3 Contracts
export const MAINNET_V3_FACTORY = '0x2df20a1a696af665091b8fd76142b415d4a43741'
export const TESTNET_V3_FACTORY = '0x0f5d2434f6ddd9f4ee9ca0789005b31792eda300'
export const MAINNET_V3_MIGRATOR = '0xe7a9386c6fc8b88504077a36e9e278abed2d0fa7'
export const TESTNET_V3_MIGRATOR = '0x1ff16db823020d0a318a8d776e47151fddc2422c'
export const MAINNET_NONFUNGIBLE_POSITION_MANAGER = '0x3ccccb201c085988a416e9248077f3314f93ac65'
export const TESTNET_NONFUNGIBLE_POSITION_MANAGER = '0x11413b1e0377b84524bbb5824af3513548c70994'
// '0xcce9f1e390be92567aaca25305c43b6a671a0c64' nfm
export const MAINNET_TICK_LENS = '0xe0603697f370a3d2225265e2acbf9af49314b71a'
export const TESTNET_TICK_LENS = '0x8b1aa1b794ff9339f3ebd8e514c28e93abcb68a1'
export const MAINNET_QUOTER = '0xbd288e769917c51ed5e39f14f29ce3e7c3fbd11d' // QuoterV2
export const TESTNET_QUOTER = '0x409c1f88cbc52443c3147e1e419ba1c1c98b951a' // QuoterV2
export const MAINNET_SWAP_ROUTER = '0xcc5d0ea0ad89ddcce06c6ccb88575dcc5bf42879' // SwapRouter02
export const TESTNET_SWAP_ROUTER = '0x2ce4e19f1e7fa8a135bf25a808fbfa6a1d48c4de' // '0x44bf91dbe7e35b934185d91dd31a4e61f893a1be'

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
