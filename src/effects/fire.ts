import type { Particle } from './types'

class FireParticle implements Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life = 1.0
  decay = 0.019

  constructor(x: number, y: number, speedFactor: number, fireColors: string[]) {
    // Spawn within +/- 11px horizontal of caret, and +/- 4px vertical
    this.x = x + (Math.random() - 0.5) * 22
    this.y = y + (Math.random() - 0.5) * 8
    
    this.vx = (Math.random() - 0.5) * 0.5 * speedFactor
    this.vy = -(Math.random() * 3.5 + 0.8) * speedFactor
    this.size = Math.random() * 6 + 4
    
    // Choose a color from fireColors
    this.color = fireColors[Math.floor(Math.random() * fireColors.length)]
  }

  update(): void {
    this.x += this.vx
    this.y += this.vy
    
    // Horizontal wobble: vx += (random - 0.5) * 0.25
    this.vx += (Math.random() - 0.5) * 0.25
    // Apply speed dampening to horizontal drift to keep fire shape
    this.vx *= 0.95
    
    this.life -= this.decay
    if (this.life < 0) this.life = 0
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.life <= 0) return

    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.life
    
    // Fire blend mode for rich glow
    ctx.globalCompositeOperation = 'screen'
    ctx.fill()
    ctx.restore()
  }
}

export function spawnFire(
  x: number,
  y: number,
  count: number,
  speed: number,
  fireColors: string[]
): Particle[] {
  const particles: Particle[] = []
  const speedFactor = speed / 5
  for (let i = 0; i < count; i++) {
    particles.push(new FireParticle(x, y, speedFactor, fireColors))
  }
  return particles
}
