# 🏰 3D Wizard's Chess • Cathedral Sanctum Edition

An immersive, fully-featured 3D Wizard's Chess game built with **React**, **Three.js**, **chess.js**, and **Tailwind CSS**, featuring an integrated **Node.js Express** + **Neon Serverless PostgreSQL** backend (with automatic in-memory / local fallback).

![Wizard Chess](https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Features

- **🏛️ High-Fidelity 3D Gothic Cathedral**:
  - Sculpted lathe chess pieces with procedural stone-veined marble textures.
  - Altar, gothic stone pillars, glowing Rose stained-glass window with dynamic light cone rays.
  - Floating atmospheric cathedral embers with continuous particle physics.
  - Screen shake and 3D kinetic piece shatter explosion animations upon capture.
- **👑 4 Royal Cathedral Themes**:
  - *Sanctum Cathedral* (Alabaster Order vs Obsidian Order)
  - *Imperial Throne* (Sovereign Gold vs Crimson Ruby)
  - *Celestial Sapphire* (Platinum Ivory vs Royal Lapis)
  - *Emerald Basilica* (Imperial Pearl vs Dark Malachite)
- **⚔️ Game Modes & AI Opponent**:
  - **vs AI**: Evaluates board position and piece values with smooth automated moves.
  - **2P / Duel**: Pass-and-play or duel online friends.
- **🎥 Camera Controls & Orbit Engine**:
  - Presets: White perspective, Black perspective, Overhead view, and Cinematic Auto-Orbit.
  - Interactive pointer drag-to-orbit and mouse wheel zoom.
- **🎵 Cathedral Audio Synthesizer**:
  - Procedural Web Audio API cathedral organ swell, choir chords, celesta arpeggios, and heroic timpani.
  - Stone sliding, shatter impacts, select chimes, and check warnings.
- **🏰 Fellowship & Sanctum Registry**:
  - Wizard sign up, House allegiance, win/loss/draw records.
  - Real-time online presence simulation and friend search.
  - Match history vault with snapshot saving.
  - **Node.js + Neon PostgreSQL API**: Seamless cloud persistence or instant built-in local vault mode.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Frontend (Vite)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run the Backend API (Optional)
```bash
npm run server
```
Runs on `http://localhost:4000`. By default, it operates in **Local Sanctum Vault** mode (no cloud database required).

To connect to a **Neon Serverless PostgreSQL** database, create a `.env` file:
```env
PORT=4000
DATABASE_URL=postgresql://user:password@ep-xxxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 4. Build for Production
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.

When `dist/` is built, running `npm start` will serve both the backend API and the frontend application together from a single server!

---

## 📁 Project Structure

```
├── server.js               # Node.js + Express backend with Neon & Local Vault
├── src/
│   ├── App.jsx             # Main 3D Wizard's Chess React component
│   ├── index.css           # Tailwind CSS directives and gothic styling
│   └── main.jsx            # React root entry point
├── index.html              # HTML shell with Google Fonts & responsive viewport
├── vite.config.js          # Vite build configuration with API proxying
├── tailwind.config.js      # Tailwind CSS theme configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Project dependencies & scripts
└── .env.example            # Sample environment configuration
```
