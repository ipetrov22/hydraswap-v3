import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { useHydraLibrary, useHydraWalletAddress } from 'hooks/useAddHydraAccExtension'
import { contractCall, getMultipleContractSingleData } from 'hydra/contracts/utils'
import { useContract } from 'hydra/hooks/useContract'
import { useEffect, useMemo, useState } from 'react'
import { CallState } from 'state/hydra/hrc20calls'

export function useMultipleContractSingleData(
  addresses: (string | undefined)[],
  abi: any[],
  methodName: string,
  callInputs: (string | number | BigNumber | (string | undefined)[] | undefined)[] = []
) {
  const [library] = useHydraLibrary()
  const [account] = useHydraWalletAddress()
  const [returnData, setReturnData] = useState<CallState[]>([])

  const addressesStringified = useMemo(() => JSON.stringify(addresses), [addresses])
  const callInputsStringified = useMemo(() => JSON.stringify(callInputs), [callInputs])

  useEffect(() => {
    const addresses = JSON.parse(addressesStringified).filter((x: string | undefined) => !!x)
    const callInputs = JSON.parse(callInputsStringified)
    const iface = new Interface(abi)

    if (library && account) {
      getMultipleContractSingleData(library, account, addresses, iface, methodName, callInputs)
        .then(({ executionResult }) => {
          if (executionResult?.excepted === 'None') {
            const res = executionResult.formattedOutput[1].map((x: any) => ({
              valid: true,
              result: x,
              loading: false,
              syncing: false,
              error: false,
            }))

            setReturnData(res)
          } else {
            const res = addresses.map(() => ({
              valid: false,
              result: undefined,
              loading: false,
              syncing: false,
              error: true,
            }))

            setReturnData(res)
          }
        })
        .catch(console.log)
    }
  }, [addressesStringified, abi, methodName, callInputsStringified, account, library])

  return returnData
}

// should be made to return CallState[]
export function useSingleCallResult(address: string, abi: any[], methodName: string) {
  const [account] = useHydraWalletAddress()
  const [returnData, setReturnData] = useState<undefined | string>()
  const contract = useContract(address, abi)

  useEffect(() => {
    account &&
      contractCall(contract, methodName, [], account)
        .then(({ executionResult }) => {
          if (executionResult?.excepted === 'None') {
            const res = executionResult.formattedOutput[0]
            setReturnData(typeof res === 'string' ? res : res?.toString())
          }
        })
        .catch(console.log)
  }, [contract, account, methodName])

  return returnData
}
