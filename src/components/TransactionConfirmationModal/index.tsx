import { Trans } from '@lingui/macro'
import { Currency } from '@uniswap/sdk-core'
import Badge from 'components/Badge'
import { getChainInfo } from 'constants/chainInfo'
import { SupportedL2ChainId } from 'constants/chains'
import { RedesignVariant, useRedesignFlag } from 'featureFlags/flags/redesign'
import { ChainId } from 'hydra/sdk'
import { ReactNode } from 'react'
import { AlertCircle, AlertTriangle, ArrowUpCircle } from 'react-feather'
import { Text } from 'rebass'
import { useIsTransactionConfirmed, useTransaction } from 'state/transactions/hooks'
import styled, { useTheme } from 'styled-components/macro'
import { isL2ChainId } from 'utils/chains'

import Circle from '../../assets/images/blue-loader.svg'
import { ExternalLink, ThemedText } from '../../theme'
import { CloseIcon, CustomLightSpinner } from '../../theme'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { TransactionSummary } from '../AccountDetails/TransactionSummary'
import { ButtonPrimary } from '../Button'
import { AutoColumn, ColumnCenter } from '../Column'
import Modal from '../Modal'
import { RowBetween, RowFixed } from '../Row'
import AnimatedConfirmation from './AnimatedConfirmation'

const Wrapper = styled.div<{ redesignFlag?: boolean }>`
  background-color: ${({ redesignFlag, theme }) => redesignFlag && theme.backgroundSurface};
  outline: ${({ redesignFlag, theme }) => redesignFlag && `1px solid ${theme.backgroundOutline}`};
  width: 100%;
  padding: 1rem;
`
const Section = styled(AutoColumn)<{ inline?: boolean }>`
  padding: ${({ inline }) => (inline ? '0' : '0')};
`

const BottomSection = styled(Section)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding-bottom: 10px;
`

const ConfirmedIcon = styled(ColumnCenter)<{ inline?: boolean }>`
  padding: ${({ inline }) => (inline ? '20px 0' : '32px 0;')};
`

const StyledLogo = styled.img`
  height: 16px;
  width: 16px;
  margin-left: 6px;
`

function ConfirmationPendingContent({
  onDismiss,
  pendingText,
  inline,
}: {
  onDismiss: () => void
  pendingText: ReactNode
  inline?: boolean // not in modal
}) {
  const redesignFlag = useRedesignFlag()
  const redesignFlagEnabled = redesignFlag === RedesignVariant.Enabled
  const theme = useTheme()

  return redesignFlagEnabled ? (
    <Wrapper>
      <AutoColumn gap="md">
        {!inline && (
          <RowBetween>
            <div />
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          <CustomLightSpinner src={Circle} alt="loader" size={inline ? '40px' : '90px'} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'}>
          <Text fontWeight={500} fontSize={20} color={theme.textPrimary} textAlign="center">
            <Trans>Waiting for confirmation</Trans>
          </Text>
          <Text fontWeight={600} fontSize={16} color={theme.textPrimary} textAlign="center">
            {pendingText}
          </Text>
          <Text fontWeight={400} fontSize={12} color={theme.textSecondary} textAlign="center" marginBottom="12px">
            <Trans>Confirm this transaction in your wallet</Trans>
          </Text>
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  ) : (
    <Wrapper>
      <AutoColumn gap="md">
        {!inline && (
          <RowBetween>
            <div />
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          <CustomLightSpinner src={Circle} alt="loader" size={inline ? '40px' : '90px'} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'}>
          <Text fontWeight={500} fontSize={20} textAlign="center">
            <Trans>Waiting For Confirmation</Trans>
          </Text>
          <Text fontWeight={400} fontSize={16} textAlign="center">
            {pendingText}
          </Text>
          <Text fontWeight={500} fontSize={14} color="#565A69" textAlign="center" marginBottom="12px">
            <Trans>Confirm this transaction in your wallet</Trans>
          </Text>
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  )
}
function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  inline,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: number
  inline?: boolean // not in modal
}) {
  const theme = useTheme()
  const redesignFlag = useRedesignFlag()
  const redesignFlagEnabled = redesignFlag === RedesignVariant.Enabled

  return redesignFlagEnabled ? (
    <Wrapper>
      <Section inline={inline}>
        {!inline && (
          <RowBetween>
            <div />
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          <ArrowUpCircle strokeWidth={1} size={inline ? '40px' : '75px'} color={theme.accentActive} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'} style={{ paddingBottom: '12px' }}>
          <ThemedText.MediumHeader textAlign="center">
            <Trans>Transaction submitted</Trans>
          </ThemedText.MediumHeader>

          {chainId && hash && (
            <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}>
              <Text fontWeight={600} fontSize={14} color={theme.accentAction}>
                <Trans>View on Hydrachain Explorer</Trans>
              </Text>
            </ExternalLink>
          )}
        </AutoColumn>
      </Section>
    </Wrapper>
  ) : (
    <Wrapper>
      <Section inline={inline}>
        {!inline && (
          <RowBetween>
            <div />
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          <ArrowUpCircle strokeWidth={0.5} size={inline ? '40px' : '90px'} color={theme.deprecated_primary1} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'}>
          <Text fontWeight={500} fontSize={20} textAlign="center">
            <Trans>Transaction Submitted</Trans>
          </Text>
          {chainId && hash && (
            <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}>
              <Text fontWeight={500} fontSize={14} color={theme.deprecated_primary1}>
                <Trans>View on Explorer</Trans>
              </Text>
            </ExternalLink>
          )}

          <ButtonPrimary onClick={onDismiss} style={{ margin: '20px 0 0 0' }}>
            <Text fontWeight={500} fontSize={20}>
              {inline ? <Trans>Return</Trans> : <Trans>Close</Trans>}
            </Text>
          </ButtonPrimary>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent,
}: {
  title: ReactNode
  onDismiss: () => void
  topContent: () => ReactNode
  bottomContent?: () => ReactNode | undefined
}) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            {title}
          </Text>
          <CloseIcon onClick={onDismiss} data-cy="confirmation-close-icon" />
        </RowBetween>
        {topContent()}
      </Section>
      {bottomContent && <BottomSection gap="12px">{bottomContent()}</BottomSection>}
    </Wrapper>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: ReactNode; onDismiss: () => void }) {
  const redesignFlag = useRedesignFlag()
  const redesignFlagEnabled = redesignFlag === RedesignVariant.Enabled
  const theme = useTheme()
  return redesignFlagEnabled ? (
    <Wrapper redesignFlag={true}>
      <Section>
        <RowBetween>
          <Text fontWeight={600} fontSize={16}>
            <Trans>Error</Trans>
          </Text>
          <CloseIcon onClick={onDismiss} redesignFlag={true} />
        </RowBetween>
        <AutoColumn style={{ marginTop: 20, padding: '2rem 0' }} gap="24px" justify="center">
          <AlertTriangle color={theme.accentCritical} style={{ strokeWidth: 1 }} size={90} />
          <ThemedText.MediumHeader textAlign="center">{message}</ThemedText.MediumHeader>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <ButtonPrimary onClick={onDismiss} redesignFlag={true}>
          <Trans>Dismiss</Trans>
        </ButtonPrimary>
      </BottomSection>
    </Wrapper>
  ) : (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text fontWeight={500} fontSize={20}>
            <Trans>Error</Trans>
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <AutoColumn style={{ marginTop: 20, padding: '2rem 0' }} gap="24px" justify="center">
          <AlertTriangle color={theme.deprecated_red1} style={{ strokeWidth: 1.5 }} size={64} />
          <Text
            fontWeight={500}
            fontSize={16}
            color={theme.deprecated_red1}
            style={{ textAlign: 'center', width: '85%', wordBreak: 'break-word' }}
          >
            {message}
          </Text>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <ButtonPrimary onClick={onDismiss}>
          <Trans>Dismiss</Trans>
        </ButtonPrimary>
      </BottomSection>
    </Wrapper>
  )
}

function L2Content({
  onDismiss,
  chainId,
  hash,
  pendingText,
  inline,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: SupportedL2ChainId
  currencyToAdd?: Currency | undefined
  pendingText: ReactNode
  inline?: boolean // not in modal
}) {
  const theme = useTheme()

  const transaction = useTransaction(hash)
  const confirmed = useIsTransactionConfirmed(hash)
  const transactionSuccess = transaction?.receipt?.status === 1

  // convert unix time difference to seconds
  const secondsToConfirm = transaction?.confirmedTime
    ? (transaction.confirmedTime - transaction.addedTime) / 1000
    : undefined

  const info = getChainInfo(chainId)

  return (
    <Wrapper>
      <Section inline={inline}>
        {!inline && (
          <RowBetween mb="16px">
            <Badge>
              <RowFixed>
                <StyledLogo src={info.logoUrl} style={{ margin: '0 8px 0 0' }} />
                {info.label}
              </RowFixed>
            </Badge>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          {confirmed ? (
            transactionSuccess ? (
              // <CheckCircle strokeWidth={1} size={inline ? '40px' : '90px'} color={theme.deprecated_green1} />
              <AnimatedConfirmation />
            ) : (
              <AlertCircle strokeWidth={1} size={inline ? '40px' : '90px'} color={theme.deprecated_red1} />
            )
          ) : (
            <CustomLightSpinner src={Circle} alt="loader" size={inline ? '40px' : '90px'} />
          )}
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'}>
          <Text fontWeight={500} fontSize={20} textAlign="center">
            {!hash ? (
              <Trans>Confirm transaction in wallet</Trans>
            ) : !confirmed ? (
              <Trans>Transaction Submitted</Trans>
            ) : transactionSuccess ? (
              <Trans>Success</Trans>
            ) : (
              <Trans>Error</Trans>
            )}
          </Text>
          <Text fontWeight={400} fontSize={16} textAlign="center">
            {transaction ? <TransactionSummary info={transaction.info} /> : pendingText}
          </Text>
          {chainId && hash ? (
            <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}>
              <Text fontWeight={500} fontSize={14} color={theme.deprecated_primary1}>
                <Trans>View on Explorer</Trans>
              </Text>
            </ExternalLink>
          ) : (
            <div style={{ height: '17px' }} />
          )}
          <Text color={theme.deprecated_text3} style={{ margin: '20px 0 0 0' }} fontSize={'14px'}>
            {!secondsToConfirm ? (
              <div style={{ height: '24px' }} />
            ) : (
              <div>
                <Trans>Transaction completed in </Trans>
                <span style={{ fontWeight: 500, marginLeft: '4px', color: theme.deprecated_text1 }}>
                  {secondsToConfirm} seconds 🎉
                </span>
              </div>
            )}
          </Text>
          <ButtonPrimary onClick={onDismiss} style={{ margin: '4px 0 0 0' }}>
            <Text fontWeight={500} fontSize={20}>
              {inline ? <Trans>Return</Trans> : <Trans>Close</Trans>}
            </Text>
          </ButtonPrimary>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content: () => ReactNode
  attemptingTxn: boolean
  pendingText: ReactNode
  currencyToAdd?: Currency | undefined
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
}: ConfirmationModalProps) {
  const chainId = ChainId.MAINNET
  const redesignFlag = useRedesignFlag()
  const redesignFlagEnabled = redesignFlag === RedesignVariant.Enabled

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} redesignFlag={redesignFlagEnabled}>
      {isL2ChainId(chainId) && (hash || attemptingTxn) ? (
        <L2Content chainId={chainId} hash={hash} onDismiss={onDismiss} pendingText={pendingText} />
      ) : attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent chainId={chainId} hash={hash} onDismiss={onDismiss} />
      ) : (
        content()
      )}
    </Modal>
  )
}
