# Click-Clack: Aesthetic Typing Simulator

**Click-Clack** is a premium, visual-heavy typing sandbox built using React, TypeScript, Tailwind CSS, Framer Motion, and global state persistence with Zustand. Every keystroke triggers custom-engineered, canvas-rendered particle effects, tactile mechanical audio clicks, and interface screen shake that make typing feel incredibly satisfying.

---

## ✨ Features

### 🎮 Typing Modes
- **Sandbox Play**: A cardless, borderless, minimal layout where your typing characters float freely over background particles.
- **10FastFingers Test**: A structured words grid supporting **English** and **Indonesian** lists, live WPM/Accuracy gauges, countdown timer, and a dedicated results modal card with metrics.

### 🎨 UI Customizer Preset Styles
Toggle between visual styles that restyle the entire page, headers, logo, and settings drawers:
- **Classic**: Original theme style.
- **Cute ✿**: Bubbly pastel pink interfaces and double border styling.
- **Terminal (Hacker)**: Monospace green command terminal with bash shell-like titles.
- **Cyberpunk**: Cyan-glowing high-tech frames with terminal indicators.
- **Arcade 🎮**: retro yellow console grids.
- **Glassmorphism**: Frosted transparent layouts.
*(Brand visibility toggle allows hiding/showing the logo watermark).*

### 🌈 Visual & Audio FX
- **8 Keystroke Effects**: `Particles`, `Explode`, `Ripple`, `Sparks`, `Constellation`, `Trail` (bubbles), `Ink Blots`, and `Fire`.
- **4 Typography Options**: Space Mono, Syne Mono, Playfair Display, and DM Sans.
- **4 Interactive Backgrounds**: `Bokeh Dots`, `Starfield` (twinkling crosses), `Elastic Grid` (reactive line lattice), and `Matrix Rain` (scrolling rain streams).
- **Interactive Force Fields**: Mouse movement repels/attracts particles; clicks generate an expanding warp shockwave.
- **tactile Audio Synth**: Sound presets mimicking Blue switches, Creamy thock (brown) switches, Typewriters, or Arcade Pop sounds with configurable pitch and volume.
- **Tactile Screen Shake**: Adjustable viewport impact rumble.
- **Rainbow Characters**: Inline character colorizer mapping dynamic accents to typed text.

### ⚡ Performance Optimization
- **60fps Custom Cursor**: High-performance outer ring cursor using direct DOM ref updates and `requestAnimationFrame` loops (completely bypassing React virtual DOM diffing to eliminate lag).
- **GPU Compositing Boost**: Viewport blur overlays replaced with alpha colors to keep drawer slides smooth.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Escape` | Close settings and UI Customizer drawers |
| `Ctrl` / `Cmd` + `,` | Toggle configuration settings drawer |
| `Ctrl` / `Cmd` + `Backspace` | Clear Sandbox editor text / Restart Typing Test |
| `Ctrl` / `Cmd` + `Shift` + `R` | Cycle to a random aesthetic core theme |

### Special Key Behaviors:
- **Backspace**: Spawns active particle effects at half intensity.
- **Space**: Spawns active particle effects with extra-wide spread velocity.
- **Enter**: Spawns an extra-large particle burst in the center of the viewport.

---

## 🛠️ Installation & Setup

Ensure you have [Node.js](https://nodejs.org) installed on your system.

1. Clone or download the directory.
2. Open terminal inside the project directory:
   ```bash
   npm install
   ```
3. Run local dev server:
   ```bash
   npm run dev
   ```
4. Access local hosting (typically `http://localhost:5173`) in your web browser.
5. To bundle for production:
   ```bash
   npm run build
   ```
