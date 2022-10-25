import { Hydraweb3 } from 'ipetrov22-hydraweb3-js'
import { useEffect, useState } from 'react'

import invoke from '../hydra/mobileInvoke/browser'

const rawCall = invoke.bind('rawCall')

declare global {
  interface Window {
    hydrawallet: any
    ReactNativeWebView: any
  }
}

export default function useHydra(): { walletExtension: any; hydraweb3Extension: any; error: string } {
  const [walletExtension, setWalletExtension] = useState({})
  const [hydraweb3Extension, setHydraweb3Extension] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    if (window.hydrawallet) {
      return
    }
    window.addEventListener(
      'message',
      function handleHydrawalletInstalledOrUpdated(event) {
        if (event.data.message && event.data.message.type === 'HYDRAWALLET_INSTALLED_OR_UPDATED') {
          // Refresh the page
          window.location.reload()
        }
      },
      false
    )

    window.addEventListener(
      'message',
      function handleHydrawalletAcctChanged(event) {
        if (event.data.message && event.data.message.type === 'HYDRAWALLET_ACCOUNT_CHANGED') {
          if (event.data.message.payload.error) {
            // handle error
            setError(event.data.message.payload.error)
          }
          setError('')
          // should be in state where wallet or contract functions are used
          const account = event.data.message.payload.account
          const hydraExtension = new Hydraweb3(window.ReactNativeWebView ? { rawCall } : window.hydrawallet.rpcProvider)
          setWalletExtension(account)
          setHydraweb3Extension(hydraExtension)
        }
      },
      false
    )

    // Handle incoming messages
    window.addEventListener(
      'message',
      function handleMessage(message) {
        if (message.data.target === 'hydrawallet-inpage') {
          // result: object
          // error: string
          const { error } = message.data.message.payload
          if (error) {
            if (error === 'Not logged in. Please log in to hydrawallet first.') {
              // Show an alert dialog that the user needs to login first
            } else {
              // Handle different error than not logged in...
            }
            return
          }

          if (message?.data?.payload?.statusChangeReason === 'Account Logged Out') {
            window.postMessage({ message: { type: 'CONNECT_HYDRAWALLET' } }, '')
          }
          // Do something with the message result...
        }
      },
      false
    )
  }, [])

  return { walletExtension, hydraweb3Extension, error }
}
