import Row from 'components/Row'
import { RedesignVariant, useRedesignFlag } from 'featureFlags/flags/redesign'
import React from 'react'
import styled from 'styled-components/macro'
import { HideSmall, Z_INDEX } from 'theme'

import HydraGuard from '../assets/images/hydra-guard.png'

export const BodyWrapper = styled.main<{ margin?: string; maxWidth?: string; redesignFlag?: boolean }>`
  position: relative;
  margin-top: ${({ margin }) => margin ?? '0px'};
  max-width: ${({ maxWidth, redesignFlag }) => maxWidth ?? (redesignFlag ? '420px' : '480px')};
  width: 100%;
  background: ${({ theme, redesignFlag }) => (redesignFlag ? theme.backgroundSurface : theme.deprecated_bg0)};
  border-radius: ${({ redesignFlag }) => (redesignFlag ? '16px' : '24px')};
  border: 1px solid ${({ theme, redesignFlag }) => (redesignFlag ? theme.backgroundOutline : 'transparent')};
  margin-top: 1rem;
  z-index: ${Z_INDEX.deprecated_content};
  font-feature-settings: ${({ redesignFlag }) => redesignFlag && "'ss02' off"};
  box-shadow: ${({ redesignFlag }) =>
    !redesignFlag &&
    '0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01)'};
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, ...rest }: { children: React.ReactNode }) {
  const redesignFlag = useRedesignFlag()
  const redesignFlagEnabled = redesignFlag === RedesignVariant.Enabled
  return (
    <Row justify="center" align="center">
      <HideSmall>
        <img
          alt="hydra"
          width={200}
          style={{ transform: 'scaleX(-1)', opacity: 0.15, marginRight: -45, marginTop: -40 }}
          src={HydraGuard}
        />
      </HideSmall>
      <BodyWrapper {...rest} redesignFlag={redesignFlagEnabled}>
        {children}
      </BodyWrapper>
      <HideSmall>
        <img alt="hydra" style={{ opacity: 0.15, marginLeft: -45, marginTop: -40 }} width={200} src={HydraGuard} />
      </HideSmall>
    </Row>
  )
}
