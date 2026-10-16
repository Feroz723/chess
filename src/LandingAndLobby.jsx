// ============================================================================
// FILE: src/LandingAndLobby.jsx
// Production-Ready 3D Chronicles of Wizard's Chess
// OriginKit & ReactBits Inspired Components:
// 1. LandingPage: Pure Chess Strategy, Noble Pieces, Legendary Openings, Tactical Motifs,
//    Immortal Games, Board Geometry Guide, Time Controls & Grandmaster Wisdom
// 2. AuthGateModal: Fast Access with Default Keys, House Selection, One-Click Enter
// 3. LobbyPage: 3D Animated Grand Hall with Mode Picker (AI vs Offline Duel), Side & Difficulty
// ============================================================================

import React, { useState } from 'react';
import {
  Crown, Sparkles, Swords, Bot, Users, Shield, Zap,
  Flame, Key, ArrowRight, ArrowLeft, Play, RotateCcw, Check, CheckCircle2,
  BookOpen, Compass, Castle, Volume2, Volume1, VolumeX, Eye,
  Target, Award, Quote, ChevronRight, ChevronDown, ChevronUp, Music, Clock, Grid,
  Crosshair, Layers, HelpCircle, Trophy, Search, UserPlus
} from 'lucide-react';

export const LANDING_THEMES = {
  'royal-gold': {
    id: 'royal-gold',
    name: 'Royal Gold',
    badge: 'Solar High Realm',
    musicName: 'Two Kingdoms Poised',
    musicFile: '/music/two_kingdoms_poised.mp3',
    shineClass: 'shine-text-gold',
    cardHoverClass: '',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-400',
    borderClass: 'border-amber-400/40',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    heroTag: '✦ THE ROYAL GAME • 64 SQUARES OF DESTINY ✦',
    heroTitle: 'CHRONICLES OF CHESS MASTERY',
    heroDesc: 'For fifteen centuries, monarchs, grandmasters, and tacticians have met on this timeless battlefield. Every opening carries history, every sacrifice tests courage, and every checkmate demands absolute clarity of mind.',
    auraBg: 'bg-amber-500/20',
    btnGradient: 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black hover:brightness-110 shadow-amber-500/30'
  },
  'gothic-obsidian': {
    id: 'gothic-obsidian',
    name: 'Gothic Obsidian',
    badge: 'Shadow Realm',
    musicName: 'Decisive Impact',
    musicFile: '/music/decisive_impact.mp3',
    shineClass: 'shine-text-gothic',
    cardHoverClass: 'spotlight-card-gothic',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-500',
    borderClass: 'border-purple-500/40',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    heroTag: '✦ THE SHADOW BOARD • RUTHLESS COMBINATIONS ✦',
    heroTitle: 'THE OBSIDIAN BATTLEFIELD',
    heroDesc: 'Enter the treacherous arena of sacrificial combinations, dark king hunts, and devastating tactical strikes where one blunder seals your monarch\'s fate in the shadows.',
    auraBg: 'bg-purple-600/25',
    btnGradient: 'bg-gradient-to-r from-purple-500 via-purple-600 to-rose-600 text-white hover:brightness-110 shadow-purple-600/35'
  },
  'astral-void': {
    id: 'astral-void',
    name: 'Astral Void',
    badge: 'Celestial Realm',
    musicName: 'Weightless Isolation',
    musicFile: '/music/weightless_isolation.mp3',
    shineClass: 'shine-text-astral',
    cardHoverClass: 'spotlight-card-astral',
    accentText: 'text-sky-400',
    accentBg: 'bg-sky-400',
    borderClass: 'border-sky-400/40',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    heroTag: '✦ THE CELESTIAL REALM • PURE STRATEGY ✦',
    heroTitle: 'ASTRAL DOMAIN OF STRATEGY',
    heroDesc: 'Ascend to geometric harmony. Unravel profound pawn structures, coordinate long-range diagonals, and execute flawless endgame technique under the starlight.',
    auraBg: 'bg-sky-500/25',
    btnGradient: 'bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600 text-white hover:brightness-110 shadow-sky-500/35'
  }
};

/**
 * 1. LANDING PAGE COMPONENT
 */
export function LandingPage({
  landingTheme,
  setLandingTheme,
  onOpenAuth,
  onEnterLobby,
  onQuickPlayAi,
  currentUser,
  isMuted,
  musicPlaying,
  onToggleMute,
  musicVolume,
  onSetVolume,
  currentThemeMusicName
}) {
  const t = LANDING_THEMES[landingTheme] || LANDING_THEMES['royal-gold'];
  const [activeStrategyTab, setActiveStrategyTab] = useState('openings');
  const [activeGeometryTab, setActiveGeometryTab] = useState('center');
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [showFullGuide, setShowFullGuide] = useState(false);

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto overflow-x-hidden text-[#f8fafc] font-sans selection:bg-amber-400 selection:text-black bg-black/55 backdrop-blur-[3px]">
      {/* Ambient Radial Aura Blobs that match theme */}
      <div className={`ambient-aura -top-32 -left-32 w-[34rem] h-[34rem] ${t.auraBg}`} />
      <div className={`ambient-aura top-1/2 -right-32 w-[36rem] h-[36rem] ${t.auraBg}`} />
      <div className={`ambient-aura -bottom-32 left-1/4 w-[32rem] h-[32rem] ${t.auraBg}`} />

      {/* Top Glassy Realm Navbar */}
      <nav className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3 bg-[#0d0a17]/95 backdrop-blur-2xl border-b border-white/20 flex items-center justify-between gap-3 shadow-2xl">
        {/* Brand Crest */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/30 via-purple-500/25 to-transparent border border-amber-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0">
            <Crown className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="font-serif font-extrabold text-sm sm:text-base tracking-wider text-white flex items-center gap-1.5">
              <span>WIZARD&apos;S CHESS</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/50 font-mono font-bold">
                TITAN 3D
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-semibold tracking-widest uppercase">
              Chronicles of the Grandmaster
            </p>
          </div>
        </div>

        {/* Center: Realm Theme Switcher */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-black/70 border border-white/20 backdrop-blur-xl">
          {Object.values(LANDING_THEMES).map(themeOption => (
            <button
              key={themeOption.id}
              onClick={() => setLandingTheme(themeOption.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 origin-spring flex items-center gap-1.5 ${
                landingTheme === themeOption.id
                  ? 'bg-gradient-to-r from-white/25 to-white/10 border border-white/50 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${themeOption.accentBg} shadow-sm`} />
              <span>{themeOption.name}</span>
            </button>
          ))}
        </div>

        {/* Right CTA & Sound Controls */}
        <div className="flex items-center gap-2">
          {/* Interactive Volume & Mute Controls with Popover */}
          <div className="relative flex items-center bg-black/60 border border-white/20 rounded-full p-1 gap-1 shadow-lg">
            <button
              type="button"
              onClick={onToggleMute}
              className={`p-2 rounded-full border transition-all duration-200 origin-spring flex items-center justify-center ${
                isMuted || musicVolume === 0
                  ? 'bg-red-500/30 border-red-400 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.4)] hover:bg-red-500/40'
                  : 'bg-amber-400/20 border-amber-400/60 text-amber-300 hover:bg-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
              }`}
              title={isMuted || musicVolume === 0 ? 'Click to Play Soundtrack' : `Click to Mute Soundtrack (${musicVolume}%)`}
            >
              {isMuted || musicVolume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400 animate-pulse" />
              ) : (
                <div className="flex items-center gap-1">
                  {musicVolume > 50 ? <Volume2 className="w-4 h-4" /> : <Volume1 className="w-4 h-4" />}
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-amber-300 animate-pulse rounded-full" />
                    <span className="w-0.5 h-3 bg-amber-200 animate-pulse delay-75 rounded-full" />
                    <span className="w-0.5 h-1.5 bg-amber-300 animate-pulse delay-150 rounded-full" />
                  </span>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowVolumePopup(prev => !prev)}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-mono font-bold transition origin-spring ${
                showVolumePopup
                  ? 'bg-amber-400/30 border-amber-400/70 text-amber-200'
                  : isMuted
                  ? 'bg-red-500/20 border-red-500/40 text-red-300'
                  : 'bg-white/5 border-white/10 text-slate-200 hover:text-white hover:bg-white/10'
              }`}
              title="Click to adjust Soundtrack Volume"
            >
              <span>{isMuted ? 'MUTED' : `${musicVolume}%`}</span>
            </button>

            {showVolumePopup && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#161224]/98 backdrop-blur-2xl border border-amber-400/50 rounded-2xl shadow-2xl p-4 z-40 flex flex-col gap-3 origin-scale-in text-white">
                <div className="flex items-center justify-between text-xs text-amber-200 font-bold">
                  <span>Soundtrack Volume</span>
                  <span className="font-mono text-amber-300 font-black">{musicVolume}%</span>
                </div>
                <div className="text-[11px] text-slate-200 truncate font-semibold bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  ♫ {currentThemeMusicName || 'Two Kingdoms Poised'}
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : musicVolume}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (onSetVolume) onSetVolume(val);
                  }}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-black/70 rounded-lg"
                />
                <button
                  type="button"
                  onClick={onToggleMute}
                  className="w-full py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-200 border border-white/15 transition origin-spring"
                >
                  {isMuted ? '▶ Unmute & Play Soundtrack' : '⏸ Mute Soundtrack'}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onEnterLobby}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold tracking-wider uppercase transition origin-spring flex items-center gap-2 shadow-2xl ${t.btnGradient} cursor-pointer`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Play Game</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-28 flex flex-col gap-16 sm:gap-20">
        
        {/* HERO SECTION - Streamlined & Action-Oriented */}
        <section className="flex flex-col items-center text-center max-w-4xl mx-auto origin-slide-up">
          {/* Animated Seasonal Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-xs font-bold backdrop-blur-xl mb-4 shadow-xl">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span className="tracking-widest uppercase text-amber-200 text-xs font-extrabold">
              ✦ IMMERSIVE 3D CHESS • WEBGL CATHEDRAL ✦
            </span>
          </div>

          {/* Master Shine Text Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] mb-4 drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)]">
            <span className={t.shineClass}>CHRONICLES OF WIZARD&apos;S CHESS</span>
          </h1>

          {/* Clean, Simple Subtitle Description */}
          <p className="text-base sm:text-xl text-slate-200 max-w-2xl font-medium leading-relaxed mb-8 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            Experience classic chess rendered in an ancient 3D cathedral sanctum. Challenge the intelligent AI or play face-to-face with a friend.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={onEnterLobby}
              className={`w-full sm:w-auto px-9 py-4 rounded-2xl text-base font-black tracking-widest uppercase transition-all duration-300 origin-spring flex items-center justify-center gap-3 shadow-2xl hover:scale-105 border border-amber-300 ring-2 ring-amber-400/40 cursor-pointer ${t.btnGradient}`}
            >
              <Swords className="w-5 h-5 fill-current" />
              <span>Play Now (Choose Mode)</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>

            <button
              onClick={onQuickPlayAi || onEnterLobby}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm sm:text-base font-extrabold tracking-wide bg-gradient-to-r from-purple-600/70 to-indigo-600/70 hover:from-purple-600 hover:to-indigo-600 border border-purple-400/60 text-white transition origin-spring flex items-center justify-center gap-2.5 backdrop-blur-xl shadow-xl hover:scale-105 cursor-pointer"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>Quick Start vs AI</span>
            </button>
          </div>

          {/* Quick Highlights Bar */}
          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-2xl bg-[#0e0b17]/90 backdrop-blur-2xl rounded-2xl p-4 shadow-xl border border-white/15">
            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-serif text-amber-300">3D WebGL</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-semibold uppercase tracking-wider">Dynamic Camera</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-serif text-purple-300">Smart AI</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-semibold uppercase tracking-wider">4 Difficulty Levels</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-serif text-emerald-300">2-Player</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-semibold uppercase tracking-wider">Local Pass &amp; Play</div>
            </div>
          </div>
        </section>

        {/* SECTION 1: HOW TO PLAY IN 3 SIMPLE STEPS */}
        <section className="w-full max-w-5xl mx-auto -mt-4">
          <div className="text-center mb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
              Quick Guide
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-2">
              How To Play In 3 Easy Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              Know where to go, what to choose, and how to command the board.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-[#140f24]/90 border border-amber-400/30 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:border-amber-400/60 transition">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/50 flex items-center justify-center font-black text-sm mb-4">
                  1
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-amber-300" />
                  <span>Choose Your Mode</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  Click <strong>Play Now</strong> to enter the lobby. Pick <strong>Solo vs AI</strong> or challenge a friend in <strong>2-Player Pass &amp; Play</strong>.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-amber-300 font-semibold">
                Solo AI &bull; 2-Player Pass &amp; Play
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-[#140f24]/90 border border-purple-400/30 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:border-purple-400/60 transition">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/50 flex items-center justify-center font-black text-sm mb-4">
                  2
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-300" />
                  <span>Select Color &amp; Realm</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  Command White (moves 1st) or Black. Switch between 5 atmospheric 3D cathedral themes with live orchestral music.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-purple-300 font-semibold">
                White &amp; Black &bull; 5 Sanctum Themes
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-[#140f24]/90 border border-emerald-400/30 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:border-emerald-400/60 transition">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 flex items-center justify-center font-black text-sm mb-4">
                  3
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Swords className="w-5 h-5 text-emerald-300" />
                  <span>Move &amp; Checkmate</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  Click any piece on the board to see valid move circles in glowing green. Click any target circle to move or capture. Trap the King to win!
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-300 font-semibold">
                Green Legal Highlights &bull; 3D Orbit Camera
              </div>
            </div>
          </div>
        </section>

        {/* COLLAPSIBLE COMPLETE CHESS GUIDE (Keeps Landing Clean & Uncluttered) */}
        <section className="flex flex-col items-center gap-3 w-full max-w-5xl mx-auto">
          <button
            onClick={() => setShowFullGuide(prev => !prev)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-bold text-amber-200 hover:text-white transition flex items-center justify-center gap-2.5 backdrop-blur-md shadow-lg cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>{showFullGuide ? 'Hide Complete Piece & Strategy Guide' : '📖 View Complete Piece Rules & Strategy Guide (Click to View)'}</span>
            {showFullGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <span className="text-[11px] text-slate-400">
            {showFullGuide ? 'Showing comprehensive piece movements and tactics below' : 'Click above if you want to study piece movements, openings, and board geometry.'}
          </span>
        </section>

        {showFullGuide && (
          <div className="flex flex-col gap-16 sm:gap-20 origin-slide-up">
            {/* SECTION: THE SIX NOBLE PIECES (ORIGINKIT BENTO GRID) */}
            <section id="pieces" className="flex flex-col gap-8">
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
                  Battlefield Hierarchy
                </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white mt-1 mb-3">
              The Six Living Pieces
            </h2>
            <p className="text-sm sm:text-base text-slate-100 font-medium">
              Every warrior on the chequered board possesses distinct geometry, distinct courage, and an irreplaceable strategic destiny.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* The King */}
            <div className={`spotlight-card ${t.cardHoverClass} p-7 rounded-3xl flex flex-col justify-between bg-[#151124]/95 border border-white/20 shadow-2xl`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">♔</span>
                  <span className="px-3 py-1 rounded-full bg-amber-400/25 text-amber-200 border border-amber-400/50 text-xs font-bold uppercase tracking-wider">
                    Priceless Monarch
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">The Sovereign King</h3>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  The ultimate objective. Delicate in the opening where he seeks refuge behind castle walls; transformed into a ruthless, active attacker when queens leave the board in the endgame.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-amber-200 font-bold">
                <span>Value: Absolute</span>
                <span>Role: Castling &amp; Opposition</span>
              </div>
            </div>

            {/* The Queen */}
            <div className={`spotlight-card ${t.cardHoverClass} p-7 rounded-3xl flex flex-col justify-between bg-[#151124]/95 border border-white/20 shadow-2xl`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl text-purple-200 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">♕</span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/25 text-purple-200 border border-purple-400/50 text-xs font-bold uppercase tracking-wider">
                    9 Points Force
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">The Sovereign Queen</h3>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  Combining the straight-line devastation of the Rook and the diagonal reach of the Bishop. Deadly in open space, ruthless in king-hunts, and decisive in deliverable checkmates.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-purple-200 font-bold">
                <span>Value: 9 Points</span>
                <span>Role: Overwhelming Assault</span>
              </div>
            </div>

            {/* The Rook */}
            <div className={`spotlight-card ${t.cardHoverClass} p-7 rounded-3xl flex flex-col justify-between bg-[#151124]/95 border border-white/20 shadow-2xl`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl text-sky-200 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]">♖</span>
                  <span className="px-3 py-1 rounded-full bg-sky-500/25 text-sky-200 border border-sky-400/50 text-xs font-bold uppercase tracking-wider">
                    5 Points Heavy
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">The Bastion Rook</h3>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  The siege tower of the army. Dominates open and semi-open files, seizes control of the devastating 7th rank, and coordinates deadly doubled batteries across ranks.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-sky-200 font-bold">
                <span>Value: 5 Points</span>
                <span>Role: Open Files &amp; 7th Rank</span>
              </div>
            </div>

            {/* The Knight */}
            <div className={`spotlight-card ${t.cardHoverClass} p-7 rounded-3xl flex flex-col justify-between bg-[#151124]/95 border border-white/20 shadow-2xl`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">♘</span>
                  <span className="px-3 py-1 rounded-full bg-amber-400/25 text-amber-200 border border-amber-400/50 text-xs font-bold uppercase tracking-wider">
                    3 Points Minor
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">The Runic Knight</h3>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  The geometric phantom. The only piece capable of leaping over comrades and foes. Thrives in closed positions, anchors unshakeable outposts on d5/e5, and executes lethal royal forks.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-amber-200 font-bold">
                <span>Value: 3 Points</span>
                <span>Role: Closed Games &amp; Forks</span>
              </div>
            </div>

            {/* The Bishop */}
            <div className={`spotlight-card ${t.cardHoverClass} p-7 rounded-3xl flex flex-col justify-between bg-[#151124]/95 border border-white/20 shadow-2xl`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl text-rose-200 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">♗</span>
                  <span className="px-3 py-1 rounded-full bg-rose-500/25 text-rose-200 border border-rose-400/50 text-xs font-bold uppercase tracking-wider">
                    3.25 Points Minor
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">The Mystic Bishop</h3>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  The diagonal sniper. Rakes across the entire board from afar. When paired as the Bishop Pair in an open endgame, they control all 64 squares with harmonic synchronization.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-rose-200 font-bold">
                <span>Value: 3.25 Points</span>
                <span>Role: Long-Range Diagonals</span>
              </div>
            </div>

            {/* The Pawn */}
            <div className={`spotlight-card ${t.cardHoverClass} p-7 rounded-3xl flex flex-col justify-between bg-[#151124]/95 border border-white/20 shadow-2xl`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl text-emerald-200 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">♙</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 text-xs font-bold uppercase tracking-wider">
                    1 Point Destiny
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">The Vanguard Pawn</h3>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  The soul of chess, as Philidor famously declared. Smallest in material, yet the creator of all pawn structure architecture. Every step brings it closer to coronation on the 8th rank.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-emerald-200 font-bold">
                <span>Value: 1 Pt (Queen in Waiting)</span>
                <span>Role: Structure &amp; Promotion</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE FOUR PILLARS OF CHESS STRATEGY (ORIGINKIT TABBED MATRIX) */}
        <section className="bg-[#140f24]/95 border border-white/20 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
              The Grandmaster Codex
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white mt-1 mb-2">
              The Four Pillars of Strategy
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 font-medium">
              Explore the core classical disciplines that separate casual players from master tacticians.
            </p>
          </div>

          {/* Interactive OriginKit Style Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 p-1.5 rounded-2xl bg-black/60 border border-white/15 max-w-2xl mx-auto">
            {[
              { id: 'openings', label: 'Opening Principles', icon: '🏛️' },
              { id: 'tactics', label: 'Tactical Motifs', icon: '⚔️' },
              { id: 'structure', label: 'Pawn Architecture', icon: '🛡️' },
              { id: 'endgame', label: 'Endgame Mastery', icon: '👑' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveStrategyTab(tab.id)}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 origin-spring flex items-center justify-center gap-1.5 ${
                  activeStrategyTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500/35 to-purple-600/35 border border-amber-400 text-amber-200 shadow-xl'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="bg-black/50 border border-white/15 rounded-2xl p-6 sm:p-8">
            {activeStrategyTab === 'openings' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 origin-slide-up">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-mono text-amber-300 text-xs font-bold mb-1">RULE I</div>
                  <h4 className="font-serif text-lg font-bold text-white mb-2">Seize The Center Squares</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    Dominate e4, d4, e5, and d5. Pieces anchored in the center command twice as many squares as pieces pushed to the rim.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-mono text-amber-300 text-xs font-bold mb-1">RULE II</div>
                  <h4 className="font-serif text-lg font-bold text-white mb-2">Knights Before Bishops</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    Develop minor pieces rapidly toward central outposts. Avoid wasting tempo moving the same piece repeatedly in the opening moves.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-mono text-amber-300 text-xs font-bold mb-1">RULE III</div>
                  <h4 className="font-serif text-lg font-bold text-white mb-2">Castle Into Sanctuary</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    Tuck the monarch safely into a castled fortress behind an intact pawn shield before opening central files for battle.
                  </p>
                </div>
              </div>
            )}

            {activeStrategyTab === 'tactics' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 origin-slide-up">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-mono text-purple-300 text-xs font-bold mb-1">TACTIC I</div>
                  <h4 className="font-serif text-lg font-bold text-white mb-2">The Absolute Pin</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    Freezing an enemy defender directly in line with their king. A pinned piece is mathematically paralyzed and unable to move.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-mono text-purple-300 text-xs font-bold mb-1">TACTIC II</div>
                  <h4 className="font-serif text-lg font-bold text-white mb-2">The Royal Fork</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    A single knight or pawn attacking two pieces simultaneously — most lethally striking King and Queen at once with no escape.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-mono text-purple-300 text-xs font-bold mb-1">TACTIC III</div>
                  <h4 className="font-serif text-lg font-bold text-white mb-2">The Deflection Sacrifice</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    Offering high material to drag a vital guardian square away from the enemy king, opening the floodgates for checkmate.
                  </p>
                </div>
              </div>
            )}

            {activeStrategyTab === 'structure' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 origin-slide-up">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-mono text-sky-300 text-xs font-bold mb-1">STRUCTURE I</div>
                  <h4 className="font-serif text-lg font-bold text-white mb-2">The Passed Pawn</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    A pawn with no opposing enemy pawns on its file or adjacent files. In Nimzowitsch&apos;s words: A passed pawn is a criminal that must be kept under lock and key.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-mono text-sky-300 text-xs font-bold mb-1">STRUCTURE II</div>
                  <h4 className="font-serif text-lg font-bold text-white mb-2">Isolated Pawn Weaknesses</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    Pawns stripped of friendly neighbor pawns on adjoining files become permanent structural targets in endgames.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-mono text-sky-300 text-xs font-bold mb-1">STRUCTURE III</div>
                  <h4 className="font-serif text-lg font-bold text-white mb-2">Pawn Chains &amp; Bases</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    Diagonal chains protect their heads; attacking the vulnerable base dismantles the entire defensive wall.
                  </p>
                </div>
              </div>
            )}

            {activeStrategyTab === 'endgame' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 origin-slide-up">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-mono text-emerald-300 text-xs font-bold mb-1">ENDGAME I</div>
                  <h4 className="font-serif text-lg font-bold text-white mb-2">King Activation</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    With queens traded, the king ceases hiding. An active king rushing to the center is worth four pawns in the final battle.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-mono text-emerald-300 text-xs font-bold mb-1">ENDGAME II</div>
                  <h4 className="font-serif text-lg font-bold text-white mb-2">The Opposition</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    Placing the king directly across from the enemy monarch separated by one square. Taking the opposition forces the foe to yield ground.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-mono text-emerald-300 text-xs font-bold mb-1">ENDGAME III</div>
                  <h4 className="font-serif text-lg font-bold text-white mb-2">Zugzwang</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    The deadly condition of compulsory move where every legal move available worsens the position and surrenders the game.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: INTERACTIVE CHESS BOARD GEOMETRY & COORDINATES GUIDE (REACTBITS COMPONENT) */}
        <section className="bg-[#120e21]/95 border border-white/20 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
              Board Geometry Guide
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white mt-1 mb-2">
              The Geography of 64 Squares
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 font-medium">
              Understand the strategic topography of files, ranks, diagonals, and the four sacred central squares.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Board Coordinate Map */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="bg-[#1a1429] p-3 rounded-2xl border border-amber-400/40 shadow-2xl">
                <div className="grid grid-cols-8 gap-1 w-64 h-64 sm:w-72 sm:h-72">
                  {Array.from({ length: 64 }).map((_, idx) => {
                    const row = Math.floor(idx / 8);
                    const col = idx % 8;
                    const isLight = (row + col) % 2 === 0;
                    const isCenter = (row === 3 || row === 4) && (col === 3 || col === 4);
                    const is7thRank = row === 1;
                    const isFlank = col === 0 || col === 7;

                    let highlightClass = isLight ? 'bg-[#d8d0c5]/25' : 'bg-[#282136]';
                    if (activeGeometryTab === 'center' && isCenter) {
                      highlightClass = 'bg-amber-400/50 ring-2 ring-amber-400 shadow-[0_0_12px_#f59e0b]';
                    } else if (activeGeometryTab === 'seventh' && is7thRank) {
                      highlightClass = 'bg-purple-500/50 ring-2 ring-purple-400 shadow-[0_0_12px_#a855f7]';
                    } else if (activeGeometryTab === 'flanks' && isFlank) {
                      highlightClass = 'bg-sky-500/50 ring-2 ring-sky-400 shadow-[0_0_12px_#38bdf8]';
                    } else if (activeGeometryTab === 'diagonals' && row === col) {
                      highlightClass = 'bg-emerald-500/50 ring-2 ring-emerald-400 shadow-[0_0_12px_#34d399]';
                    }

                    return (
                      <div
                        key={idx}
                        className={`rounded-[3px] transition-all duration-300 flex items-center justify-center text-[10px] font-mono text-white/70 ${highlightClass}`}
                      >
                        {isCenter && activeGeometryTab === 'center' ? '✦' : ''}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-[11px] text-amber-200 mt-3 font-mono font-bold">
                Interactive Sector Visualization
              </div>
            </div>

            {/* Geometric Sector Information */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'center', label: 'The Four Central Squares', desc: 'e4, d4, e5, d5' },
                  { id: 'seventh', label: 'The 7th Rank (Slaughterhouse)', desc: 'Rook Dominance' },
                  { id: 'flanks', label: 'The A & H Flank Files', desc: 'Rook & Pawn Levers' },
                  { id: 'diagonals', label: 'The Long Diagonals', desc: 'Bishop Highways' }
                ].map(sector => (
                  <button
                    key={sector.id}
                    onClick={() => setActiveGeometryTab(sector.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 origin-spring ${
                      activeGeometryTab === sector.id
                        ? 'bg-gradient-to-r from-amber-500/25 to-purple-600/25 border-amber-400 text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="text-xs font-bold">{sector.label}</div>
                    <div className="text-[10px] text-amber-300 font-mono mt-0.5">{sector.desc}</div>
                  </button>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/15">
                {activeGeometryTab === 'center' && (
                  <div>
                    <h4 className="font-serif text-lg font-bold text-amber-300 mb-2">The High Ground: e4, d4, e5, d5</h4>
                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                      Control of the center dictates the pace of the battle. A knight on e4 commands 8 squares, while a knight on a1 commands only 2. The player who anchors pawns on the center squares restricts the mobility of the opposing army.
                    </p>
                  </div>
                )}
                {activeGeometryTab === 'seventh' && (
                  <div>
                    <h4 className="font-serif text-lg font-bold text-purple-300 mb-2">The 7th Rank: Nimzowitsch&apos;s Blind Swine</h4>
                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                      Invading the 7th rank with a rook (or doubled rooks) attacks the enemy pawn baseline, paralyzes unpromoted pieces, and threatens devastating mating nets against the enemy king.
                    </p>
                  </div>
                )}
                {activeGeometryTab === 'flanks' && (
                  <div>
                    <h4 className="font-serif text-lg font-bold text-sky-300 mb-2">Flank Operations: Wing Attacks</h4>
                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                      When the center is locked with rigid pawn chains, battles shift to the flanks. Queenside expansion targets structural weaknesses, while kingside pawn storms seek to expose the opposing monarch.
                    </p>
                  </div>
                )}
                {activeGeometryTab === 'diagonals' && (
                  <div>
                    <h4 className="font-serif text-lg font-bold text-emerald-300 mb-2">Long Diagonals: The a1-h8 Highways</h4>
                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                      Fianchettoed bishops on g2/b2 or g7/b7 cast long laser-like vision across the board, exerting perpetual tactical pressure without ever stepping into vulnerable central crossfire.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: LEGENDARY HISTORIC OPENINGS (SPOTLIGHT CARDS) */}
        <section className="flex flex-col gap-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
              The Grandmaster Repertoire
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white mt-1 mb-3">
              Legendary Historic Openings
            </h2>
            <p className="text-sm sm:text-base text-slate-100 font-medium">
              Centuries of tactical clashes distilled into celebrated opening systems played by world champions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sicilian */}
            <div className={`spotlight-card ${t.cardHoverClass} p-7 rounded-3xl bg-[#151124]/95 border border-white/20 shadow-2xl flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-amber-300 text-xs font-bold">1.e4 c5</span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-400/25 text-amber-200 text-[10px] font-bold">
                    Sharpest Asymmetry
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-2">The Sicilian Defense</h3>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  The counter-attacker&apos;s weapon of choice. Black immediately challenges White&apos;s center from the c-file, creating dynamic imbalances and razor-sharp tactical shootouts.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/15 text-[11px] text-amber-300 font-mono font-bold">
                Favored by: Garry Kasparov, Bobby Fischer
              </div>
            </div>

            {/* Queen's Gambit */}
            <div className={`spotlight-card ${t.cardHoverClass} p-7 rounded-3xl bg-[#151124]/95 border border-white/20 shadow-2xl flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-purple-300 text-xs font-bold">1.d4 d5 2.c4</span>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/25 text-purple-200 text-[10px] font-bold">
                    Positional Classic
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-2">The Queen&apos;s Gambit</h3>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  White offers a temporary wing pawn on c4 to divert Black&apos;s d5 anchor and seize total central control with pawns on e4 and d4.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/15 text-[11px] text-purple-300 font-mono font-bold">
                Favored by: Magnus Carlsen, Anatoly Karpov
              </div>
            </div>

            {/* Ruy Lopez */}
            <div className={`spotlight-card ${t.cardHoverClass} p-7 rounded-3xl bg-[#151124]/95 border border-white/20 shadow-2xl flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sky-300 text-xs font-bold">1.e4 e5 2.Nf3 Nc6 3.Bb5</span>
                  <span className="px-2.5 py-1 rounded-full bg-sky-500/25 text-sky-200 text-[10px] font-bold">
                    The Spanish Game
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-2">The Ruy Lopez</h3>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  Five hundred years of classical mastery. The bishop on b5 puts pressure on the knight defending e5, weaving a deep web of positional tension.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/15 text-[11px] text-sky-300 font-mono font-bold">
                Favored by: José Raúl Capablanca, Viswanathan Anand
              </div>
            </div>

            {/* King's Indian */}
            <div className={`spotlight-card ${t.cardHoverClass} p-7 rounded-3xl bg-[#151124]/95 border border-white/20 shadow-2xl flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-rose-300 text-xs font-bold">1.d4 Nf6 2.c4 g6</span>
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/25 text-rose-200 text-[10px] font-bold">
                    Hypermodern Attack
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-2">The King&apos;s Indian</h3>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  Black grants White the entire center, only to strike back with an explosive kingside pawn avalanche, sacrificing pieces to corner the enemy monarch.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/15 text-[11px] text-rose-300 font-mono font-bold">
                Favored by: Garry Kasparov, Hikaru Nakamura
              </div>
            </div>

            {/* French Defense */}
            <div className={`spotlight-card ${t.cardHoverClass} p-7 rounded-3xl bg-[#151124]/95 border border-white/20 shadow-2xl flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-emerald-300 text-xs font-bold">1.e4 e6 2.d4 d5</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/25 text-emerald-200 text-[10px] font-bold">
                    Solid Counter
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-2">The French Defense</h3>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  A fortress of interlocking pawns. Black absorbs White&apos;s central aggression and strikes back on the queenside with moves like c5 and Qb6.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/15 text-[11px] text-emerald-300 font-mono font-bold">
                Favored by: Mikhail Botvinnik, Viktor Korchnoi
              </div>
            </div>

            {/* Italian Game */}
            <div className={`spotlight-card ${t.cardHoverClass} p-7 rounded-3xl bg-[#151124]/95 border border-white/20 shadow-2xl flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-amber-300 text-xs font-bold">1.e4 e5 2.Nf3 Nc6 3.Bc4</span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-400/25 text-amber-200 text-[10px] font-bold">
                    Giuoco Piano
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-2">The Italian Game</h3>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  Targeting the weakest point in Black&apos;s camp — the f7 square defended only by the king. Allows rapid development and harmonious piece coordination.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/15 text-[11px] text-amber-300 font-mono font-bold">
                Favored by: Fabiano Caruana, Wesley So
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: FOUR IMMORTAL GAMES OF CHESS HISTORY (ORIGINKIT HERITAGE SHOWCASE) */}
        <section className="bg-[#140f24]/95 border border-white/20 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
              The Hall of Masterpieces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white mt-1 mb-2">
              Four Immortal Games in History
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 font-medium">
              Four immortal encounters etched into the memory of every chess enthusiast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-black/60 border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif text-lg font-bold text-amber-300">The Immortal Game</span>
                  <span className="text-xs font-mono text-amber-200/90 font-bold">London, 1851</span>
                </div>
                <div className="text-xs font-semibold text-purple-200 mb-2">Adolf Anderssen vs. Lionel Kieseritzky</div>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  Anderssen famously sacrificed a bishop, both rooks, and finally his queen to deliver a breathtaking checkmate with his two minor knights and remaining bishop.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-amber-300">
                Key Move: 22.Qf6+! Nxf6 23.Be7# (Checkmate)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/60 border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif text-lg font-bold text-purple-300">The Opera Game</span>
                  <span className="text-xs font-mono text-purple-200/90 font-bold">Paris, 1858</span>
                </div>
                <div className="text-xs font-semibold text-amber-200 mb-2">Paul Morphy vs. Duke of Brunswick &amp; Count Isouard</div>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  The quintessential demonstration of rapid piece mobilization. Morphy used pins, open lines, and a spectacular queen sacrifice on b8 to deliver mate with rook and bishop.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-purple-300">
                Key Move: 16.Qb8+! Nxb8 17.Rd8# (Checkmate)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/60 border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif text-lg font-bold text-sky-300">Game of the Century</span>
                  <span className="text-xs font-mono text-sky-200/90 font-bold">New York, 1956</span>
                </div>
                <div className="text-xs font-semibold text-sky-200 mb-2">Bobby Fischer (Age 13) vs. Donald Byrne</div>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  Thirteen-year-old Bobby Fischer shocked the world with 17...Be6!!, sacrificing his queen to launch an unstoppable windmill of discovered checks by his bishop and rook.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-sky-300">
                Key Move: 17...Be6!! (Brilliant Queen Sacrifice)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/60 border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif text-lg font-bold text-emerald-300">Kasparov&apos;s Immortal</span>
                  <span className="text-xs font-mono text-emerald-200/90 font-bold">Wijk aan Zee, 1999</span>
                </div>
                <div className="text-xs font-semibold text-emerald-200 mb-2">Garry Kasparov vs. Veselin Topalov</div>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  Kasparov executed 24.Rxd4!!, triggering an exhilarating combination that dragged Topalov&apos;s monarch across the entire length of the board from c8 to a1.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-emerald-300">
                Key Move: 24.Rxd4!! (Towering King Hunt)
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: THE ANATOMY OF A CHECKMATE */}
        <section className="flex flex-col gap-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
              The Climax of the Battle
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white mt-1 mb-3">
              The Art of the Checkmate
            </h2>
            <p className="text-sm sm:text-base text-slate-100 font-medium">
              Checkmate is the ultimate finality. Every piece contributes to suffocating the enemy monarch until no square remains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#151124]/95 border border-white/20 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 mb-4 font-serif font-black text-xl">
                ♘#
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">The Smothered Mate</h3>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                The monarch is completely imprisoned by his own loyal defenders. A solitary knight leaps forward delivering checkmate through the suffocated royal ranks.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#151124]/95 border border-white/20 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-300 mb-4 font-serif font-black text-xl">
                ♗#
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">The Greek Gift Sacrifice</h3>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                Bxh7+! The bishop gives its life to shatter the castle wall, allowing the knight and queen to rush into the breached royal sanctuary.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#151124]/95 border border-white/20 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-300 mb-4 font-serif font-black text-xl">
                ♖#
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Anastasia&apos;s Mate</h3>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                A knight on e7 cuts off the royal escape squares while a rook charges down the h-file to deliver the fatal blow against the trapped monarch.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 7: TIME CONTROLS OF THE ROYAL GAME (REACTBITS TEMPO CARDS) */}
        <section className="bg-[#140f24]/95 border border-white/20 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
              The Clocks of Destiny
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white mt-1 mb-2">
              Time Controls of Classical Chess
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 font-medium">
              From the profound depths of classical calculation to the heart-pounding intensity of blitz battles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-black/60 border border-white/15">
              <div className="text-amber-300 font-serif font-bold text-base mb-1">Classical</div>
              <div className="text-xs text-amber-200/90 font-mono mb-2">90+ Minutes</div>
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                The championship standard. Unlimited time to calculate 15 moves ahead and construct immortal artistic combinations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/60 border border-white/15">
              <div className="text-purple-300 font-serif font-bold text-base mb-1">Rapid</div>
              <div className="text-xs text-purple-200/90 font-mono mb-2">15 to 25 Minutes</div>
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                The ideal blend of deep strategic planning and relentless clock management under escalating time pressure.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/60 border border-white/15">
              <div className="text-sky-300 font-serif font-bold text-base mb-1">Blitz</div>
              <div className="text-xs text-sky-200/90 font-mono mb-2">3 to 5 Minutes</div>
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                Pure tactical sharpness. Rely on subconscious pattern recognition, sharp reflexes, and ruthless calculation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/60 border border-white/15">
              <div className="text-rose-300 font-serif font-bold text-base mb-1">Bullet</div>
              <div className="text-xs text-rose-200/90 font-mono mb-2">1 to 2 Minutes</div>
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                Lightning speed. Every fraction of a second counts as players execute dozens of moves with lightning-fast intuition.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 8: THE HALL OF GRANDMASTER WISDOM */}
        <section className="bg-[#130f20]/95 border border-white/20 rounded-3xl p-8 sm:p-12 backdrop-blur-2xl shadow-2xl">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
              Words of the Immortals
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white mt-1 mb-3">
              Grandmaster Insights
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 font-medium">
              Timeless philosophy from champions who conquered the 64 squares.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-black/60 border border-white/15 flex flex-col justify-between">
              <Quote className="w-8 h-8 text-amber-400/40 mb-3" />
              <p className="text-sm sm:text-base text-slate-100 italic leading-relaxed mb-4 font-medium">
                &ldquo;You must take your opponent into a deep dark forest where 2+2=5, and the path leading out is only wide enough for one.&rdquo;
              </p>
              <div className="text-xs font-bold text-amber-300 font-serif">
                — Mikhail Tal (The Magician from Riga, 8th World Champion)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/60 border border-white/15 flex flex-col justify-between">
              <Quote className="w-8 h-8 text-purple-400/40 mb-3" />
              <p className="text-sm sm:text-base text-slate-100 italic leading-relaxed mb-4 font-medium">
                &ldquo;Chess is mental torture. It demands intense concentration, deep calculation, and the courage to make decisions under relentless clock pressure.&rdquo;
              </p>
              <div className="text-xs font-bold text-purple-300 font-serif">
                — Garry Kasparov (13th World Champion)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/60 border border-white/15 flex flex-col justify-between">
              <Quote className="w-8 h-8 text-sky-400/40 mb-3" />
              <p className="text-sm sm:text-base text-slate-100 italic leading-relaxed mb-4 font-medium">
                &ldquo;I give ninety-eight percent of my mental energy to chess. Others give only two percent.&rdquo;
              </p>
              <div className="text-xs font-bold text-sky-300 font-serif">
                — Bobby Fischer (11th World Champion)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/60 border border-white/15 flex flex-col justify-between">
              <Quote className="w-8 h-8 text-emerald-400/40 mb-3" />
              <p className="text-sm sm:text-base text-slate-100 italic leading-relaxed mb-4 font-medium">
                &ldquo;In order to improve your game, you must study the endgame before anything else; for whereas the endings can be studied and mastered by themselves, the middlegame and opening must be studied in relation to the endgame.&rdquo;
              </p>
              <div className="text-xs font-bold text-emerald-300 font-serif">
                — José Raúl Capablanca (The Chess Machine, 3rd World Champion)
              </div>
            </div>
          </div>
        </section>
          </div>
        )}

        {/* SECTION 9: CALL TO BATTLE FINALE BANNER */}
        <section className={`p-8 sm:p-14 rounded-3xl text-center bg-gradient-to-r ${
          landingTheme === 'royal-gold'
            ? 'from-amber-950/80 via-[#181326]/98 to-amber-950/80 border-amber-400/50'
            : landingTheme === 'gothic-obsidian'
            ? 'from-purple-950/80 via-[#181326]/98 to-rose-950/80 border-purple-500/50'
            : 'from-sky-950/80 via-[#181326]/98 to-indigo-950/80 border-sky-400/50'
        } border shadow-2xl backdrop-blur-2xl flex flex-col items-center gap-6`}>
          <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.4)]">
            <Crown className="w-8 h-8" />
          </div>
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-white mb-3">
              Step Onto The 64 Squares
            </h2>
            <p className="text-sm sm:text-lg text-slate-100 font-medium leading-relaxed">
              Whether you open with 1.e4 or 1.d4, your journey to chess mastery begins with a single move. Enter the Grand Hall and make your stand.
            </p>
          </div>
          <button
            onClick={currentUser ? onEnterLobby : onOpenAuth}
            className={`px-10 py-4 rounded-2xl text-sm sm:text-base font-extrabold tracking-widest uppercase transition origin-spring flex items-center gap-3 shadow-2xl ${t.btnGradient}`}
          >
            <Swords className="w-5 h-5 fill-current" />
            <span>{currentUser ? 'Enter Grand Hall Now' : 'Claim Your Board'}</span>
          </button>
        </section>

        {/* FOOTER */}
        <footer className="pt-8 border-t border-white/20 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="font-serif text-white font-bold">Chronicles of Wizard&apos;s Chess</span>
            <span>&bull; Dedicated to the Royal Game</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span>The Art of Calculation</span>
            <span>•</span>
            <span>Strategy &amp; Tactics</span>
            <span>•</span>
            <span>Grandmaster Heritage</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

/**
 * 2. AUTHENTICATION & QUICK PASS MODAL
 */
export function AuthGateModal({
  isOpen,
  onClose,
  onLoginSuccess,
  authKey,
  setAuthKey,
  authUsername,
  setAuthUsername,
  authHouse,
  setAuthHouse
}) {
  if (!isOpen) return null;

  const DEFAULT_KEY = 'ARCHMAGE-2026-TITAN-GOLD';
  const DEFAULT_USER = 'Archmage_Aurelius';

  const handleQuickDemoLogin = () => {
    onLoginSuccess({
      username: DEFAULT_USER,
      house: authHouse || 'Alabaster Archmage',
      rank: 'Grandmaster (2450 ELO)',
      key: DEFAULT_KEY
    });
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    onLoginSuccess({
      username: authUsername || DEFAULT_USER,
      house: authHouse || 'Alabaster Archmage',
      rank: 'Grandmaster (2450 ELO)',
      key: authKey || DEFAULT_KEY
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl origin-scale-in">
      <div className="relative w-full max-w-lg bg-[#151124]/98 border border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-white">
        {/* Glow accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Grandmaster Hall Sanctum Pass</h2>
              <p className="text-[11px] text-slate-300">Authenticating into the Grandmaster Realm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
          >
            &times;
          </button>
        </div>

        {/* Quick 1-Click Access Pill */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-amber-200 font-bold">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400 fill-current" />
              <span>Production Passkey Loaded</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-[10px] font-mono text-amber-300 font-bold">
              VERIFIED
            </span>
          </div>
          <p className="text-xs text-slate-200">
            Use the default credentials to instantly enter the Grand Hall and challenge opponents.
          </p>
          <button
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg origin-spring flex items-center justify-center gap-2 mt-1"
          >
            <span>⚡ Enter as Grandmaster (Default Key)</span>
          </button>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Archmage Passkey
            </label>
            <input
              type="text"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              placeholder="e.g. ARCHMAGE-2026-TITAN-GOLD"
              className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-amber-400/70"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Commander Name
            </label>
            <input
              type="text"
              value={authUsername}
              onChange={(e) => setAuthUsername(e.target.value)}
              placeholder="e.g. Archmage_Aurelius"
              className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400/70"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Select Your House
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Alabaster Archmage', label: 'Alabaster', icon: '👑' },
                { id: 'Obsidian Sovereign', label: 'Obsidian', icon: '🔮' },
                { id: 'Celestial Enclave', label: 'Celestial', icon: '⚡' }
              ].map(h => (
                <button
                  type="button"
                  key={h.id}
                  onClick={() => setAuthHouse(h.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition origin-spring flex flex-col items-center gap-1 ${
                    authHouse === h.id
                      ? 'bg-purple-500/35 border-amber-400/70 text-amber-200 shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="text-base">{h.icon}</span>
                  <span className="text-[11px]">{h.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition origin-spring"
            >
              Enter With Custom Key
            </button>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold"
            >
              Guest Play
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * 3. LOBBY & GAME MODE SELECTION PAGE
 */
export function LobbyPage({
  currentUser,
  gameMode,
  setGameMode,
  playerColor,
  setPlayerColor,
  aiDifficulty,
  setAiDifficulty,
  onStartGame,
  onBackToLanding,
  onLogout,
  wizardsDirectory = [],
  friendSearchQuery = '',
  setFriendSearchQuery = () => {},
  friendSearchResults = [],
  searchLoading = false,
  onAddFriend = () => {},
  onInviteFriend = () => {},
  incomingInvite = null,
  onAcceptInvite = () => {},
  onDeclineInvite = () => {}
}) {
  return (
    <div className="fixed inset-0 z-20 overflow-y-auto overflow-x-hidden text-[#f8fafc] font-sans selection:bg-amber-400 selection:text-black bg-black/55 backdrop-blur-[3px]">
      {/* Top Banner with Clear Navigation */}
      <header className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3 bg-[#0d0a17]/95 backdrop-blur-2xl border-b border-white/20 flex items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition origin-spring"
            title="Return to Home Screen"
          >
            <ArrowLeft className="w-4 h-4 text-amber-300" />
            <span>Back to Home</span>
          </button>
          <div className="hidden sm:block">
            <div className="font-serif font-bold text-sm text-white flex items-center gap-2">
              <span>WAR CHAMBER</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono font-bold">
                LOBBY
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-semibold tracking-wider uppercase">
              Select your mode and launch into the 3D match
            </p>
          </div>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white">@{currentUser?.username || 'Guest'}</span>
            <span className="text-[10px] text-amber-300 font-semibold">{currentUser?.house || 'Sanctum Initiate'}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/30 to-amber-400/30 border border-amber-400/50 flex items-center justify-center font-bold text-xs text-amber-200 shadow-md">
            GM
          </div>
          <button
            onClick={onLogout}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-[11px] text-slate-200 hover:text-white transition"
          >
            Switch
          </button>
        </div>
      </header>

      {/* Main Mode Picker Stage (Clean, Compact & Easy to Navigate) */}
      <main className="max-w-4xl mx-auto px-4 py-5 sm:py-7 flex flex-col items-center gap-5 origin-slide-up">
        {/* Simple 3-Step Navigation Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-slate-300 bg-black/50 px-5 py-2 rounded-full border border-white/15 backdrop-blur-md shadow-lg">
          <span className="flex items-center gap-1.5 text-amber-300 font-extrabold">
            <span className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-black">1</span>
            Select Mode
          </span>
          <span className="text-slate-500">→</span>
          <span className={`flex items-center gap-1.5 ${gameMode === 'ai' ? 'text-amber-200 font-extrabold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full ${gameMode === 'ai' ? 'bg-amber-400/30 border border-amber-400 text-amber-200' : 'bg-white/10 text-slate-400'} flex items-center justify-center text-[10px] font-black`}>2</span>
            Side &amp; Level
          </span>
          <span className="text-slate-500">→</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-extrabold">
            <span className="w-5 h-5 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-300 flex items-center justify-center text-[10px] font-black">3</span>
            Play!
          </span>
        </div>

        {/* Clear Title */}
        <div className="text-center max-w-xl">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-tight">
            Choose Your Game Mode
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Select who you want to challenge, configure your side, then click Start Game.
          </p>
        </div>

        {/* Mode Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
          {/* Card 1: Play vs AI */}
          <div
            onClick={() => setGameMode('ai')}
            className={`p-5 sm:p-6 rounded-3xl cursor-pointer transition-all duration-300 origin-spring flex flex-col justify-between border ${
              gameMode === 'ai'
                ? 'bg-[#1e172e]/98 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                : 'bg-black/60 border-white/15 hover:border-white/30 hover:bg-black/75'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                      Play vs Computer
                    </h2>
                    <span className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">
                      Solo Match (AI)
                    </span>
                  </div>
                </div>
                {gameMode === 'ai' ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 text-xs font-bold flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Selected</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                    Click to select
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium mb-3">
                Play solo against the AI engine. Choose your piece color and skill level below.
              </p>
            </div>

            {/* AI Settings */}
            <div className="pt-3 border-t border-white/15 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1.5">
                  Your Piece Color
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setGameMode('ai'); setPlayerColor('w'); }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      playerColor === 'w'
                        ? 'bg-amber-400/30 border border-amber-400 text-amber-100 shadow'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="text-base">♔</span>
                    <span>White (1st Move)</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setGameMode('ai'); setPlayerColor('b'); }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      playerColor === 'b'
                        ? 'bg-purple-500/35 border border-purple-400 text-purple-200 shadow'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="text-base">♚</span>
                    <span>Black (AI 1st)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1.5">
                  AI Difficulty Level
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['easy', 'medium', 'hard', 'expert'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setGameMode('ai'); setAiDifficulty(d); }}
                      className={`py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                        aiDifficulty === d
                          ? 'bg-gradient-to-r from-amber-500/40 to-purple-600/40 border border-amber-400 text-amber-200 shadow'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Play vs AI Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGameMode('ai');
                  onStartGame();
                }}
                className="w-full mt-2 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:brightness-110 transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Game vs AI</span>
              </button>
            </div>
          </div>

          {/* Card 2: 2 Player / Local Duel */}
          <div
            onClick={() => setGameMode('2p')}
            className={`p-5 sm:p-6 rounded-3xl cursor-pointer transition-all duration-300 origin-spring flex flex-col justify-between border ${
              gameMode === '2p'
                ? 'bg-[#1e172e]/98 border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.25)] ring-1 ring-purple-400/50'
                : 'bg-black/60 border-white/15 hover:border-white/30 hover:bg-black/75'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                      Pass &amp; Play (2 Players)
                    </h2>
                    <span className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">
                      Same Device Duel
                    </span>
                  </div>
                </div>
                {gameMode === '2p' ? (
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/25 border border-purple-400 text-purple-200 text-xs font-bold flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Selected</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                    Click to select
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium mb-3">
                Play with a friend locally on this same screen. Both players take turns commanding White and Black.
              </p>

              {/* 2P Features List */}
              <div className="space-y-2 bg-white/5 rounded-2xl p-3 border border-white/10 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>White moves first, alternating turns automatically</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Dynamic camera perspectives with board flip</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Real-time legal move circles &amp; capture tallies</span>
                </div>
              </div>
            </div>

            {/* Direct Play 2P Button */}
            <div className="pt-3 border-t border-white/10 mt-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGameMode('2p');
                  onStartGame();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-purple-500 to-rose-500 text-white hover:brightness-110 transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start 2-Player Game</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Primary Action Button (Centered & Highly Prominent) */}
        <div className="w-full flex flex-col items-center gap-2 mt-1">
          <button
            onClick={onStartGame}
            className="w-full max-w-md py-4 rounded-2xl text-base font-black tracking-widest uppercase transition-all duration-300 origin-spring flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black hover:scale-105 shadow-[0_0_40px_rgba(245,158,11,0.55)] border border-amber-300 ring-2 ring-amber-400/40 cursor-pointer"
          >
            <Swords className="w-5 h-5 fill-current" />
            <span>
              {gameMode === 'ai' ? 'Enter 3D Arena vs AI' : 'Enter 3D Arena (2 Players)'}
            </span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
          <span className="text-[11px] text-slate-300 font-medium">
            Click to launch into the 3D Cathedral Sanctum
          </span>
        </div>

        {/* Step 3: Fellowship of Wizards & Online Challengers in Grand Hall */}
        <section className="w-full bg-[#14101e]/90 border border-amber-400/30 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-white/10 pb-4">
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>Fellowship of Wizards &amp; Challengers</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Connect with allies or practice against Order champions before entering the arena.
              </p>
            </div>
            {searchLoading && (
              <span className="text-xs text-amber-300 font-mono animate-pulse">Searching the Sanctum...</span>
            )}
          </div>

          {/* Search Bar to find & add players */}
          <div className="mb-5">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-amber-300 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={friendSearchQuery}
                onChange={e => setFriendSearchQuery(e.target.value)}
                placeholder="Find players by username prefix (e.g. Morgana, Cedric, Albus)..."
                className="w-full bg-black/50 border border-white/20 focus:border-amber-400/70 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white outline-none transition"
              />
            </div>
          </div>

          {/* Friends & Opponents Directory List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {(friendSearchResults.length > 0 ? friendSearchResults : wizardsDirectory).map(w => {
              const isFriend = wizardsDirectory.some(
                d => d.username.toLowerCase() === w.username.toLowerCase() && d.isFriend
              );
              return (
                <div
                  key={w.username}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-3 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white truncate">@{w.username}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium shrink-0">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            w.online
                              ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                              : 'bg-gray-500'
                          }`}
                        />
                        <span className={w.online ? 'text-emerald-300 font-medium' : 'text-gray-400'}>
                          {w.online ? 'Online' : 'Offline'}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-gray-300 mt-1 flex-wrap">
                      <span className="text-amber-200/90 font-medium truncate">{w.house}</span>
                      {w.isAiPractice && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-500/25 border border-purple-400/40 text-purple-200 text-[9px] font-bold">
                          AI Practice
                        </span>
                      )}
                      {isFriend && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[9px] font-bold">
                          Friend
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isFriend && (
                      <button
                        type="button"
                        onClick={() => onAddFriend(w.username)}
                        className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-gray-200 hover:text-white transition"
                        title="Add as Friend"
                      >
                        + Add
                      </button>
                    )}
                    {w.online ? (
                      <button
                        type="button"
                        onClick={() => onInviteFriend(w)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/30 to-purple-600/30 hover:from-amber-500/50 hover:to-purple-600/50 border border-amber-400/60 text-amber-100 text-xs font-bold transition shadow-md"
                        title={`Invite @${w.username} to a match`}
                      >
                        <Swords className="w-3.5 h-3.5 text-amber-300" />
                        <span>Invite to Match</span>
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-[11px]">
                        Offline
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Step 3: Incoming Duel Challenge Modal in Grand Hall */}
      {incomingInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#161224] border border-amber-400/50 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.35)] p-6 text-center text-white">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Swords className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-serif font-bold text-amber-100 mb-2">
              Duel Challenge Received!
            </h3>
            <p className="text-sm text-gray-200 mb-6 leading-relaxed">
              <strong>@{incomingInvite.from}</strong> has challenged you to a duel on the 64 squares!
              <br />
              <span className="text-xs text-amber-300/90 font-medium">House: {incomingInvite.house}</span>
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onDeclineInvite}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-gray-200 text-xs font-semibold transition"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => onAcceptInvite(incomingInvite)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black text-xs font-bold tracking-wide uppercase transition shadow-lg shadow-amber-500/40 hover:brightness-110"
              >
                Accept Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
