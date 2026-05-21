import type { Particle } from './types'

class SparkParticle implements Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  life = 1.0
  decay: number

  constructor(x: number, y: number, speedFactor: number, color: string) {
    this.x = x
    this.y = y
    const angle = Math.random() * Math.PI * 2
    const velocity = (Math.random() * 7 + 2) * speedFactor
    this.vx = Math.cos(angle) * velocity
    this.vy = Math.sin(angle) * velocity
    this.color = color
    this.decay = Math.random() * 0.015 + 0.015 // between 0.015 and 0.03
  }

  update(): void {
    this.x += this.vx
    this.y += this.vy
    this.vx *= 0.88 // Friction
    this.vy += 0.18 // Gravity
    this.life -= this.decay
    if (this.life < 0) this.life = 0
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.life <= 0) return

    ctx.save()
    ctx.beginPath()
    // Streak line: from current position to a point trailing behind it
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.x - this.vx * 2.5, this.y - this.vy * 2.5)
    ctx.strokeStyle = this.color
    ctx.lineWidth = Math.max(0.1, 1.5 * this.life)
    ctx.lineCap = 'round'
    ctx.globalAlpha = this.life
    ctx.stroke()
    ctx.restore()
  }
}

export function spawnSparks(
  x: number,
  y: number,
  count: number,
  speed: number,
  accents: string[]
): Particle[] {
  const particles: Particle[] = []
  const speedFactor = speed / 5
  for (let i = 0; i < count; i++) {
    const color = accents[Math.floor(Math.random() * accents.length)]
    particles.push(new SparkParticle(x, y, speedFactor, color))
  }
  return particles
}
