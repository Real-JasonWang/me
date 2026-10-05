# Jason Wang — Personal Portfolio

A sleek, responsive personal portfolio website featuring an interactive 3D particle wave background, frosted glass UI panels, and smooth single-page transitions.

---

## Quick Start

This site is built with vanilla HTML, modern CSS, and lightweight scripts. There are no build tools, npm installs, or complex dependencies required to run it.

```bash
# 1. Clone the repository
git clone https://github.com/Real-JasonWang/me.git && cd me

# 2. Run a local server
python -m http.server 3000
# or
npx serve .

# 3. Open in your browser
# Visit http://localhost:3000 or open index.html directly
```

---

## How It's Built & Special Effects

Here is how the visual effects and features work behind the scenes:

### 1. 3D Particle Wave Background (Three.js & WebGL)
The animated wave running in the background is rendered with Three.js (`#wave-canvas`):
- **Adaptive 3D Wave**: Uses `THREE.Points` with a custom GLSL vertex shader (45,000 particles on desktop, 16,000 on mobile with touch-scroll event pumping) to combine multiple sine and cosine waves into fluid wave motion with guaranteed 60fps responsiveness on mobile devices.
- **Color Transitions**: As the wave moves, the shader shifts particle colors across a dynamic spectrum (acid yellow `#DFFF00`, cyan `#00F0FF`, and soft lavender `#F8D8FF`).
- **Glow & Fog**: A small canvas texture generates soft star-shaped light sprites with bloom, while exponential distance fog (`THREE.FogExp2`) fades particles into the dark background.

### 2. Layered Ambient Background Glow
Behind the canvas, multiple blurred CSS radial gradients slowly float in opposite directions on 30–40 second loops. This adds atmospheric depth without hitting GPU performance.

### 3. Frosted Glass UI (Glassmorphism)
The cards and navigation bar use a modern frosted-glass look:
- Blurs what is behind the panel with `backdrop-filter: blur(24px) saturate(150%)`.
- Uses semi-transparent dark backgrounds with soft white borders (`rgba(255, 255, 255, 0.08)`).
- Lifts gently with a smooth box shadow when hovered.

### 4. Rainbow Gradient Text & Borders
Key headlines, names, and card edges feature a shifting rainbow gradient that smoothly animates on a 6-second loop using CSS background clipping and mask composites.

### 5. Smooth 3D Page Transitions
Instead of reloading pages, the site works as a single-page app (SPA):
- Sections (`Home`, `Hybrid Skillset`, `Experiences`, `Outputs & Awards`, `Facts`) are rendered inside a CSS perspective container.
- Clicking nav items switches active tabs with a subtle 3D slide and fade (`translateZ` / `translateY`), keeping navigation fast and responsive.

### 6. Dynamic Date Counter
Vanilla JavaScript automatically updates the copyright year and current month/year display so the footer never shows outdated dates.

---

## Design System

### Fonts
- **Headings & Titles**: [Covered By Your Grace](https://fonts.google.com/specimen/Covered+By+Your+Grace) (Handwritten, expressive display font)
- **Body Text**: [Geist](https://fonts.google.com/specimen/Geist) (Clean, highly readable modern sans-serif)
- **Code & Labels**: [DM Sans](https://fonts.google.com/specimen/DM+Sans) (Modern geometric sans-serif for tech tags, metrics, and dates)

### Color Palette
- **Acid**: `#DFFF00` (Highlight yellow)
- **Cyan**: `#00F0FF` (Electric cyan)
- **Neo Lavender**: `#F8D8FF` (Soft lavender accent)
- **Dark Void**: `#020203` (Deep background)

---

## Project Structure

```
me/
├── index.html       # Current portfolio website
├── portal.html      # Archive redirection page
├── assets/          # Organization logos, badges, and photos
├── old/             # Archived version 1 website & original docs
│   ├── index.html   # Previous site version
│   ├── README.md    # Original V1 documentation backup
│   └── LICENSE.md   # Original V1 license backup
├── LICENSE.md       # Modified MIT License (Privacy Protected)
└── README.md        # Project overview & documentation
```

---

## License

This project is licensed under a **Modified MIT License**. You are welcome to use and adapt the code and template for your own site. However, all personal information, likeness, photos, academic records, and credentials belonging to Jason Wang are private property and must be replaced or removed in any forks or redeployments. See [LICENSE.md](./LICENSE.md) for full details.
