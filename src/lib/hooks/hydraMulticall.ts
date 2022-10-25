import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { useHydraLibrary, useHydraWalletAddress } from 'hooks/useAddHydraAccExtension'
import { getMultipleContractSingleData } from 'hydra/contracts/utils'
import { useEffect, useMemo, useState } from 'react'

export function useMultipleContractSingleData(
  addresses: (string | undefined)[],
  abi: any[],
  methodName: string,
  callInputs?: (string | number | BigNumber | (string | undefined)[] | undefined)[]
) {
  const [library] = useHydraLibrary()
  const [account] = useHydraWalletAddress()
  const [returnData, setReturnData] = useState<undefined | string>()

  const addressesStringified = useMemo(() => JSON.stringify(addresses), [addresses])
  const callInputsStringified = useMemo(() => JSON.stringify(callInputs), [callInputs])

  useEffect(() => {
    const addresses = JSON.parse(addressesStringified)
    const callInputs = JSON.parse(callInputsStringified)
    const iface = new Interface(abi)

    if (library && account) {
      getMultipleContractSingleData(library, account, addresses, iface, methodName, callInputs)
        .then(({ executionResult }) => {
          if (executionResult?.excepted === 'None') {
            setReturnData(executionResult.formattedOutput[1])
          }
        })
        .catch(console.log)
    }
  }, [addressesStringified, abi, methodName, callInputsStringified, account, library])

  return returnData
}
