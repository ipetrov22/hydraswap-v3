import { contractCall } from './utils'

const _collect = 'collect'

export const callCollect = async (contract, sender, params) => {
  const result = await contractCall(contract, _collect, [params], sender?.address || sender)
  return result
}
