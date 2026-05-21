import type { Particle } from './types'

class InkParticle implements Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  sx: number
  sy: number
  color: string
  life = 1.0
  decay = 0.016

  constructor(x: number, y: number, speedFactor: number, color: string) {
    this.x = x
    this.y = y
    
    // Spread velocity
    const angle = Math.random() * Math.PI * 2
    const velocity = (Math.random() * 3 + 1) * speedFactor
    this.vx = Math.cos(angle) * velocity
    this.vy = Math.sin(angle) * velocity
    
    this.size = Math.random() * 8 + 6 // larger organic blobs
    this.sx = Math.random() * 1.8 + 0.4
    this.sy = Math.random() * 1.8 + 0.4
    this.color = color
  }

  update(): void {
    this.x += this.vx
    this.y += this.vy
    this.vx *= 0.84 // High friction
    this.vy *= 0.84 // High friction
    
    this.life -= this.decay
    if (this.life < 0) this.life = 0
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.life <= 0) return

    ctx.save()
    // Translate to local coordinates to scale from center
    ctx.translate(this.x, this.y)
    ctx.scale(this.sx, this.sy)
    
    ctx.beginPath()
    ctx.arc(0, 0, this.size * this.life, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.life * 0.75
    ctx.fill()
    
    ctx.restore()
  }
}

export function spawnInk(
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
    particles.push(new InkParticle(x, y, speedFactor, color))
  }
  return particles
}
