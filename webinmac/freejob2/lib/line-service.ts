/**
 * LINE Service - Service Layer Pattern
 *
 * Handles LINE connect / messaging logic. Mock only; no real API keys.
 *
 * SERVICE LAYER PATTERN:
 * - UI/Context call this service only (no direct fetch/localStorage for LINE).
 * - Mock logic marked with [MOCK-ONLY]. Replace with Supabase/LINE API when integrating backend.
 */

const MOCK_DELAY_CONNECT_MS = 1500
const MOCK_DELAY_SEND_MS = 1000

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Mock connect LINE account.
 * [MOCK-ONLY]
 * [TODO] Replace with Supabase/LINE API (e.g. LINE Login, store userId/tokens).
 */
export function mockConnectLine(): Promise<{ displayName: string; pictureUrl: string }> {
  return (async () => {
    await delay(MOCK_DELAY_CONNECT_MS)
    return {
      displayName: 'Freelancer LINE',
      pictureUrl: 'https://placehold.co/96x96/06C755/FFFFFF?text=L',
    }
  })()
}

/**
 * Mock send message (to admin).
 * [MOCK-ONLY]
 * [TODO] Replace with Supabase/LINE API or webhook to LINE Messaging API.
 */
export function mockSendMessage(_text: string): Promise<void> {
  return delay(MOCK_DELAY_SEND_MS)
}
