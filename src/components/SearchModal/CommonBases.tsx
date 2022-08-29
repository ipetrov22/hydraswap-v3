import { Currency } from '@uniswap/sdk-core'
import { AutoColumn } from 'components/Column'
import CurrencyLogo from 'components/CurrencyLogo'
import { AutoRow } from 'components/Row'
import { COMMON_BASES } from 'constants/routing'
import { RedesignVariant, useRedesignFlag } from 'featureFlags/flags/redesign'
import { useTokenInfoFromActiveList } from 'hooks/useTokenInfoFromActiveList'
import { HYDRA } from 'hydra/sdk'
import { Text } from 'rebass'
import styled from 'styled-components/macro'
import { currencyId } from 'utils/currencyId'

const MobileWrapper = styled(AutoColumn)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const BaseWrapper = styled.div<{ disable?: boolean; redesignFlag?: boolean }>`
  border: 1px solid
    ${({ theme, disable, redesignFlag }) =>
      disable
        ? redesignFlag
          ? theme.accentAction
          : 'transparent'
        : redesignFlag
        ? theme.backgroundOutline
        : theme.deprecated_bg3};
  border-radius: ${({ redesignFlag }) => (redesignFlag ? '16px' : '10px')};
  display: flex;
  padding: 6px;
  padding-right: 12px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable, redesignFlag }) =>
      (redesignFlag && theme.hoverDefault) || (!disable && theme.deprecated_bg2)};
  }

  color: ${({ theme, disable, redesignFlag }) =>
    disable && (redesignFlag ? theme.accentAction : theme.deprecated_text3)};
  background-color: ${({ theme, disable, redesignFlag }) =>
    disable && (redesignFlag ? theme.accentActionSoft : theme.deprecated_bg3)};
  filter: ${({ disable, redesignFlag }) => disable && !redesignFlag && 'grayscale(1)'};
`

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: number
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  const bases = typeof chainId !== 'undefined' ? COMMON_BASES[chainId] ?? [] : []
  const redesignFlag = useRedesignFlag()
  const redesignFlagEnabled = redesignFlag === RedesignVariant.Enabled

  return bases.length > 0 ? (
    <MobileWrapper gap="md">
      <AutoRow gap="4px">
        {[HYDRA, ...bases].map((currency: Currency) => {
          const isSelected = selectedCurrency?.equals(currency)

          return (
            <BaseWrapper
              tabIndex={0}
              onKeyPress={(e) => !isSelected && e.key === 'Enter' && onSelect(currency)}
              onClick={() => !isSelected && onSelect(currency)}
              disable={isSelected}
              redesignFlag={redesignFlagEnabled}
              key={currencyId(currency)}
            >
              <CurrencyLogoFromList currency={currency} />
              <Text fontWeight={500} fontSize={16}>
                {currency.symbol}
              </Text>
            </BaseWrapper>
          )
        })}
      </AutoRow>
    </MobileWrapper>
  ) : null
}

/** helper component to retrieve a base currency from the active token lists */
function CurrencyLogoFromList({ currency }: { currency: Currency }) {
  const token = useTokenInfoFromActiveList(currency)

  return <CurrencyLogo currency={token} style={{ marginRight: 8 }} />
}
