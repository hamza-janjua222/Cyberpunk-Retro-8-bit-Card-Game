<div align="center">

# 🕹️ Cyberpunk Retro 8-bit Card Game

**A neon-drenched memory-matching game — built with vanilla HTML, CSS, and JavaScript.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)

[Overview](#overview) • [How It Works](#how-it-works) • [Features](#features) • [Tech Notes](#tech-notes) • [Play It](#getting-started)

</div>

---

## Overview

An 8-card memory matching game wrapped in a cyberpunk aesthetic — neon glow palette, scanline overlay, retro pixel font, and a looping video background. Flip cards, find pairs, beat the clock and your move count, and get a confetti celebration on a win.

The game logic — shuffling, match detection, turn state, timing — is hand-built. Some of the polish layer (the confetti celebration effect and a few accessibility hooks) was added with AI assistance on top of that base logic.

---

## How It Works

**Shuffling** — cards are shuffled using the **Fisher-Yates algorithm**, which guarantees a uniform random permutation in `O(n)` time, rather than a naive (and statistically biased) sort-by-random approach.

**Turn logic** — the game tracks two "flipped" card slots at a time:
1. First click → card flips, stored as `firstFlipped`, timer starts
2. Second click → card flips, stored as `secondFlipped`, move count increments
3. Emojis on both cards are compared — a match locks both cards as solved; a mismatch flips them back after a short delay

**State locking** — an `isLocked` flag prevents clicking during the reveal/mismatch animations, so rapid clicking can't break the game state.

**Win condition** — once all 4 pairs are matched, the timer stops, a modal displays your final time and move count, and a canvas-based confetti effect fires.

---

## Features

- 🎴 **8-card grid** (4 emoji pairs), reshuffled every game
- ⏱️ **Live timer** — starts on first move, stops on win
- 🔢 **Move counter**
- 🎉 **Confetti celebration** on winning, built with a canvas particle system
- ♿ **Accessibility support** — keyboard navigation (Enter/Space to flip), ARIA live regions for the timer and move count, `aria-label`s that update with card state, and `prefers-reduced-motion` support for the scanline/animation effects
- 🔄 **Restart** — fully resets timer, moves, board, and any in-progress animations
- 🎨 **Cyberpunk visual theme** — neon cyan/pink/purple/green glow palette, CRT-style scanline overlay, "Press Start 2P" pixel font, looping video background

---

## Tech Notes

- **No frameworks, no build step** — plain HTML/CSS/JS, runs directly in a browser
- **CSS custom properties** — the entire neon color palette, spacing, and glow effects are defined as CSS variables (`:root`) for consistent theming across the UI
- Cards are **generated dynamically** in JavaScript (not hardcoded in HTML) for cleaner control over state and accessibility attributes
- Split into `theme.css` (visual design tokens, background, global effects) and `game.css` (game-specific layout) for separation of concerns
- Split into `script.js` (core game logic) and `effects.js` (confetti/celebration) — the effects layer is decoupled so it can be added or removed without touching game logic

---

## Getting Started

No build tools required — just open it in a browser:

```bash
git clone https://github.com/hamza-janjua222/CyberPunk-Retro-8-bit-Card-Game.git
cd CyberPunk-Retro-8-bit-Card-Game
```

Then open `index.html` directly in your browser, or serve it locally:

```bash
# Python's built-in server works fine for a static site
python -m http.server 8000
```

---

<div align="center">

**Built by [Hamza](https://github.com/hamza-janjua222)**

</div>
