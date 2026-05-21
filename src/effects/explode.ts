import type { Particle } from './types'

class ExplodeParticle implements Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life = 1.0
  decay = 0.02
  ringRadius = 0
  maxRingRadius: number

  constructor(x: number, y: number, angle: number, speedFactor: number, color: string) {
    this.x = x
    this.y = y
    const velocity = (Math.random() * 4 + 2) * speedFactor
    this.vx = Math.cos(angle) * velocity
    this.vy = Math.sin(angle) * velocity
    this.size = Math.random() * 2 + 2
    this.color = color
    this.maxRingRadius = (Math.random() * 25 + 15) * speedFactor
  }

  update(): void {
    this.x += this.vx
    this.y += this.vy
    this.vx *= 0.92 // Friction
    this.vy *= 0.92 // Friction
    this.ringRadius += (this.maxRingRadius - this.ringRadius) * 0.1
    this.life -= this.decay
    if (this.life < 0) this.life = 0
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.life <= 0) return

    ctx.save()
    
    // Draw center particle
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.life
    ctx.fill()

    // Draw expanding ghost ring
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.ringRadius, 0, Math.PI * 2)
    ctx.strokeStyle = this.color
    ctx.lineWidth = 1
    ctx.globalAlpha = this.life * 0.25
    ctx.stroke()

    ctx.restore()
  }
}

export function spawnExplode(
  x: number,
  y: number,
  count: number,
  speed: number,
  accents: string[]
): Particle[] {
  const particles: Particle[] = []
  const speedFactor = speed / 5
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const color = accents[Math.floor(Math.random() * accents.length)]
    particles.push(new ExplodeParticle(x, y, angle, speedFactor, color))
  }
  return particles
}
