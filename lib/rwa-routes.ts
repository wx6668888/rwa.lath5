export type RwaScreen =
  | 'home' | 'invest' | 'portfolio' | 'wallet' | 'ai' | 'profile'
  | 'rwa-detail' | 'compute-detail' | 'stock-detail' | 'prediction-detail'
  | 'order-review' | 'order-success'
  | 'deposit' | 'withdraw' | 'transfer' | 'activity' | 'asset-detail' | 'position-detail'
  | 'ai-plan' | 'notifications' | 'kyc' | 'security' | 'referral' | 'records' | 'support' | 'settings'

const screenPaths: Record<RwaScreen, string> = {
  home: '/home',
  invest: '/invest',
  portfolio: '/portfolio',
  wallet: '/wallet',
  ai: '/ai',
  profile: '/profile',
  'rwa-detail': '/invest/rwa',
  'compute-detail': '/invest/compute',
  'stock-detail': '/invest/stocks',
  'prediction-detail': '/invest/prediction',
  'order-review': '/orders/review',
  'order-success': '/orders/success',
  deposit: '/wallet/deposit',
  withdraw: '/wallet/withdraw',
  transfer: '/wallet/transfer',
  activity: '/activity',
  'asset-detail': '/wallet/usdt',
  'position-detail': '/portfolio/positions',
  'ai-plan': '/ai/plan',
  notifications: '/notifications',
  kyc: '/profile/kyc',
  security: '/profile/security',
  referral: '/profile/referral',
  records: '/profile/records',
  support: '/profile/support',
  settings: '/profile/settings',
}

const pathScreens = new Map(Object.entries(screenPaths).map(([screen, path]) => [path, screen as RwaScreen]))

export function pathForScreen(screen: RwaScreen) {
  return screenPaths[screen]
}

export function screenForSegments(segments: string[] = []): RwaScreen | null {
  if (segments.length === 0) return 'home'
  return pathScreens.get(`/${segments.join('/')}`) ?? null
}
