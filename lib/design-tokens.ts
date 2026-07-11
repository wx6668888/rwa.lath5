export const designTokens = {
  color: {
    canvas: '#000000',
    ink: '#F5F7F8',
    muted: '#929AA6',
    faint: '#626A75',
    mint: '#2FE6BF',
    ice: '#C5E3F7',
    negative: '#FF627A',
    mediumRisk: '#7589FF',
    highRisk: '#FFAD3D',
  },
  space: {
    unit: 8,
    mobileGutter: 20,
    compactMobileGutter: 16,
    section: 24,
    sectionLarge: 32,
  },
  layout: {
    mobileMaxWidth: 430,
    minimumTouchTarget: 44,
  },
} as const

export type DesignTokens = typeof designTokens
