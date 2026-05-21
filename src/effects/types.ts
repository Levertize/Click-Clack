export interface Particle {
  x: number
  y: number
  life: number            // 1.0 → 0.0
  update(): void
  draw(ctx: CanvasRenderingContext2D): void
}
