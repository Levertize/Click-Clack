import type { Particle } from './types'

let lastFrameTime = 0

class ConstellationParticle implements Particle {
  static stars: ConstellationParticle[] = []

  x: number
  y: number
  targetX: number
  targetY: number
  color: string
  life = 1.0
  decay = 0.01 // Longest living effect
  speedFactor: number

  constructor(x: number, y: number, speedFactor: number, color: string) {
    this.x = x
    this.y = y
    // Random target position in a radius around the caret
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * 120 + 30
    this.targetX = x + Math.cos(angle) * distance
    this.targetY = y + Math.sin(angle) * distance
    this.speedFactor = speedFactor
    this.color = color
  }

  update(): void {
    // Synchronously clear the static list at the start of each frame tick
    const now = performance.now()
    if (Math.abs(now - lastFrameTime) > 2) {
      lastFrameTime = now
      ConstellationParticle.stars = []
    }
    
    // Lerp toward target position
    this.x += (this.targetX - this.x) * 0.05 * this.speedFactor
    this.y += (this.targetY - this.y) * 0.05 * this.speedFactor

    this.life -= this.decay
    if (this.life < 0) this.life = 0

    if (this.life > 0) {
      ConstellationParticle.stars.push(this)
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.life <= 0) return

    ctx.save()

    // Draw 2px dot at the star position
    ctx.beginPath()
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.life
    ctx.fill()

    // Draw thin lines to other stars closer than 110px
    const stars = ConstellationParticle.stars
    for (let i = 0; i < stars.length; i++) {
      const other = stars[i]
      if (other === this) continue

      const dx = other.x - this.x
      const dy = other.y - this.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 110) {
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(other.x, other.y)
        ctx.strokeStyle = this.color
        ctx.lineWidth = 0.5
        // alpha = life * (1 - dist/110) * 0.5
        const lineAlpha = this.life * (1.0 - dist / 110) * 0.5
        ctx.globalAlpha = lineAlpha
        ctx.stroke()
      }
    }

    ctx.restore()
  }
}

export function spawnConstellation(
  x: number,
  y: number,
  count: number,
  speed: number,
  accents: string[]
): Particle[] {
  const particles: Particle[] = []
  const speedFactor = speed / 5
  const starsCount = count + 2 // Spawn count + 2 star points
  for (let i = 0; i < starsCount; i++) {
    const color = accents[Math.floor(Math.random() * accents.length)]
    particles.push(new ConstellationParticle(x, y, speedFactor, color))
  }
  return particles
}
