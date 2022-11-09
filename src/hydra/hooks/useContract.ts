import { Interface } from '@ethersproject/abi'
import {
  MULTICALL_ADDRESSES,
  NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
  QUOTER_ADDRESSES,
  TICK_LENS_ADDRESSES,
  V3_MIGRATOR_ADDRESSES,
} from 'constants/addresses'
import { useHydraChainId, useHydraLibrary } from 'hooks/useAddHydraAccExtension'
import {
  AbiHydraV2Pair,
  AbiQuoter,
  AbiQuoterV2,
  MulticallAbi,
  NonfungiblePositionManagerAbi,
  TickLensAbi,
  V3MigratorAbi,
} from 'hydra/contracts/abi'
import { getContract } from 'hydra/contracts/utils'
import { useMemo } from 'react'

export function useContract(address: string, abi: any[]) {
  const [library] = useHydraLibrary()
  const contract = useMemo(() => library && address && getContract(library, address, abi), [library, address, abi])
  if (contract) {
    contract.interface = new Interface(abi)
  }
  return contract
}

export function useV3MigratorContract() {
  const [chainId] = useHydraChainId()
  return useContract(V3_MIGRATOR_ADDRESSES[chainId], V3MigratorAbi)
}

export function useV3MigratorInterface() {
  const iface = useMemo(() => new Interface(V3MigratorAbi), [])
  return iface
}

export function useV2PairContract(address: string | undefined) {
  return useContract(address ?? '', AbiHydraV2Pair)
}

export function useV3NFTPositionManagerContract() {
  const [chainId] = useHydraChainId()
  return useContract(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId], NonfungiblePositionManagerAbi)
}

export function useMulticallContract() {
  const [chainId] = useHydraChainId()
  const contract = useContract(MULTICALL_ADDRESSES[chainId], MulticallAbi)
  return contract
}

export function useTickLens() {
  const [chainId] = useHydraChainId()
  return useContract(TICK_LENS_ADDRESSES[chainId], TickLensAbi)
}

export function useQuoter(useQuoterV2: boolean) {
  const [chainId] = useHydraChainId()
  return useContract(QUOTER_ADDRESSES[chainId], useQuoterV2 ? AbiQuoterV2 : AbiQuoter)
}
