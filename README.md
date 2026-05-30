# 🎮 Kriyon_Arcade

A modern, high-performance web gaming platform built with Next.js, acting as a centralized hub for interactive, responsive web games.

---

## 📝 Project Overview & Description

**Kriyon_Arcade** is a centralized multi-game dashboard designed to bring classic, retro, and complex web games into a single, seamless user experience. Instead of maintaining separate deployment pipelines or navigating across multiple sites, this platform consolidates games into an ecosystem governed by a unified dashboard.

### Key Features
* **Centralized Hub:** A clean, modern dashboard layout to browse, select, and launch individual games instantly.
* **Optimized Performance:** Fast asset loading, automatic image handling, and zero layout shifts using Next.js font and asset optimization.
* **Responsive Viewports:** Tailored layouts delivering fluid, native-feeling gameplay across mobile, tablet, and desktop screens.
* **Strict Isolation Rules:** Architecture designed to keep game instances independent, preventing scripts or styles from bleeding into other areas of the application.

---

## 🕹️ Games Added

| Game Title | Genre | Description / Tech Highlight | Current Status |
| :--- | :--- | :--- | :--- |
| **Chess** | Strategy / Board | Powered by complex JavaScript algorithms for move validation, turn-state tracking, board evaluation, and deep game-tree logic. | 🛠️ In Active Development |
| **RetroSnake** | Arcade / Retro | A modern take on the classic arcade snake game, utilizing precise grid-movement algorithms and collision detection. | ⚡ Fully Playable |
| **TicTacToe** | Casual / Strategy | A clean, fast-paced implementation of the classic game featuring instant win-condition state checks. | ⚡ Fully Playable |

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


​🤝 Contributing & Collaboration
​If you have an idea for a game or want to improve an existing one, contributions are welcome! Please follow these structured steps to ensure a smooth integration:
​Fork the Repository: Click the "Fork" button at the top right of this page to create a copy under your account.
​Add Your Game Code:
​Place your core game components or route folders inside the src/app/games/YOUR_GAME_NAME and src/components/games/YOUR_GAME_NAME directories.
​If your game requires static media (images, sprites, audio), place them inside public/assets/games/YOUR_GAME_NAME/.
​Verify Implementation: Run the project locally and double-check that your game functions cleanly without cross-contaminating other game environments or causing layout shifts.
​Create a Pull Request (PR): Submit a PR to the main repository using the following naming convention:
​PR for [YOUR_GAME_NAME] by @[YOUR_GITHUB_USERNAME]

---
