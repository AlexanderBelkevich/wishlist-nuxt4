import type { H3Event } from 'h3'
import { randomBytes } from 'node:crypto'

const COOKIE_NAME = 'guest-token'

export function getGuestToken(event: H3Event) {
  return getCookie(event, COOKIE_NAME)
}

export function ensureGuestToken(event: H3Event) {
  const existing = getGuestToken(event)
  if (existing) return existing

  const token = randomBytes(16).toString('base64url')
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })
  return token
}
