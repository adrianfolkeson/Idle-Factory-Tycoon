// Lightweight analytics — replace ENDPOINT with PostHog/Amplitude/custom
// PostHog: https://posthog.com (free tier, no native SDK needed)
// Set POSTHOG_KEY in your env or replace with your provider's HTTP API

const ENDPOINT = '' // e.g. 'https://app.posthog.com/capture/'
const API_KEY  = '' // your PostHog project API key

const queue: object[] = []
let sessionId = `s_${Date.now()}`
let enabled   = !!ENDPOINT && !!API_KEY

async function flush() {
  if (!enabled || queue.length === 0) return
  const batch = queue.splice(0, queue.length)
  try {
    await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: API_KEY,
        batch: batch.map(e => ({ ...e, timestamp: new Date().toISOString() })),
      }),
    })
  } catch { /* fail silently */ }
}

function track(event: string, props?: Record<string, unknown>) {
  if (!enabled) return
  queue.push({ event, properties: { session_id: sessionId, ...props } })
  if (queue.length >= 5) flush()
}

// ── Public API ────────────────────────────────────────────────────────────────
export const analytics = {
  sessionStart:   (worldId: number) => track('session_start', { world_id: worldId }),
  tap:            () => track('tap'),
  upgradeBought:  (upgradeId: string, world: number, cost: number) =>
                    track('upgrade_bought', { upgrade_id: upgradeId, world, cost }),
  worldUnlocked:  (worldId: number) => track('world_unlocked', { world_id: worldId }),
  prestiged:      (count: number, multiplier: number) =>
                    track('prestige', { count, multiplier }),
  adWatched:      () => track('ad_watched'),
  adSkipped:      () => track('ad_skipped'),
  iapPurchased:   (product: string) => track('iap_purchased', { product }),
  milestoneHit:   (rate: number) => track('milestone_hit', { rate }),
  comboActivated: () => track('combo_activated'),
  flush,
}
