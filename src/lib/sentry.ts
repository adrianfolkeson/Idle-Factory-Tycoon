// Sentry crash reporting
// 1. Create account at sentry.io → New Project → React Native
// 2. Copy DSN from project settings → paste below
// 3. Add back "@sentry/react-native" to app.json plugins
// 4. Run: npx expo prebuild --clean

const SENTRY_DSN = '' // paste your DSN here e.g. 'https://xxx@sentry.io/yyy'

let initialized = false

export async function initSentry() {
  if (!SENTRY_DSN || initialized) return
  try {
    const Sentry = await import('@sentry/react-native')
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 0.2,        // 20% of transactions traced
      environment: __DEV__ ? 'development' : 'production',
    })
    initialized = true
  } catch { /* package not configured yet */ }
}

export async function captureError(error: Error, context?: Record<string, unknown>) {
  if (!initialized) return
  try {
    const Sentry = await import('@sentry/react-native')
    Sentry.captureException(error, { extra: context })
  } catch {}
}

export async function setUserContext(worldId: number, prestige: number) {
  if (!initialized) return
  try {
    const Sentry = await import('@sentry/react-native')
    Sentry.setContext('game', { worldId, prestige })
  } catch {}
}
