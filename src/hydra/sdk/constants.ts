import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | string

export enum ChainId {
  MAINNET = 1,
  TESTNET = 2,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

// export const FACTORY_ADDRESS = '0x5a2a927bea6c5f4a48d4e0116049c1e36d52a528' // V2 MAINNET
export const FACTORY_ADDRESS = '0xd8350cf44cb326c81fdf91ded2bf92e6b785d64c' // V2 TESTNET

// export const INIT_CODE_HASH = '0x8bd2e44ddacff4efbf1f9ead74bd191fe945f9824cae3109bfc068d82a3cb3d1' // MAINNET
export const INIT_CODE_HASH = '0x00f5a7aa52ba04ca4b2f7f2ef08b82a61ac4e8fead11ebd9c4fbc48edc95b708' // TESTNET

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)
