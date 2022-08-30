import JSBI from 'jsbi'

export const EXPLORER_URL = process.env.REACT_EXPLORER_URL || `https://explorer.hydrachain.org`
export const NetworkContextName = 'NETWORK'
export const MIN_HYDRA: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(6)) // .01 HYDRA
