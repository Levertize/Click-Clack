export class KeyboardSynth {
  private ctx: AudioContext | null = null
  private volume = 0.5 // 0 to 1
  private pitch = 1.0 // 0.5 to 2.0

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  setVolume(vol: number) {
    this.volume = vol
  }

  setPitch(pitch: number) {
    this.pitch = pitch
  }

  playClick(type: 'none' | 'blue-switch' | 'brown-switch' | 'typewriter' | 'arcade-pop', key?: string) {
    if (type === 'none') return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    
    // Create master volume node
    const gainNode = this.ctx.createGain()
    gainNode.gain.setValueAtTime(this.volume, now)
    gainNode.connect(this.ctx.destination)

    if (type === 'blue-switch') {
      // 1. Plastic click (fast high bandpass noise)
      const bufferSize = this.ctx.sampleRate * 0.015
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(4500 * this.pitch, now)
      filter.Q.setValueAtTime(3, now)

      const noiseGain = this.ctx.createGain()
      noiseGain.gain.setValueAtTime(0.4, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012)

      noise.connect(filter)
      filter.connect(noiseGain)
      noiseGain.connect(gainNode)
      noise.start(now)

      // 2. High metallic ping
      const osc = this.ctx.createOscillator()
      const oscGain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(5500 * this.pitch, now)
      oscGain.gain.setValueAtTime(0.15, now)
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008)

      osc.connect(oscGain)
      oscGain.connect(gainNode)
      osc.start(now)
      osc.stop(now + 0.01)

      // 3. Lower bottom-out clack
      const bodyOsc = this.ctx.createOscillator()
      const bodyGain = this.ctx.createGain()
      bodyOsc.type = 'triangle'
      bodyOsc.frequency.setValueAtTime(320 * this.pitch, now)
      bodyOsc.frequency.exponentialRampToValueAtTime(120 * this.pitch, now + 0.03)
      bodyGain.gain.setValueAtTime(0.8, now)
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

      bodyOsc.connect(bodyGain)
      bodyGain.connect(gainNode)
      bodyOsc.start(now)
      bodyOsc.stop(now + 0.035)

    } else if (type === 'brown-switch') {
      // Tactile, creamy clack, low-pitch bump
      const bufferSize = this.ctx.sampleRate * 0.04
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1200 * this.pitch, now)
      filter.Q.setValueAtTime(1.5, now)

      const noiseGain = this.ctx.createGain()
      noiseGain.gain.setValueAtTime(0.2, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

      noise.connect(filter)
      filter.connect(noiseGain)
      noiseGain.connect(gainNode)
      noise.start(now)

      const bodyOsc = this.ctx.createOscillator()
      const bodyGain = this.ctx.createGain()
      bodyOsc.type = 'sine'
      bodyOsc.frequency.setValueAtTime(240 * this.pitch, now)
      bodyOsc.frequency.exponentialRampToValueAtTime(140 * this.pitch, now + 0.04)
      bodyGain.gain.setValueAtTime(0.9, now)
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      bodyOsc.connect(bodyGain)
      bodyGain.connect(gainNode)
      bodyOsc.start(now)
      bodyOsc.stop(now + 0.045)

    } else if (type === 'typewriter') {
      // Typewriter clack + bell on Enter
      if (key === 'Enter') {
        const osc1 = this.ctx.createOscillator()
        const osc2 = this.ctx.createOscillator()
        const bellGain = this.ctx.createGain()
        
        osc1.type = 'sine'
        osc1.frequency.setValueAtTime(2200 * this.pitch, now)
        osc2.type = 'sine'
        osc2.frequency.setValueAtTime(2900 * this.pitch, now)
        
        bellGain.gain.setValueAtTime(0.3, now)
        bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
        
        osc1.connect(bellGain)
        osc2.connect(bellGain)
        bellGain.connect(gainNode)
        
        osc1.start(now)
        osc2.start(now)
        osc1.stop(now + 0.4)
        osc2.stop(now + 0.4)
      }

      // Key impact metallic clack
      const bufferSize = this.ctx.sampleRate * 0.05
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(3200 * this.pitch, now)
      filter.Q.setValueAtTime(3.5, now)

      const noiseGain = this.ctx.createGain()
      noiseGain.gain.setValueAtTime(0.4, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      noise.connect(filter)
      filter.connect(noiseGain)
      noiseGain.connect(gainNode)
      noise.start(now)

      const revOsc = this.ctx.createOscillator()
      const revGain = this.ctx.createGain()
      revOsc.type = 'triangle'
      revOsc.frequency.setValueAtTime(140 * this.pitch, now)
      revGain.gain.setValueAtTime(0.6, now)
      revGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)

      revOsc.connect(revGain)
      revGain.connect(gainNode)
      revOsc.start(now)
      revOsc.stop(now + 0.08)

    } else if (type === 'arcade-pop') {
      // Pop sound
      const osc = this.ctx.createOscillator()
      const popGain = this.ctx.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(350 * this.pitch, now)
      osc.frequency.exponentialRampToValueAtTime(1100 * this.pitch, now + 0.06)
      
      popGain.gain.setValueAtTime(0.5, now)
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
      
      osc.connect(popGain)
      popGain.connect(gainNode)
      
      osc.start(now)
      osc.stop(now + 0.07)
    }
  }
}

export const keyboardSynth = new KeyboardSynth()
