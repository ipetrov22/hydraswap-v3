import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { useHydraLibrary, useHydraWalletAddress } from 'hooks/useAddHydraAccExtension'
import { contractCall, getMultipleContractSingleData } from 'hydra/contracts/utils'
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

export function useSingleCallResult(contract: any, methodName: string, callInputs?: (string | undefined)[]) {
  const [account] = useHydraWalletAddress()
  const [returnData, setReturnData] = useState<CallState>({
    valid: false,
    result: undefined,
    loading: false,
    syncing: false,
    error: false,
  })

  const callInputsStringified = useMemo(() => JSON.stringify(callInputs ?? []), [callInputs])

  useEffect(() => {
    const callInputs = JSON.parse(callInputsStringified)
    account &&
      contract &&
      contractCall(contract, methodName, callInputs ?? [], account)
        .then(({ executionResult }) => {
          if (executionResult?.excepted === 'None') {
            const res = {
              valid: true,
              result: executionResult.formattedOutput,
              loading: false,
              syncing: false,
              error: false,
            }
            setReturnData(res)
          } else {
            const res = {
              valid: false,
              result: undefined,
              loading: false,
              syncing: false,
              error: true,
            }
            setReturnData(res)
          }
        })
        .catch(console.log)
  }, [contract, account, methodName, callInputsStringified])

  return returnData
}
