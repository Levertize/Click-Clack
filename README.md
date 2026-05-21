# Click-Clack: Aesthetic Typing

**Click-Clack** is a premium, visual-heavy typing sandbox built using React, TypeScript, Tailwind CSS, Framer Motion, and global state persistence with Zustand. Every keystroke triggers custom-engineered, canvas-rendered particle effects that make typing feel incredibly satisfying.

---

## ✨ Features

- **8 Keystroke Effects**:
  - `Particles`: Classic gravity-affected particle dispersion.
  - `Explode`: Radial burst with expanding circular ghost shockwaves.
  - `Ripple`: Delayed concentric expanding circles fading smoothly.
  - `Sparks`: Friction-dampened streaking sparks falling with gravity.
  - `Constellation`: Interactive star nodes forming dynamic interconnected lattices.
  - `Trail`: Soft drifting bubbles rising floatingly.
  - `Ink Blots`: Scale-transformed organic ink expansion.
  - `Fire`: Blazing particles rising up with custom warmth color spectrums.
- **6 Premium Curated Themes**:
  - `Cyber`: Dark neon CRT matrix vibe with scanline overlays.
  - `Lofi`: Cozy cream layout with relaxing warm color palettes.
  - `Minimal`: Clean monochrome styling with high contrast.
  - `Vivid`: High-energy dark mode cycling colors dynamically.
  - `Ocean`: Deep blue palette with CRT scanlines.
  - `Sakura`: Light cherry blossom aesthetic.
- **4 Typography Options**: Select between Space Mono, Syne Mono, Playfair Display, and DM Sans.
- **Custom Interactive Cursor**: A dual-element cursor (center dot + smooth interpolating outer ring) that shrinks to focus the text area.
- **Rainbow Characters**: Inline typing character colorizer mapping dynamic accents to typed text.
- **Local Storage Persistence**: Store configurations automatically on the browser across sessions.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Escape` | Close configuration panel |
| `Ctrl` / `Cmd` + `,` | Toggle configuration panel |
| `Ctrl` / `Cmd` + `Backspace` | Clear all editor text |
| `Ctrl` / `Cmd` + `Shift` + `R` | Cycle to a random theme |

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
