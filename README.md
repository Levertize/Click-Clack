# Click-Clack: Aesthetic Typing Simulator

**Click-Clack** is a premium, visual-heavy typing sandbox built with React, TypeScript, Tailwind CSS, Framer Motion, and Zustand for state persistence. Every keystroke triggers custom-engineered, canvas-rendered particle effects, tactile mechanical switch audio clicks, and satisfying viewport rumbles that transform standard typing into an immersive audiovisual experience.

---

## ✨ Features

### 🎮 Typing Modes
*   **Sandbox Play**: A cardless, borderless, ultra-minimal space. Text floats freely over responsive particle backgrounds, completely uncluttered by standard UI containers.
*   **10FastFingers Test**: A timed typing speed test (15s, 30s, 60s, or 120s) with live WPM/Accuracy metrics, a ticking circular countdown timer, support for **English** and **Indonesian** word dictionaries, and a detailed post-test statistics modal card.

### 🎨 UI Customizer Preset Styles
Toggle between cohesive visual aesthetics that restyle the entire page, headers, logo, settings drawers, and control panels:
*   **Classic**: Clean, modern dark/light style following the active core theme.
*   **Cute ✿**: Bubbly pastel pink styling, rounded shapes, and double border aesthetics.
*   **Terminal (Hacker)**: Green monospace command shell interface with Unix-like output formatting.
*   **Cyberpunk**: Cyan-glowing high-tech frames with diagnostics readouts.
*   **Arcade 🎮**: Retro 8-bit game console grids and bright golden highlights.
*   **Glassmorphism**: Frosted transparent glass layouts using backdrop filter effects.
*   *(Watermark toggle enables or disables the brand watermark logo dynamically).*

### 🌈 Visual & Audio FX
*   **8 Keystroke Effects**: `Particles`, `Explode`, `Ripple`, `Sparks`, `Constellation`, `Trail` (bubbles), `Ink Blots`, and `Fire`.
*   **4 Interactive Backgrounds**: `Bokeh Dots` (ambient circles), `Starfield` (twinkling crosses), `Elastic Grid` (reactive interactive lattice), and `Matrix Rain` (scrolling green binary stream).
*   **Mouse Force Fields**: Ambient background particles interactively react to the cursor path (repelling or attracting) and trigger warp shockwaves on mouse clicks.
*   **Tactile Audio Synth**: Configurable sound profiles simulating tactile *Blue Clicky* switches, *Brown Creamy Thock* switches, *Retro Typewriters*, or *Arcade Pops* with adjustable volume and pitch.
*   **Accent Synchronization**: Custom color presets (`var(--ui-accent)`) dynamically flow down to settings toggles, volume/pitch sliders, active caret indicators, typography highlights, cursors, and custom background particle colors.

### ⚡ Performance & Rendering
*   **Ultra-smooth Custom Cursor**: Rendered at 60fps using direct DOM reference updates and `requestAnimationFrame` loops, completely bypassing React virtual DOM diffing to eliminate input latency.
*   **GPU Compositing Optimizations**: High-performance rendering for drawing canvas layers and floating texts. Viewport blur overlays are carefully optimized with transparent alphas to prevent layout thrashing and maintain constant 60fps.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Escape` | Close configuration and UI Customizer panels |
| `Ctrl` / `Cmd` + `,` | Toggle configuration settings drawer |
| `Ctrl` / `Cmd` + `Backspace` | Clear Sandbox editor text / Restart Typing Test |
| `Ctrl` / `Cmd` + `Shift` + `R` | Cycle to a random aesthetic core theme |

### Special Keystroke Behaviors
*   **Backspace**: Spawns active particle effects at half velocity.
*   **Space**: Spawns active particle effects with extra-wide spread velocity.
*   **Enter**: Spawns an extra-large particle burst in the center of the viewport.

---

## 🛠️ Installation & Setup

Ensure you have [Node.js](https://nodejs.org) installed on your system.

1.  Clone or download the repository.
2.  Open your terminal inside the project directory:
    ```bash
    npm install
    ```
3.  Run the local development server:
    ```bash
    npm run dev
    ```
4.  Open the local address (usually `http://localhost:5173`) in your browser.
5.  To compile a production-ready bundle:
    ```bash
    npm run build
    ```
