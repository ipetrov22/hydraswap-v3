import {
  MAINNET_MULTICALL,
  MAINNET_NONFUNGIBLE_POSITION_MANAGER,
  MAINNET_QUOTER,
  MAINNET_SWAP_ROUTER,
  MAINNET_TICK_LENS,
  MAINNET_V2_FACTORY,
  MAINNET_V2_ROUTER,
  MAINNET_V3_FACTORY,
  MAINNET_V3_MIGRATOR,
  TESTNET_MULTICALL,
  TESTNET_NONFUNGIBLE_POSITION_MANAGER,
  TESTNET_QUOTER,
  TESTNET_SWAP_ROUTER,
  TESTNET_TICK_LENS,
  TESTNET_V2_FACTORY,
  TESTNET_V2_ROUTER,
  TESTNET_V3_FACTORY,
  TESTNET_V3_MIGRATOR,
} from 'hydra/contracts/contractAddresses'
import { ChainId } from 'hydra/sdk'

import { constructSameAddressMap } from '../utils/constructSameAddressMap'
import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const UNI_ADDRESS: AddressMap = constructSameAddressMap('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984')

// ** HYDRA CONTRACTS **
export const V2_FACTORY_ADDRESSES: AddressMap = {
  [ChainId.MAINNET]: MAINNET_V2_FACTORY,
  [ChainId.TESTNET]: TESTNET_V2_FACTORY,
}
export const V2_ROUTER_ADDRESSES: AddressMap = {
  [ChainId.MAINNET]: MAINNET_V2_ROUTER,
  [ChainId.TESTNET]: TESTNET_V2_ROUTER,
}
// ** HYDRA CONTRACTS **

/* V3 Contract Addresses */
export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: MAINNET_V3_FACTORY,
  [SupportedChainId.TESTNET]: TESTNET_V3_FACTORY,
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: MAINNET_V3_MIGRATOR,
  [SupportedChainId.TESTNET]: TESTNET_V3_MIGRATOR,
}

export const MULTICALL_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: MAINNET_MULTICALL,
  [SupportedChainId.TESTNET]: TESTNET_MULTICALL,
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: MAINNET_SWAP_ROUTER,
  [SupportedChainId.TESTNET]: TESTNET_SWAP_ROUTER,
}

/**
 * The oldest V0 governance address
 */
export const GOVERNANCE_ALPHA_V0_ADDRESSES: AddressMap = constructSameAddressMap(
  '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'
)
/**
 * The older V1 governance address
 */
export const GOVERNANCE_ALPHA_V1_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0xC4e172459f1E7939D522503B81AFAaC1014CE6F6',
}
/**
 * The latest governor bravo that is currently admin of timelock
 */
export const GOVERNANCE_BRAVO_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0x408ED6354d4973f66138C91495F2f2FCbd8724C3',
}

export const TIMELOCK_ADDRESS: AddressMap = constructSameAddressMap('0x1a9C8182C09F50C8318d769245beA52c32BE35BC')

export const MERKLE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e',
}

export const ARGENT_WALLET_DETECTOR_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0xeca4B0bDBf7c55E9b7925919d03CbF8Dc82537E8',
}

export const QUOTER_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: MAINNET_QUOTER,
  [SupportedChainId.TESTNET]: TESTNET_QUOTER,
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: MAINNET_NONFUNGIBLE_POSITION_MANAGER,
  [SupportedChainId.TESTNET]: TESTNET_NONFUNGIBLE_POSITION_MANAGER,
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.ROPSTEN]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.GOERLI]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.RINKEBY]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
}

export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0x65770b5283117639760beA3F867b69b3697a91dd',
}

export const TICK_LENS_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: MAINNET_TICK_LENS,
  [SupportedChainId.TESTNET]: TESTNET_TICK_LENS,
}
