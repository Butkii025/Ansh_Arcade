# Xela_Arcade 🎮

Project: Xela_Arcade is a high-performance, responsive web-based retro gaming hub engineered using **Next.js**, **TypeScript**, and **Tailwind CSS**. Optimized for seamless cross-platform performance, the matrix features zero-dependency implementations of classic arcade games built entirely on pure React state machines.

---

## 🚀 Live Matrix
Deployed at: **[xela-arcade.netlify.app](https://xela-arcade.netlify.app/)**

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Engineering Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | Client-side hydration & fast routing |
| **Language** | TypeScript | Type safety and strict structural bounds |
| **Styling** | Tailwind CSS | Utility-first fluid styling, transitions, and layout matching |
| **Icons** | React Icons (`fa6`, `md`) | High-fidelity scalable vector interface triggers |
| **Deployment** | Netlify | Fast global edge delivery & production builds |

---

## 🎯 Active Gaming Catalog

### ♟️ Chess Matrix
* **Rule Enforcement:** Features strict client-side validation logic for legal piece mechanics, handling coordinate-based rule tracking for pawn pushes and tactical diagonal captures.
* **Structural Board Alignment:** Built on a responsive grid system wrapped in a rigid outer container, keeping cell boundaries perfectly intact without shifting shapes during intense piece manipulation.
* **Piece Development Focus:** Optimized visual highlights to track piece trajectories, giving players immediate tactical feedback during openings, mid-game skirmishes, and tactical transitions.

### 🐍 Retro Snake
* **Spawn Control:** Programmed to begin from the lower grid coordinates (`[7, 13]`) for immediate accessibility.
* **Responsive D-Pad:** Features a dedicated, cross-platform direction pad layout. It maps smoothly beneath the board on mobile screens and dynamically shifts to a side-by-side row split (`lg:flex-row`) on desktops.
* **Loop Synchronization:** Implemented with explicit functional state mutations to eliminate race conditions and stale closures during high-frequency user keyboard or button inputs.

### ❌ Tic-Tac-Toe (`MATRIX_v1.0`)
* **Warp-Proof Architecture:** Grid items are bound by a rigid aspect ratio matrix (`aspect-square`) using absolute text placement wrappers (`absolute inset-0`). This halts browser layout recalculations and prevents container shifting when 'X' or 'O' tokens fill the grid blocks.
* **Intelligent Bot AI:** Deploys defensive, predictive move-blocking logic before falling back to center-capture and randomized index paths.
* **Layout Stability:** Utilizes a custom opacity transition container to pin UI elements in place. This prevents frame popping before the match begins or after a system reset.

---

## 📂 Project Folder Structure

To maintain long-term scalability and clean code separation, **Xela_Arcade** utilizes a strictly structured directory where each game's assets, routing, components, and independent state modules are fully compartmentalized.

```text
├── public/                  # Static application assets
│   └── assets/games/        # Game-specific assets (e.g., icons, custom audio, sprites)
├── src/
│   ├── app/                 # Next.js App Router Structure
│   │   ├── layout.tsx       # Root layout, global fonts, and context wrappers
│   │   ├── page.tsx         # Xela_Arcade Core Dashboard / Hub Interface
│   │   └── games/           # Dedicated route directory for all game instances
│   │       ├── chess/       
│   │       │   └── page.tsx 
│   │       ├── retrosnake/  
│   │       │   └── page.tsx 
│   │       └── tictactoe/   
│   │           └── page.tsx 
│   ├── components/          # Reusable UI System
│   │   ├── shared/          # Global application shell (Navbar, Footer)
│   │   └── games/           # Isolated component folders per game
│   │       ├── ChessBoard/  # Render layers for grid arrays and piece vectors
│   │       ├── RetroSnake/  # Grid rendering and game canvas setup
│   │       └── TicTacToe/   # Turn indicators and grid interaction matrix
│   ├── hooks/               # Custom hooks (game loops, timers, input handlers)
│   └── utils/               # Complex algorithms, state evaluators, and math helpers
├── package.json
└── README.md
```
---

## 💻 Developer

Maintained by: **P_vijay** *Hey there! I am actively working to add more web-based games in the future with a polished, modern UI.*

---

## ⚖️ Licensing & Intellectual Property Protection

This project operates under a strict **Split-Licensing Model** to maximize codebase transparency while legally protecting the platform from unauthorized commercial exploitation or closed-source forks.

### 1. Software & Game Logic (GNU GPLv3)
The entire underlying codebase—including the web environment, server backends, database configurations, and custom game engines—is licensed under the **GNU General Public License v3 (GPLv3)**. 
* **Copyleft Enforced:** Anyone may clone and inspect this code, but any modified versions, feature additions, or alternative website deployments **must** remain 100% open-source under the exact same GPLv3 license.
* **Proprietary Block:** You are legally prohibited from taking this code and locking it inside a private, closed-source repository or using it for a proprietary commercial gaming service.

### 2. Game Assets, Artwork, & Content (CC BY-NC-ND 4.0)
All visual assets, pixel art, animations, UI mockups, audio files, sound effects, and custom classic map designs are strictly protected under the **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License**.
* **Non-Commercial:** No individual or corporation may use the artistic assets of this project to generate revenue, sell in-game microtransactions, or run paid advertisements.
* **No Derivatives:** Unauthorized altering, recoloring, or re-skinning of the custom game graphics for other external projects is strictly prohibited.
