import type { Particle } from './types'

class TrailParticle implements Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life = 1.0
  decay = 0.014

  constructor(x: number, y: number, speedFactor: number, color: string) {
    // Start near caret with minor offset
    this.x = x + (Math.random() - 0.5) * 10
    this.y = y + (Math.random() - 0.5) * 10
    
    this.vy = -(Math.random() * 1.6 + 0.4) * speedFactor
    this.vx = (Math.random() - 0.5) * 0.6 * speedFactor
    this.size = Math.random() * 3 + 2
    this.color = color
  }

  update(): void {
    this.x += this.vx
    this.y += this.vy
    
    // Slight horizontal wobble
    this.vx += (Math.random() - 0.5) * 0.1
    
    this.life -= this.decay
    if (this.life < 0) this.life = 0
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.life <= 0) return

    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.life * 0.7 // slightly softer
    ctx.fill()
    ctx.restore()
  }
}

export function spawnTrail(
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
    particles.push(new TrailParticle(x, y, speedFactor, color))
  }
  return particles
}
