// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletModal from 'components/ConnectWalletModal'
import useAddHydraAccExtension, { account as accountHydra } from 'hooks/useAddHydraAccExtension'
import useHydra from 'hooks/useHydra'
import { darken } from 'polished'
import { useCallback, useMemo } from 'react'
import { AlertTriangle } from 'react-feather'
import { ApplicationModal } from 'state/application/reducer'
import styled, { css } from 'styled-components/macro'

import {
  useConnectHydra,
  useModalIsOpen,
  useToggleConnectModal,
  useToggleWalletModal,
} from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/types'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../Button'
import Loader from '../Loader'
import { RowBetween } from '../Row'
import WalletModal from '../WalletModal'

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 14px;
  cursor: pointer;
  user-select: none;
  height: 36px;
  margin-right: 2px;
  margin-left: 2px;
  :focus {
    outline: none;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.deprecated_red1};
  border: 1px solid ${({ theme }) => theme.deprecated_red1};
  color: ${({ theme }) => theme.deprecated_white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.deprecated_red1)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
  background-color: ${({ theme }) => theme.deprecated_primary4};
  border: none;

  color: ${({ theme }) => theme.deprecated_primaryText1};
  font-weight: 500;

  :hover,
  :focus {
    border: 1px solid ${({ theme }) => darken(0.05, theme.deprecated_primary4)};
    color: ${({ theme }) => theme.deprecated_primaryText1};
  }

  ${({ faded }) =>
    faded &&
    css`
      background-color: ${({ theme }) => theme.deprecated_primary5};
      border: 1px solid ${({ theme }) => theme.deprecated_primary5};
      color: ${({ theme }) => theme.deprecated_primaryText1};

      :hover,
      :focus {
        border: 1px solid ${({ theme }) => darken(0.05, theme.deprecated_primary4)};
        color: ${({ theme }) => darken(0.05, theme.deprecated_primaryText1)};
      }
    `}
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  background-color: ${({ pending, theme }) => (pending ? theme.deprecated_primary1 : theme.deprecated_bg1)};
  border: 1px solid ${({ pending, theme }) => (pending ? theme.deprecated_primary1 : theme.deprecated_bg1)};
  color: ${({ pending, theme }) => (pending ? theme.deprecated_white : theme.deprecated_text1)};
  font-weight: 500;
  :hover,
  :focus {
    border: 1px solid ${({ theme }) => darken(0.05, theme.deprecated_bg3)};

    :focus {
      border: 1px solid
        ${({ pending, theme }) =>
          pending ? darken(0.1, theme.deprecated_primary1) : darken(0.1, theme.deprecated_bg2)};
    }
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

const NetworkIcon = styled(AlertTriangle)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Web3StatusInner() {
  const { walletExtension, hydraweb3Extension, error } = useHydra()
  useAddHydraAccExtension(walletExtension, hydraweb3Extension)
  const account = accountHydra?.address

  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const hasPendingTransactions = !!pending.length

  const toggleWalletModal = useToggleWalletModal()
  const toggleConnectModal = useToggleConnectModal()
  const connectHydra = useConnectHydra()

  const connectWallet = useCallback(() => {
    toggleConnectModal()
    connectHydra()
  }, [toggleConnectModal, connectHydra])

  if (error) {
    return (
      <Web3StatusError onClick={toggleWalletModal}>
        <NetworkIcon />
        <Text>
          <Trans>Error</Trans>
        </Text>
      </Web3StatusError>
    )
  } else if (account) {
    return (
      <Web3StatusConnected
        data-testid="web3-status-connected"
        onClick={toggleWalletModal}
        pending={hasPendingTransactions}
      >
        {hasPendingTransactions ? (
          <RowBetween>
            <Text>
              <Trans>{pending?.length} Pending</Trans>
            </Text>{' '}
            <Loader stroke="white" />
          </RowBetween>
        ) : (
          <>
            <Text>{shortenAddress(account)}</Text>
          </>
        )}
      </Web3StatusConnected>
    )
  } else {
    return (
      <Web3StatusConnect onClick={connectWallet} faded={!account}>
        <Text>
          <Trans>Connect Wallet</Trans>
        </Text>
      </Web3StatusConnect>
    )
  }
}

export default function Web3Status() {
  const connectModalOpen = useModalIsOpen(ApplicationModal.CONNECT)
  const toggleConnectModal = useToggleConnectModal()
  const { ENSName } = useWeb3React()

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
      {!accountHydra?.address && (
        <ConnectWalletModal showConnectWalletModal={connectModalOpen} toggleConnectWalletModal={toggleConnectModal} />
      )}
    </>
  )
}
