# crescent.ai — Coming Soon Landing Page

An interactive, high-performance "Coming Soon" landing page built with React, Vite, and HTML5 Canvas. It features an interactive scan-line ripple effect, dynamic typographic ink displacement with brand colors, seamless route transitions, and WCAG 2.1 AA accessible legal pages.

---

## ✨ Features

- **Interactive Canvas Typography (`LineField`)**:
  - Dynamically rasterizes and renders the headline (`COMING SOON`) using scan lines and pixel-sampled ink masks.
  - Interactive mouse/pointer physics: lines warp smoothly away from the cursor using a Gaussian bell-curve displacement and spring interpolation.
  - Dynamic brand coloring: concentric distortion rings expand around the cursor in crescent.ai brand colors (White, Magenta `#ee20e1`, Orange `#ec3503`, and Ink `#090909`).
  - Automated intro sweep animation for mobile and touch devices where hover interactions are unavailable.
  - High-DPI / Retina display crispness via dynamic `devicePixelRatio` scaling.
  - Throttled layout recomputation on window resize via `ResizeObserver`.
- **Accessibility & Motion Consideration**:
  - Full respect for `prefers-reduced-motion`: animation and physics disable gracefully for users who prefer reduced motion.
  - Screen reader friendly with semantic landmarks (`<main>`, `<header>`, `<footer>`, `<nav>`) and `.sr-only` headlines.
  - High-contrast visible focus rings (`:focus-visible`) for keyboard navigation.
- **Routing & Route Transitions**:
  - Client-side routing with `react-router-dom` v6.
  - Polished route loader (`RouteLoader`) providing a smooth micro-interaction beat between page navigations.
- **Legal & Compliance Pages**:
  - Pre-launch Privacy Policy (`/privacy`).
  - Accessibility Statement (`/accessibility`) detailing WCAG 2.1 Level AA conformance.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Rendering**: HTML5 Canvas 2D Context (hardware-accelerated, frame-budgeted with `requestAnimationFrame`)
- **Typography**: Google Fonts ([Archivo](https://fonts.google.com/specimen/Archivo) & [DM Sans](https://fonts.google.com/specimen/DM+Sans))
- **Styling**: Modern CSS3 (CSS Custom Properties, `clamp()` fluid sizing, CSS Grid/Flexbox)

---

## 📁 Project Structure

```text
Coming Soon Landing Page/
├── README.md
└── files/
    ├── index.html            # Main HTML entry point with Google Fonts
    ├── package.json          # Project metadata, dependencies, and npm scripts
    ├── vite.config.js        # Vite configuration with @vitejs/plugin-react
    ├── styles.css            # Global styling, design tokens, and layout classes
    ├── main.jsx              # React DOM entry point wrapping App in BrowserRouter
    ├── App.jsx               # Root component with routing and RouteLoader
    ├── ComingSoon.jsx        # Landing page layout with stage, logo, and canvas
    ├── LineField.jsx         # Canvas-based physics and rasterized typography engine
    ├── Legal.jsx             # Privacy Policy and Accessibility Statement page templates
    └── Logo.jsx              # Animated SVG crescent.ai brand logo component
```

> **Note on Source Directory Structure**:
> In the `files/` directory, components are structured with relative imports referencing standard subdirectories:
> - `src/pages/ComingSoon.jsx`
> - `src/pages/Legal.jsx`
> - `src/components/LineField.jsx`
> - `src/components/Logo.jsx`
> 
> When organizing into a standard Vite project layout, arrange them as:
> ```text
> ├── index.html
> ├── vite.config.js
> ├── package.json
> └── src/
>     ├── main.jsx
>     ├── App.jsx
>     ├── styles.css
>     ├── pages/
>     │   ├── ComingSoon.jsx
>     │   └── Legal.jsx
>     └── components/
>         ├── LineField.jsx
>         └── Logo.jsx
> ```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0.0 or later recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js) or `pnpm` / `yarn`

### Installation

1. Navigate to the project directory:
   ```bash
   cd "D:/crescent.ai/Coming Soon Landing Page/files"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser at the displayed local URL (usually `http://localhost:5173`).

### Production Build

To compile and bundle optimized production assets:

```bash
npm run build
```

The output will be generated inside the `dist/` directory.

### Preview Production Build

To test the production build locally before deployment:

```bash
npm run preview
```

---

## 🌐 Routes

| Route | Component | Description |
|---|---|---|
| `/` | `ComingSoon` | Main coming soon landing page with interactive canvas headline |
| `/privacy` | `Legal` | Privacy policy and data handling statement |
| `/accessibility` | `Legal` | Accessibility commitment and WCAG conformance notes |
| `*` | `ComingSoon` | Catch-all wildcard redirecting back to the landing page |

---

## 🎨 Design Tokens & Customization

Core visual properties are configured via CSS custom properties in `styles.css`:

```css
:root {
  --ink: #090909;       /* Primary text and hairline scanlines */
  --paper: #fdfdfd;     /* Background tone */
  --orange: #ec3503;    /* Accent highlight */
  --magenta: #ee20e1;   /* Accent highlight */
  --head-h: clamp(56px, 8.5vh, 88px);
  --pad: clamp(20px, 1.5vw, 32px);
}
```

The headline text can be changed by passing an array of strings to `LineField`:

```jsx
<LineField lines={["LAUNCHING", "SOON"]} />
```

---

## 📄 License

Private & Proprietary © crescent.ai. All rights reserved.
