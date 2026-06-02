# Xela Arcade 🎮

Xela Arcade is a high-performance, responsive web-based retro gaming hub engineered using **Next.js**, **TypeScript**, and **Tailwind CSS**. Optimized for seamless cross-platform performance, the matrix features zero-dependency implementations of classic arcade games built entirely on pure React state machines..

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

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router architecture)
* **Language:** [TypeScript](https://www.typescriptlang.org/) / Advanced JavaScript (Algorithmic Logic)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Font Asset:🏆** Geist (Optimized natively via `next/font`)

---

## 📂 Project Folder Structure

To maintain long-term scalability and clean code separation, **Kriyon_Arcade** utilizes a strictly structured directory where each game's assets, routing, components, and independent state modules are fully compartmentalized.

```text
├── public/                  # Static application assets
│   └── assets/games/        # Game-specific assets (e.g., icons, custom audio, sprites)
├── src/
│   ├── app/                 # Next.js App Router Structure
│   │   ├── layout.tsx       # Root layout, global fonts, and context wrappers
│   │   ├── page.tsx         # Kriyon_Arcade Core Dashboard / Hub Interface
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

💻 Developer
​Maintained by: P_vijay
​Hey there! I am actively working to add more web-based games in the future with a polished, modern UI.

## 💻 Local Installation & Setup

Follow these commands to deploy the workspace on your local environment:

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/xela-arcade.git](https://github.com/YOUR_GITHUB_USERNAME/xela-arcade.git)
cd xela-arcade

### 2. Install Project Dependencies
```bash
npm install

### 3. Launch Development Instance
```bash
npm run dev

Open http://localhost:3000 inside your web browser viewport to interact with the environment.



​🤝 Contributing & Collaboration

if you have an idea for a game or want to improve an existing one, contributions are welcome! Please follow these structured steps to ensure a smooth integration:
​Fork the Repository: Click the "Fork" button at the top right of this page to create a copy under your account.
​Add Your Game Code:
​Place your core game components or route folders inside the src/app/games/YOUR_GAME_NAME and src/components/games/YOUR_GAME_NAME directories.
​If your game requires static media (images, sprites, audio), place them inside public/assets/games/YOUR_GAME_NAME/.
​Verify Implementation: Run the project locally and double-check that your game functions cleanly without cross-contaminating other game environments or causing layout shifts.
​Create a Pull Request (PR): Submit a PR to the main repository using the following naming convention:
​PR for [YOUR_GAME_NAME] by @[YOUR_GITHUB_USERNAME]

---
