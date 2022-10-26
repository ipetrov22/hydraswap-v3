import { V3_MIGRATOR_ADDRESSES } from 'constants/addresses'
import { useHydraChainId, useHydraLibrary } from 'hooks/useAddHydraAccExtension'
import { V3MigratorAbi } from 'hydra/contracts/abi'
import { getContract } from 'hydra/contracts/utils'
import { useMemo } from 'react'

export function useContract(address: string, abi: any[]) {
  const [library] = useHydraLibrary()
  const contract = useMemo(() => library && getContract(library, address, abi), [library, address, abi])
  return contract
}

export function useV3MigratorContract() {
  const [chainId] = useHydraChainId()
  return useContract(V3_MIGRATOR_ADDRESSES[chainId], V3MigratorAbi)
}
