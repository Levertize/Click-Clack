import type { Particle } from './types'

class BurstParticle implements Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life = 1.0
  decay: number

  constructor(x: number, y: number, speedFactor: number, color: string) {
    this.x = x
    this.y = y
    const angle = Math.random() * Math.PI * 2
    const velocity = (Math.random() * 3 + 1) * speedFactor
    this.vx = Math.cos(angle) * velocity
    this.vy = Math.sin(angle) * velocity
    this.size = Math.random() * 3.5 + 1.5
    this.color = color
    this.decay = 0.022
  }

  update(): void {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.06 // Gravity
    this.life -= this.decay
    if (this.life < 0) this.life = 0
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const currentSize = this.size * this.life
    if (currentSize <= 0) return

    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.life
    ctx.fill()
    ctx.restore()
  }
}

export function spawnParticles(
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
    particles.push(new BurstParticle(x, y, speedFactor, color))
  }
  return particles
}
