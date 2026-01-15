# Dead & Injured (Online Number Guessing Game)

A web-based number guessing game played with **4-digit secret numbers (no repeated digits)**. Supports:
- **Player vs Player**: real-time multiplayer
- **Player vs Computer**: single-player mode with an algorithmic opponent

Live demo: https://dead-injured-three.vercel.app/

## Why I built this
In high school, friends and I played “Dead & Injured” on paper—trying to deduce each other’s secret number through logic. I rebuilt it as a web app so it can be played online, cross-device, and in real time.

## Features
- Real-time multiplayer gameplay (PvP)
- Single-player mode (PvC) with a strategy-based opponent
- Cross-device responsive UI
- Clean, modular game logic for maintainability and feature growth

## Tech Stack
- Next.js + TypeScript
- Tailwind CSS
- Firebase (real-time sync)
- Vercel (deployment)

## Local Setup
```bash
git clone https://github.com/Chigozirim-web/dead-injured.git
cd dead-injured
npm install
npm run dev
