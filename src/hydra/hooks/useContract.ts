import { Interface } from '@ethersproject/abi'
import { MULTICALL_ADDRESSES, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, V3_MIGRATOR_ADDRESSES } from 'constants/addresses'
import { useHydraChainId, useHydraLibrary } from 'hooks/useAddHydraAccExtension'
import { AbiHydraV2Pair, MulticallAbi, NonfungiblePositionManagerAbi, V3MigratorAbi } from 'hydra/contracts/abi'
import { getContract } from 'hydra/contracts/utils'
import { useMemo } from 'react'

export function useContract(address: string, abi: any[]) {
  const [library] = useHydraLibrary()
  const contract = useMemo(() => library && address && getContract(library, address, abi), [library, address, abi])
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
  return useContract(MULTICALL_ADDRESSES[chainId], MulticallAbi)
}
