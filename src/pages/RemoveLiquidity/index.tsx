import { Trans } from '@lingui/macro'
import { Currency, Percent } from '@uniswap/sdk-core'
import { ElementName, Event, EventName } from 'components/AmplitudeAnalytics/constants'
import { TraceEvent } from 'components/AmplitudeAnalytics/TraceEvent'
import { V2_ROUTER_ADDRESSES } from 'constants/addresses'
import useAddHydraAccExtension, { hydraweb3RPC, useHydraAccount, useHydraChainId } from 'hooks/useAddHydraAccExtension'
import useHydra from 'hooks/useHydra'
import { AbiHydraV2Router01 } from 'hydra/contracts/abi'
import { getContract } from 'hydra/contracts/utils'
import { removeLiquidity, removeLiquidityHYDRA } from 'hydra/contracts/v2RouterFunctions'
import { useCallback, useMemo, useState } from 'react'
import { ArrowDown, Plus } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import { Text } from 'rebass'
import { walletErrorCatch } from 'state/hydra/walletErrorCatch'
import { useTheme } from 'styled-components/macro'

import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { BlueCard, LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { AddRemoveTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import Slider from '../../components/Slider'
import { Dots } from '../../components/swap/styleds'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { WRAPPED_NATIVE_CURRENCY } from '../../constants/tokens'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useDebouncedChangeHandler from '../../hooks/useDebouncedChangeHandler'
import { useConnectHydra, useToggleConnectModal } from '../../state/application/hooks'
import { Field } from '../../state/burn/actions'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from '../../state/burn/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { TransactionType } from '../../state/transactions/types'
import { useUserSlippageToleranceWithDefault } from '../../state/user/hooks'
import { StyledInternalLink, ThemedText } from '../../theme'
import { calculateSlippageAmount } from '../../utils/calculateSlippageAmount'
import { currencyId } from '../../utils/currencyId'
import AppBody from '../AppBody'
import { ClickableText, MaxButton, Wrapper } from '../Pool/styleds'

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

export default function RemoveLiquidity() {
  const navigate = useNavigate()

  const { walletExtension, hydraweb3Extension } = useHydra()
  useAddHydraAccExtension(walletExtension, hydraweb3Extension)
  const [account] = useHydraAccount()
  const [chainId] = useHydraChainId()

  const { currencyIdA, currencyIdB } = useParams<{ currencyIdA: string; currencyIdB: string }>()
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])

  const theme = useTheme()

  const toggleConnectModal = useToggleConnectModal()
  const connectHydra = useConnectHydra()

  const connectWallet = useCallback(() => {
    toggleConnectModal()
    connectHydra()
  }, [toggleConnectModal, connectHydra])

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [showDetailed, setShowDetailed] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE)

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  }

  const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(new Percent('1'))

  // allowance handling
  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], V2_ROUTER_ADDRESSES[chainId])

  async function onAttemptToApprove() {
    // const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)
    if (!pair) throw new Error('missing dependencies')
    try {
      await approveCallback()
    } catch (error) {
      console.error(error)
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      return _onUserInput(field, typedValue)
    },
    [_onUserInput]
  )

  const onLiquidityInput = useCallback(
    (typedValue: string): void => onUserInput(Field.LIQUIDITY, typedValue),
    [onUserInput]
  )
  const onCurrencyAInput = useCallback(
    (typedValue: string): void => onUserInput(Field.CURRENCY_A, typedValue),
    [onUserInput]
  )
  const onCurrencyBInput = useCallback(
    (typedValue: string): void => onUserInput(Field.CURRENCY_B, typedValue),
    [onUserInput]
  )

  // tx sending
  const addTransaction = useTransactionAdder()

  async function onRemove() {
    const router = getContract(hydraweb3RPC, V2_ROUTER_ADDRESSES[chainId], AbiHydraV2Router01)

    if (!chainId || !account?.address || !router) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    }

    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsHYDRA = currencyB.isNative
    const oneCurrencyIsHYDRA = currencyA.isNative || currencyBIsHYDRA

    if (!tokenA || !tokenB) throw new Error('could not wrap')

    // we have approval, use normal remove liquidity
    let tx
    setAttemptingTxn(true)
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityHYDRA
      if (oneCurrencyIsHYDRA) {
        tx = await removeLiquidityHYDRA(
          router,
          currencyBIsHYDRA ? tokenA : tokenB,
          account,
          liquidityAmount.quotient.toString()
        )
      } else {
        // removeLiquidity
        tx = await removeLiquidity(
          router,
          tokenA,
          tokenB,
          account,
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          liquidityAmount.quotient.toString()
        )
      }
    }

    setAttemptingTxn(false)
    if (walletErrorCatch(tx)) {
      return
    }
    tx.hash = tx.id
    setTxHash(tx.id)
    addTransaction(tx, {
      type: TransactionType.REMOVE_LIQUIDITY_V3,
      baseCurrencyId: currencyId(currencyA),
      quoteCurrencyId: currencyId(currencyB),
      expectedAmountBaseRaw: parsedAmounts[Field.CURRENCY_A]?.quotient.toString() ?? '0',
      expectedAmountQuoteRaw: parsedAmounts[Field.CURRENCY_B]?.quotient.toString() ?? '0',
    })
  }

  function modalHeader() {
    return (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        <RowBetween align="flex-end">
          <Text fontSize={24} fontWeight={500}>
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          </Text>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyA} size={'24px'} />
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {currencyA?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <Plus size="16" color={theme.deprecated_text2} />
        </RowFixed>
        <RowBetween align="flex-end">
          <Text fontSize={24} fontWeight={500}>
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
          </Text>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyB} size={'24px'} />
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {currencyB?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>

        <ThemedText.DeprecatedItalic
          fontSize={12}
          color={theme.deprecated_text2}
          textAlign="left"
          padding={'12px 0 0 0'}
        >
          <Trans>
            Output is estimated. If the price changes by more than {allowedSlippage.toSignificant(4)}% your transaction
            will revert.
          </Trans>
        </ThemedText.DeprecatedItalic>
      </AutoColumn>
    )
  }

  function modalBottom() {
    return (
      <>
        <RowBetween>
          <Text color={theme.deprecated_text2} fontWeight={500} fontSize={16}>
            <Trans>
              HYD {currencyA?.symbol}/{currencyB?.symbol} Burned
            </Trans>
          </Text>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin={true} />
            <Text fontWeight={500} fontSize={16}>
              {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
            </Text>
          </RowFixed>
        </RowBetween>
        {pair && (
          <>
            <RowBetween>
              <Text color={theme.deprecated_text2} fontWeight={500} fontSize={16}>
                <Trans>Price</Trans>
              </Text>
              <Text fontWeight={500} fontSize={16} color={theme.deprecated_text1}>
                1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
              </Text>
            </RowBetween>
            <RowBetween>
              <div />
              <Text fontWeight={500} fontSize={16} color={theme.deprecated_text1}>
                1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
              </Text>
            </RowBetween>
          </>
        )}
        <ButtonPrimary disabled={!(approval === ApprovalState.APPROVED)} onClick={onRemove}>
          <Text fontWeight={500} fontSize={20}>
            <Trans>Confirm</Trans>
          </Text>
        </ButtonPrimary>
      </>
    )
  }

  const pendingText = (
    <Trans>
      Removing {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} {currencyA?.symbol} and{' '}
      {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} {currencyB?.symbol}
    </Trans>
  )

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput]
  )

  const oneCurrencyIsHYDRA = currencyA?.isNative || currencyB?.isNative

  const oneCurrencyIsWHYDRA = Boolean(
    chainId &&
      WRAPPED_NATIVE_CURRENCY[chainId] &&
      ((currencyA && WRAPPED_NATIVE_CURRENCY[chainId]?.equals(currencyA)) ||
        (currencyB && WRAPPED_NATIVE_CURRENCY[chainId]?.equals(currencyB)))
  )

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      if (currencyIdB && currencyId(currency) === currencyIdB) {
        navigate(`/remove/v2/${currencyId(currency)}/${currencyIdA}`)
      } else {
        navigate(`/remove/v2/${currencyId(currency)}/${currencyIdB}`)
      }
    },
    [currencyIdA, currencyIdB, navigate]
  )
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        navigate(`/remove/v2/${currencyIdB}/${currencyId(currency)}`)
      } else {
        navigate(`/remove/v2/${currencyIdA}/${currencyId(currency)}`)
      }
    },
    [currencyIdA, currencyIdB, navigate]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setAttemptingTxn(false)

    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
    setTxHash('')
  }, [onUserInput, txHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback
  )

  return (
    <>
      <AppBody>
        <AddRemoveTabs creating={false} adding={false} defaultSlippage={DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE} />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash ? txHash : ''}
            content={() => (
              <ConfirmationModalContent
                title={<Trans>You will receive</Trans>}
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
          />
          <AutoColumn gap="md">
            <BlueCard>
              <AutoColumn gap="10px">
                <ThemedText.DeprecatedLink fontWeight={400} color={'deprecated_primaryText1'}>
                  <Trans>
                    <b>Tip:</b> Removing pool tokens converts your position back into underlying tokens at the current
                    rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.
                  </Trans>
                </ThemedText.DeprecatedLink>
              </AutoColumn>
            </BlueCard>
            <LightCard>
              <AutoColumn gap="20px">
                <RowBetween>
                  <Text fontWeight={500}>
                    <Trans>Remove Amount</Trans>
                  </Text>
                  <ClickableText
                    fontWeight={500}
                    onClick={() => {
                      setShowDetailed(!showDetailed)
                    }}
                  >
                    {showDetailed ? <Trans>Simple</Trans> : <Trans>Detailed</Trans>}
                  </ClickableText>
                </RowBetween>
                <Row style={{ alignItems: 'flex-end' }}>
                  <Text fontSize={72} fontWeight={500}>
                    {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
                  </Text>
                </Row>
                {!showDetailed && (
                  <>
                    <Slider value={innerLiquidityPercentage} onChange={setInnerLiquidityPercentage} />
                    <RowBetween>
                      <MaxButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')} width="20%">
                        25%
                      </MaxButton>
                      <MaxButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')} width="20%">
                        50%
                      </MaxButton>
                      <MaxButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '75')} width="20%">
                        75%
                      </MaxButton>
                      <MaxButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')} width="20%">
                        Max
                      </MaxButton>
                    </RowBetween>
                  </>
                )}
              </AutoColumn>
            </LightCard>
            {!showDetailed && (
              <>
                <ColumnCenter>
                  <ArrowDown size="16" color={theme.deprecated_text2} />
                </ColumnCenter>
                <LightCard>
                  <AutoColumn gap="10px">
                    <RowBetween>
                      <Text fontSize={24} fontWeight={500}>
                        {formattedAmounts[Field.CURRENCY_A] || '-'}
                      </Text>
                      <RowFixed>
                        <CurrencyLogo currency={currencyA} style={{ marginRight: '12px' }} />
                        <Text fontSize={24} fontWeight={500} id="remove-liquidity-tokena-symbol">
                          {currencyA?.symbol}
                        </Text>
                      </RowFixed>
                    </RowBetween>
                    <RowBetween>
                      <Text fontSize={24} fontWeight={500}>
                        {formattedAmounts[Field.CURRENCY_B] || '-'}
                      </Text>
                      <RowFixed>
                        <CurrencyLogo currency={currencyB} style={{ marginRight: '12px' }} />
                        <Text fontSize={24} fontWeight={500} id="remove-liquidity-tokenb-symbol">
                          {currencyB?.symbol}
                        </Text>
                      </RowFixed>
                    </RowBetween>
                    {chainId && (oneCurrencyIsWHYDRA || oneCurrencyIsHYDRA) ? (
                      <RowBetween style={{ justifyContent: 'flex-end' }}>
                        {oneCurrencyIsHYDRA ? (
                          <StyledInternalLink
                            to={`/remove/v2/${
                              currencyA?.isNative && chainId && WRAPPED_NATIVE_CURRENCY[chainId]
                                ? WRAPPED_NATIVE_CURRENCY[chainId]?.address
                                : currencyIdA
                            }/${
                              currencyB?.isNative && chainId && WRAPPED_NATIVE_CURRENCY[chainId]
                                ? WRAPPED_NATIVE_CURRENCY[chainId]?.address
                                : currencyIdB
                            }`}
                          >
                            Receive WHYDRA
                          </StyledInternalLink>
                        ) : oneCurrencyIsWHYDRA ? (
                          <StyledInternalLink
                            to={`/remove/v2/${
                              currencyA && WRAPPED_NATIVE_CURRENCY[chainId]?.equals(currencyA) ? 'HYDRA' : currencyIdA
                            }/${
                              currencyB && WRAPPED_NATIVE_CURRENCY[chainId]?.equals(currencyB) ? 'HYDRA' : currencyIdB
                            }`}
                          >
                            Receive HYDRA
                          </StyledInternalLink>
                        ) : null}
                      </RowBetween>
                    ) : null}
                  </AutoColumn>
                </LightCard>
              </>
            )}

            {showDetailed && (
              <>
                <CurrencyInputPanel
                  value={formattedAmounts[Field.LIQUIDITY]}
                  onUserInput={onLiquidityInput}
                  onMax={() => {
                    onUserInput(Field.LIQUIDITY_PERCENT, '100')
                  }}
                  showMaxButton={!atMaxAmount}
                  currency={pair?.liquidityToken}
                  pair={pair}
                  id="liquidity-amount"
                />
                <ColumnCenter>
                  <ArrowDown size="16" color={theme.deprecated_text2} />
                </ColumnCenter>
                <CurrencyInputPanel
                  hideBalance={true}
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onCurrencyAInput}
                  onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                  showMaxButton={!atMaxAmount}
                  currency={currencyA}
                  label={'Output'}
                  onCurrencySelect={handleSelectCurrencyA}
                  id="remove-liquidity-tokena"
                />
                <ColumnCenter>
                  <Plus size="16" color={theme.deprecated_text2} />
                </ColumnCenter>
                <CurrencyInputPanel
                  hideBalance={true}
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onUserInput={onCurrencyBInput}
                  onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                  showMaxButton={!atMaxAmount}
                  currency={currencyB}
                  label={'Output'}
                  onCurrencySelect={handleSelectCurrencyB}
                  id="remove-liquidity-tokenb"
                />
              </>
            )}
            {pair && (
              <div style={{ padding: '10px 20px' }}>
                <RowBetween>
                  <Trans>Price:</Trans>
                  <div>
                    1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
                  </div>
                </RowBetween>
                <RowBetween>
                  <div />
                  <div>
                    1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
                  </div>
                </RowBetween>
              </div>
            )}
            <div style={{ position: 'relative' }}>
              {!account?.address ? (
                <TraceEvent
                  events={[Event.onClick]}
                  name={EventName.CONNECT_WALLET_BUTTON_CLICKED}
                  properties={{ received_swap_quote: false }}
                  element={ElementName.CONNECT_WALLET_BUTTON}
                >
                  <ButtonLight onClick={connectWallet}>
                    <Trans>Connect Wallet</Trans>
                  </ButtonLight>
                </TraceEvent>
              ) : (
                <RowBetween>
                  <ButtonConfirmed
                    onClick={onAttemptToApprove}
                    confirmed={approval === ApprovalState.APPROVED}
                    disabled={approval !== ApprovalState.NOT_APPROVED}
                    mr="0.5rem"
                    fontWeight={500}
                    fontSize={16}
                  >
                    {approval === ApprovalState.PENDING ? (
                      <Dots>
                        <Trans>Approving</Trans>
                      </Dots>
                    ) : approval === ApprovalState.APPROVED ? (
                      <Trans>Approved</Trans>
                    ) : (
                      <Trans>Approve</Trans>
                    )}
                  </ButtonConfirmed>
                  <ButtonError
                    onClick={() => {
                      setShowConfirm(true)
                    }}
                    disabled={!isValid || approval !== ApprovalState.APPROVED}
                    error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                  >
                    <Text fontSize={16} fontWeight={500}>
                      {error || <Trans>Remove</Trans>}
                    </Text>
                  </ButtonError>
                </RowBetween>
              )}
            </div>
          </AutoColumn>
        </Wrapper>
      </AppBody>

      {pair ? (
        <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWHYDRA} pair={pair} />
        </AutoColumn>
      ) : null}
    </>
  )
}
