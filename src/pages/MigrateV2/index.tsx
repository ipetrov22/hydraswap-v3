import { Trans } from '@lingui/macro'
import MigrateV2PositionCard from 'components/PositionCard/V2'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { useHydraChainId, useHydraWalletAddress } from 'hooks/useAddHydraAccExtension'
import { PairState, useV2Pairs } from 'hooks/useV2Pairs'
import { Pair } from 'hydra-v2-sdk'
import { usePairBalancesWithLoadingIndicator } from 'lib/hooks/useCurrencyBalance'
import { ReactNode, useMemo } from 'react'
import { Text } from 'rebass'
import { useTheme } from 'styled-components/macro'

import { LightCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import QuestionHelper from '../../components/QuestionHelper'
import { AutoRow } from '../../components/Row'
import { Dots } from '../../components/swap/styleds'
import { V2_FACTORY_ADDRESSES } from '../../constants/addresses'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { BackArrow, StyledInternalLink, ThemedText } from '../../theme'
import { BodyWrapper } from '../AppBody'

function EmptyState({ message }: { message: ReactNode }) {
  return (
    <AutoColumn style={{ minHeight: 200, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText.DeprecatedBody>{message}</ThemedText.DeprecatedBody>
    </AutoColumn>
  )
}

export default function MigrateV2() {
  const theme = useTheme()
  const [account] = useHydraWalletAddress()
  const [chainId] = useHydraChainId()

  const v2FactoryAddress = chainId ? V2_FACTORY_ADDRESSES[chainId] : undefined

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  // calculate v2 + sushi pair contract addresses for all token pairs
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => {
        return {
          v2liquidityToken: v2FactoryAddress ? toV2LiquidityToken(tokens) : undefined,
          tokens,
        }
      }),
    [trackedTokenPairs, v2FactoryAddress]
  )

  //  get pair liquidity token addresses for balance-fetching purposes
  const allLiquidityTokens = useMemo(() => {
    const v2 = tokenPairsWithLiquidityTokens.map(({ v2liquidityToken }) => v2liquidityToken)
    return [...v2]
  }, [tokenPairsWithLiquidityTokens])

  // fetch pair balances
  const [pairBalances, fetchingPairBalances] = usePairBalancesWithLoadingIndicator(
    account ?? undefined,
    allLiquidityTokens
  )

  // filter for v2 liquidity tokens that the user has a balance in
  const tokenPairsWithV2Balance = useMemo(() => {
    if (fetchingPairBalances) return []

    return tokenPairsWithLiquidityTokens
      .filter(({ v2liquidityToken }) => v2liquidityToken && pairBalances[v2liquidityToken.address]?.greaterThan(0))
      .map((tokenPairsWithLiquidityTokens) => tokenPairsWithLiquidityTokens.tokens)
  }, [fetchingPairBalances, tokenPairsWithLiquidityTokens, pairBalances])

  const v2Pairs = useV2Pairs(tokenPairsWithV2Balance)
  const v2IsLoading = fetchingPairBalances || v2Pairs.some(([pairState]) => pairState === PairState.LOADING)

  return (
    <>
      <BodyWrapper style={{ padding: 24 }}>
        <AutoColumn gap="16px">
          <AutoRow style={{ alignItems: 'center', justifyContent: 'space-between' }} gap="8px">
            <BackArrow to="/pool/v2" />
            <ThemedText.DeprecatedMediumHeader>
              <Trans>Migrate V2 Liquidity</Trans>
            </ThemedText.DeprecatedMediumHeader>
            <div>
              <QuestionHelper text={<Trans>Migrate your liquidity tokens from Hydraswap V2 to Hydraswap V3.</Trans>} />
            </div>
          </AutoRow>

          <ThemedText.DeprecatedBody style={{ marginBottom: 8, fontWeight: 400 }}>
            <Trans>
              For each pool shown below, click migrate to remove your liquidity from Hydraswap V2 and deposit it into
              Hydraswap V3.
            </Trans>
          </ThemedText.DeprecatedBody>

          {!account ? (
            <LightCard padding="40px">
              <ThemedText.DeprecatedBody color={theme.deprecated_text3} textAlign="center">
                <Trans>Connect to a wallet to view your V2 liquidity.</Trans>
              </ThemedText.DeprecatedBody>
            </LightCard>
          ) : v2IsLoading ? (
            <LightCard padding="40px">
              <ThemedText.DeprecatedBody color={theme.deprecated_text3} textAlign="center">
                <Dots>
                  <Trans>Loading</Trans>
                </Dots>
              </ThemedText.DeprecatedBody>
            </LightCard>
          ) : v2Pairs.filter(([, pair]) => !!pair).length > 0 ? (
            <>
              {v2Pairs
                .filter(([, pair]) => !!pair)
                .map(([, pair]) => (
                  <MigrateV2PositionCard key={(pair as Pair).liquidityToken.address} pair={pair as Pair} />
                ))}
            </>
          ) : (
            <EmptyState message={<Trans>No V2 Liquidity found.</Trans>} />
          )}

          <AutoColumn justify={'center'} gap="md">
            <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
              <Trans>
                Don’t see one of your v2 positions?{' '}
                <StyledInternalLink id="import-pool-link" to={'/find?origin=/migrate/v2'}>
                  Import it.
                </StyledInternalLink>
              </Trans>
            </Text>
          </AutoColumn>
        </AutoColumn>
      </BodyWrapper>
      <SwitchLocaleLink />
    </>
  )
}
