import type { Particle } from './types'

class RippleParticle implements Particle {
  x: number
  y: number
  life = 1.0
  decay = 0.018
  radius = 0
  maxRadius: number
  color: string
  delayMs: number
  speedFactor: number

  constructor(x: number, y: number, delayMs: number, intensity: number, speedFactor: number, color: string) {
    this.x = x
    this.y = y
    this.delayMs = delayMs
    this.maxRadius = 50 + intensity * 9
    this.speedFactor = speedFactor
    this.color = color
  }

  update(): void {
    if (this.delayMs > 0) {
      this.delayMs -= 16.7 // approximate frame duration in ms
      return
    }

    // Expand radius
    this.radius += (this.maxRadius - this.radius) * 0.08 * this.speedFactor
    if (this.radius > this.maxRadius) this.radius = this.maxRadius

    this.life -= this.decay
    if (this.life < 0) this.life = 0
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.delayMs > 0 || this.life <= 0) return

    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.strokeStyle = this.color
    ctx.lineWidth = Math.max(0.1, 1.5 * this.life)
    ctx.globalAlpha = this.life
    ctx.stroke()
    ctx.restore()
  }
}

export function spawnRipple(
  x: number,
  y: number,
  intensity: number,
  speed: number,
  accents: string[]
): Particle[] {
  const count = Math.ceil(intensity / 3)
  const particles: Particle[] = []
  const speedFactor = speed / 5

  for (let i = 0; i < count; i++) {
    const color = accents[Math.floor(Math.random() * accents.length)]
    const delay = i * 80 // 80ms delay per ring
    particles.push(new RippleParticle(x, y, delay, intensity, speedFactor, color))
  }

  return particles
}
