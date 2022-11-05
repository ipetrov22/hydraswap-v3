import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { useHydraLibrary, useHydraWalletAddress } from 'hooks/useAddHydraAccExtension'
import { contractCall, getMultipleContractSingleData, getSingleContractMultipleData } from 'hydra/contracts/utils'
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
    // Ref: https://medium.com/geekculture/the-tricky-behavior-of-useeffect-hook-in-react-18-282ef4fb570a
    let ignore = false // Workaround to React 18 introducing a new development-only check to Strict Mode.

    const addresses = JSON.parse(addressesStringified).filter((x: string | undefined) => !!x)
    const callInputs = JSON.parse(callInputsStringified)
    const iface = new Interface(abi)

    if (library && account) {
      getMultipleContractSingleData(library, account, addresses, iface, methodName, callInputs)
        .then(({ executionResult }) => {
          if (executionResult?.excepted === 'None') {
            const res = executionResult.formattedOutput[1].map((x: any) => {
              const decoded = iface.decodeFunctionResult(methodName, '0x' + x)
              return {
                valid: true,
                result: decoded,
                loading: false,
                syncing: false,
                error: false,
              }
            })

            !ignore && setReturnData(res)
          } else {
            const res = addresses.map(() => ({
              valid: false,
              result: undefined,
              loading: false,
              syncing: false,
              error: true,
            }))

            !ignore && setReturnData(res)
          }
        })
        .catch(console.log)
    }
    return () => {
      ignore = true
    }
  }, [addressesStringified, abi, methodName, callInputsStringified, account, library])

  return returnData
}

export function useSingleCallResult(
  contract: any,
  methodName: string,
  callInputs?: (string | BigNumber | undefined)[]
) {
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
    // Ref: https://medium.com/geekculture/the-tricky-behavior-of-useeffect-hook-in-react-18-282ef4fb570a
    let ignore = false // Workaround to React 18 introducing a new development-only check to Strict Mode.

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
            !ignore && setReturnData(res)
          } else {
            const res = {
              valid: false,
              result: undefined,
              loading: false,
              syncing: false,
              error: true,
            }
            !ignore && setReturnData(res)
          }
        })
        .catch((e) => {
          console.log(e)
        })

    return () => {
      ignore = true
    }
  }, [contract, account, methodName, callInputsStringified])

  return returnData
}

export function useSingleContractMultipleData(
  address: string | undefined,
  abi: any[],
  methodName: string,
  callInputs: ((string | number | BigNumber | (string | undefined)[] | undefined)[] | undefined)[] = []
) {
  const [library] = useHydraLibrary()
  const [account] = useHydraWalletAddress()
  const [returnData, setReturnData] = useState<CallState[]>([])

  const callInputsStringified = useMemo(() => JSON.stringify(callInputs), [callInputs])

  useEffect(() => {
    // Ref: https://medium.com/geekculture/the-tricky-behavior-of-useeffect-hook-in-react-18-282ef4fb570a
    let ignore = false // Workaround to React 18 introducing a new development-only check to Strict Mode.

    const callInputs = JSON.parse(callInputsStringified)
    const iface = new Interface(abi)

    if (library && account) {
      getSingleContractMultipleData(library, account, address, iface, methodName, callInputs)
        .then(({ executionResult }) => {
          if (executionResult?.excepted === 'None') {
            const res = executionResult.formattedOutput[1].map((x: any) => {
              const decoded = iface.decodeFunctionResult(methodName, '0x' + x)
              return {
                valid: true,
                result: decoded,
                loading: false,
                syncing: false,
                error: false,
              }
            })

            !ignore && setReturnData(res)
          } else {
            const res = callInputs.map(() => ({
              valid: false,
              result: undefined,
              loading: false,
              syncing: false,
              error: true,
            }))

            !ignore && setReturnData(res)
          }
        })
        .catch(console.log)
    }

    return () => {
      ignore = true
    }
  }, [callInputsStringified, address, abi, methodName, account, library])

  return returnData
}
