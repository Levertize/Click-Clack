import type { Effect } from '../store/settings'
import { type Theme, pickAccent } from '../themes'
import type { Particle } from './types'
import { spawnParticles } from './particles'
import { spawnExplode } from './explode'
import { spawnRipple } from './ripple'
import { spawnSparks } from './sparks'
import { spawnConstellation } from './constellation'
import { spawnTrail } from './trail'
import { spawnInk } from './ink'
import { spawnFire } from './fire'

export function spawnEffect(
  effect: Effect,
  x: number,
  y: number,
  opts: { intensity: number; speed: number; theme: Theme; isSpace?: boolean }
): Particle[] {
  const { intensity, speed, theme, isSpace = false } = opts
  const speedMultiplier = isSpace ? 1.5 : 1.0
  const speedVal = speed * speedMultiplier

  // Generate dynamic accents using pickAccent (Vivid theme gets HSL color cycle)
  const getAccentsList = (count: number): string[] => {
    const list: string[] = []
    for (let i = 0; i < count; i++) {
      list.push(pickAccent(theme))
    }
    return list
  }

  switch (effect) {
    case 'particles': {
      const count = Math.max(1, Math.round(intensity * 3))
      return spawnParticles(x, y, count, speedVal, getAccentsList(count))
    }
    case 'explode': {
      const count = Math.max(2, Math.round(intensity * 3))
      return spawnExplode(x, y, count, speedVal, getAccentsList(count))
    }
    case 'ripple': {
      // spawnRipple handles Math.ceil(intensity / 3) internally
      // ripple color is picked from accents
      const count = Math.ceil(intensity / 3)
      return spawnRipple(x, y, intensity, speedVal, getAccentsList(count))
    }
    case 'sparks': {
      const count = Math.max(1, Math.round(intensity * 3.5))
      return spawnSparks(x, y, count, speedVal, getAccentsList(count))
    }
    case 'constellation': {
      // spawnConstellation spawns count + 2 stars internally
      const count = Math.max(2, Math.round(intensity * 1.5))
      return spawnConstellation(x, y, count, speedVal, getAccentsList(count + 2))
    }
    case 'trail': {
      const count = Math.max(1, Math.round(intensity * 2.5))
      return spawnTrail(x, y, count, speedVal, getAccentsList(count))
    }
    case 'ink': {
      const count = Math.max(1, Math.round(intensity * 1.2))
      return spawnInk(x, y, count, speedVal, getAccentsList(count))
    }
    case 'fire': {
      const count = Math.max(1, Math.round(intensity * 4))
      // fire.ts uses theme.fireColors, not standard theme accents
      return spawnFire(x, y, count, speedVal, theme.fireColors)
    }
    default:
      return []
  }
}
