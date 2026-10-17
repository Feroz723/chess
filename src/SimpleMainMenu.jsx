import React, { useState } from 'react';
import {
  Bot, Users, Play, Crown, Volume2, Volume1, VolumeX,
  X, Check, Sparkles, User, LogIn, UserPlus,
  ArrowRight, ShieldCheck, ChevronRight, Clock
} from 'lucide-react';

/**
 * Clean & Simple Auth Modal:
 * Standard Username & Password + "Play as Guest"
 * No fantasy houses, no complex passkeys, zero confusion.
 */
export function SimpleAuthModal({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout
}) {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanUser = username.trim();
    if (!cleanUser || cleanUser.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/signup';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUser,
          passkey: password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem('wizards_jwt_token', data.token);
      }

      const userProfile = data.user || {
        username: cleanUser,
        house: 'Grandmaster',
        wins: 0,
        losses: 0,
        draws: 0
      };

      onLoginSuccess(userProfile);
      setSuccessMsg(tab === 'login' ? 'Signed in successfully!' : 'Account created successfully!');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      // Local offline fallback if backend server is not running
      const fallbackUser = {
        username: cleanUser,
        house: 'Player',
        wins: 0,
        losses: 0,
        draws: 0
      };
      onLoginSuccess(fallbackUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAsGuest = () => {
    onLoginSuccess({
      username: 'Guest_Player',
      house: 'Guest',
      isGuest: true,
      wins: 0,
      losses: 0,
      draws: 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#161224] border border-amber-400/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 mb-2 shadow">
            <Crown className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-bold text-white">
            {currentUser && !currentUser.isGuest ? 'Your Account' : 'Sign In to Save Progress'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Play matches, track your wins, and customize your experience.
          </p>
        </div>

        {/* If user is already logged in */}
        {currentUser && !currentUser.isGuest ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-xs text-slate-400">Signed in as</div>
              <div className="text-lg font-bold text-amber-300">@{currentUser.username}</div>
              <div className="text-xs text-slate-300 mt-2">
                Record: {currentUser.wins || 0} Wins &bull; {currentUser.losses || 0} Losses
              </div>
            </div>

            <button
              onClick={() => { onLogout(); onClose(); }}
              className="w-full py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold text-xs uppercase tracking-wider transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            {/* Simple Tab Selector: Log In vs Sign Up */}
            <div className="flex p-1 bg-black/60 rounded-xl border border-white/10 mb-4">
              <button
                type="button"
                onClick={() => { setTab('login'); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  tab === 'login'
                    ? 'bg-amber-400/25 border border-amber-400/60 text-amber-200 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                type="button"
                onClick={() => { setTab('signup'); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  tab === 'signup'
                    ? 'bg-amber-400/25 border border-amber-400/60 text-amber-200 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs text-center font-medium">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium">
                {successMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Alex_Chess"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none focus:border-amber-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Password (min 8 characters)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none focus:border-amber-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Please wait...' : tab === 'login' ? 'Sign In Now' : 'Create Account'}
              </button>
            </form>

            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-[#161224] px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                OR
              </span>
            </div>

            {/* Instant Guest Play Button */}
            <button
              type="button"
              onClick={handlePlayAsGuest}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>⚡ Play Instantly as Guest</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}



/**
 * INSTANT GAME MENU
 * Minimalist, ultra-clear main menu rendered over the live 3D board.
 * Fast, intuitive, and gets users playing in 1 click.
 */
export function SimpleMainMenu({
  onStartGame,
  gameMode,
  setGameMode,
  playerColor,
  setPlayerColor,
  aiDifficulty,
  setAiDifficulty,
  royalTheme,
  onSelectTheme,
  themesList = [],
  currentUser,
  onOpenAuth,
  isMuted,
  musicVolume,
  onToggleMute,
  onSetVolume,
  matchDurationMin = 10,
  onSetTimeControl = () => {}
}) {
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [showThemeVault, setShowThemeVault] = useState(false);
  const [themeFilter, setThemeFilter] = useState('all'); // 'all' | 'horror' | 'adventure' | 'action' | 'classic'

  const currentThemeObj = themesList.find(t => t.id === royalTheme) || themesList[0] || {};
  const filteredThemes = themesList.filter(t => {
    if (themeFilter === 'all') return true;
    if (themeFilter === 'classic') return !t.genre;
    return t.genre === themeFilter;
  });

  return (
    <div className="fixed inset-0 z-20 overflow-y-auto overscroll-contain flex flex-col justify-between p-3 sm:p-5 lg:p-7 xl:px-12 select-none pointer-events-auto">
      
      {/* Top Floating Utility Bar spanning across */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 pointer-events-auto shrink-0 mb-2 sm:mb-4">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-2.5 bg-[#0e0b17]/85 backdrop-blur-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/15 shadow-xl">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-amber-200 font-black shadow text-sm sm:text-base">
            ♔
          </div>
          <div>
            <div className="font-serif font-black text-xs sm:text-sm text-white tracking-wide leading-none">
              WIZARD&apos;S CHESS
            </div>
            <span className="text-[8px] sm:text-[9px] text-amber-300 font-bold tracking-widest uppercase">
              3D WEBGL ARENA
            </span>
          </div>
        </div>

        {/* Right Tools: Theme Vault Modal Button, Sound, Account */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Vault Launcher Pill */}
          <button
            type="button"
            onClick={() => setShowThemeVault(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500/25 via-purple-600/25 to-cyan-500/20 backdrop-blur-xl border border-amber-400/50 text-[11px] sm:text-xs font-bold text-amber-200 hover:brightness-125 transition shadow-lg cursor-pointer"
            title="Browse all 11 3D Arena Themes"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline font-mono uppercase tracking-wider text-[10px] text-amber-300/80">Realm:</span>
            <span className="font-extrabold capitalize">{currentThemeObj.shortName || currentThemeObj.name || royalTheme}</span>
            <ChevronRight className="w-3 h-3 text-amber-300/70" />
          </button>

          {/* Sound Mute Button */}
          <div className="relative">
            <button
              type="button"
              onClick={onToggleMute}
              className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition bg-[#0e0b17]/85 backdrop-blur-xl cursor-pointer ${
                isMuted || musicVolume === 0
                  ? 'border-red-500/40 text-red-400'
                  : 'border-white/15 text-amber-300 hover:border-amber-400/50'
              }`}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted || musicVolume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
              ) : musicVolume > 50 ? (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Volume1 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          </div>

          {/* User Account / Sign In */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#0e0b17]/85 backdrop-blur-xl border border-amber-400/40 text-xs font-bold text-amber-200 hover:bg-amber-400/20 transition shadow cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-amber-300" />
            <span className="max-w-[90px] sm:max-w-[120px] truncate">{currentUser && !currentUser.isGuest ? `@${currentUser.username}` : 'Sign In'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area: Left-Docked Royal Glass Launcher */}
      <main className="w-full max-w-md sm:max-w-lg lg:max-w-[480px] xl:max-w-[510px] mx-auto lg:mx-0 lg:ml-2 xl:ml-6 pointer-events-auto my-auto py-1 sm:py-2 shrink-0 animate-in slide-in-from-left-6 fade-in duration-300">
        
        {/* Royal Glassmorphism Chamber Card */}
        <div className="relative bg-gradient-to-br from-[#1b1233]/85 via-[#100a20]/90 to-[#070512]/95 backdrop-blur-2xl border border-amber-400/40 rounded-2xl sm:rounded-3xl p-3 sm:p-5 max-h-[calc(100dvh-4.5rem)] overflow-y-auto overflow-x-hidden shadow-[0_25px_80px_rgba(0,0,0,0.88),0_0_50px_rgba(245,158,11,0.15),inset_0_1px_2px_rgba(255,255,255,0.25)] text-white ring-1 ring-amber-400/25">
          
          {/* Top Royal Specular Edge Glow */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent pointer-events-none" />
          
          {/* Ambient Royal Back-Glows */}
          <div className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl -z-10" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl -z-10" />

          {/* Royal Crest Header */}
          <div className="relative flex items-center justify-between pb-2 mb-2.5 border-b border-amber-400/20">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400/30 to-purple-600/30 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow">
                <Crown className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-serif text-[11px] sm:text-xs font-black tracking-widest text-amber-200 uppercase">
                Grand Cathedral Duel
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-amber-300/90 tracking-wider bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ARENA READY</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-2.5 sm:mb-3">
            <h1 className="font-serif text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-white to-amber-200 tracking-tight leading-tight">
              Select Game Mode
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-300/90 mt-0.5">
              Jump straight into battle in 1 click.
            </p>
          </div>

          {/* SECTION 1: GAME MODES (Segoe UI Header with Neon Pill Selection) */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0c0a14]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)] mb-2.5">
            <div className="flex items-center justify-between text-xs font-semibold mb-2" style={{ fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif' }}>
              <span className="text-gray-200 uppercase tracking-wider text-[11px] sm:text-xs font-bold">GAME MODES</span>
              <span className="text-[11px] text-gray-400 font-normal">Segoe UI</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {/* Play vs AI */}
              <button
                type="button"
                onClick={() => setGameMode('ai')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  gameMode === 'ai'
                    ? 'border-2 border-cyan-400/90 bg-cyan-950/40 text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.45)]'
                    : 'bg-white/[0.04] border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="p-0.5 rounded bg-cyan-400/20 text-cyan-300">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Play vs AI</span>
              </button>

              {/* Pass & Play */}
              <button
                type="button"
                onClick={() => setGameMode('2p')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  gameMode === '2p'
                    ? 'border-2 border-purple-400/90 bg-purple-950/40 text-purple-200 shadow-[0_0_16px_rgba(192,132,252,0.45)]'
                    : 'bg-white/[0.04] border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">Pass &amp; Play</span>
              </button>

              {/* Online Match (Muted/Coming Soon) */}
              <button
                type="button"
                disabled
                className="py-2 px-2 rounded-xl text-xs font-bold bg-white/[0.02] border border-white/5 text-gray-500 cursor-not-allowed opacity-60 flex items-center justify-center"
              >
                <span className="truncate">Online Match</span>
              </button>
            </div>
          </div>

          {/* Piece Color Picker (When vs AI) */}
          {gameMode === 'ai' && (
            <div className="px-3 py-2 rounded-2xl bg-[#0c0a14]/70 border border-white/5 mb-2.5 flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px] uppercase tracking-wider font-semibold">Your Side:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPlayerColor('w')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    playerColor === 'w'
                      ? 'bg-amber-400/30 text-amber-200 border border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  ♔ White (1st)
                </button>
                <button
                  type="button"
                  onClick={() => setPlayerColor('b')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    playerColor === 'b'
                      ? 'bg-purple-500/35 text-purple-200 border border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  ♚ Black (2nd)
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: AI DIFFICULTY (Matching Pill Badges: Green Easy, Orange Medium, Red Hard, Glowing Gold Expert + Crown) */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0c0a14]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)] mb-2.5">
            <div className="flex items-center justify-between text-xs font-semibold mb-2.5" style={{ fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif' }}>
              <span className="text-gray-200 uppercase tracking-wider text-[11px] sm:text-xs font-bold">AI DIFFICULTY</span>
              <span className="text-amber-400 text-sm">👑</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {/* EASY: Green Pill */}
              <button
                type="button"
                onClick={() => setAiDifficulty('easy')}
                className={`py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wider transition cursor-pointer flex items-center justify-center border-2 ${
                  aiDifficulty === 'easy'
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.5)]'
                    : 'border-emerald-600/40 bg-emerald-950/20 text-emerald-500/80 hover:text-emerald-300 hover:border-emerald-500'
                }`}
              >
                EASY
              </button>

              {/* MEDIUM: Orange/Amber Pill */}
              <button
                type="button"
                onClick={() => setAiDifficulty('medium')}
                className={`py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wider transition cursor-pointer flex items-center justify-center border-2 ${
                  aiDifficulty === 'medium'
                    ? 'border-amber-500 bg-amber-950/60 text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.5)]'
                    : 'border-amber-600/40 bg-amber-950/20 text-amber-500/80 hover:text-amber-300 hover:border-amber-500'
                }`}
              >
                MEDIUM
              </button>

              {/* HARD: Deep Red Pill */}
              <button
                type="button"
                onClick={() => setAiDifficulty('hard')}
                className={`py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wider transition cursor-pointer flex items-center justify-center border-2 ${
                  aiDifficulty === 'hard'
                    ? 'border-red-500 bg-red-950/60 text-red-400 shadow-[0_0_16px_rgba(239,68,68,0.5)]'
                    : 'border-red-600/40 bg-red-950/20 text-red-500/80 hover:text-red-300 hover:border-red-500'
                }`}
              >
                HARD
              </button>

              {/* EXPERT: Glowing Golden Pill */}
              <button
                type="button"
                onClick={() => setAiDifficulty('expert')}
                className={`py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wider transition cursor-pointer flex items-center justify-center border-2 ${
                  aiDifficulty === 'expert'
                    ? 'border-yellow-400 bg-yellow-950/60 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.65)] ring-1 ring-yellow-400/50'
                    : 'border-yellow-500/40 bg-yellow-950/20 text-yellow-400/80 hover:text-yellow-200 hover:border-yellow-400'
                }`}
              >
                EXPERT
              </button>
            </div>
          </div>

          {/* SECTION 3: TIME CONTROL (BLITZ 3m, 5m Cyan Pill | RAPID 10m Gold Pill) */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0c0a14]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)] mb-2.5">
            <div className="flex items-center justify-between text-xs font-semibold mb-2.5" style={{ fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif' }}>
              <span className="text-gray-200 uppercase tracking-wider text-[11px] sm:text-xs font-bold">TIME CONTROL</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              {/* Blitz Group */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[11px] sm:text-xs font-bold tracking-wider text-gray-300 uppercase px-1">BLITZ</span>
                <button
                  type="button"
                  onClick={() => onSetTimeControl(3)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer border ${
                    matchDurationMin === 3
                      ? 'border-2 border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.55)]'
                      : 'border-white/10 bg-black/40 text-gray-400 hover:text-white'
                  }`}
                >
                  3m
                </button>
                <button
                  type="button"
                  onClick={() => onSetTimeControl(5)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer border ${
                    matchDurationMin === 5
                      ? 'border-2 border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.55)]'
                      : 'border-white/10 bg-black/40 text-gray-400 hover:text-white'
                  }`}
                >
                  5m
                </button>
              </div>

              {/* Rapid Group */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[11px] sm:text-xs font-bold tracking-wider text-gray-300 uppercase px-1">RAPID</span>
                <button
                  type="button"
                  onClick={() => onSetTimeControl(10)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer border ${
                    matchDurationMin === 10
                      ? 'border-2 border-yellow-400 bg-yellow-950/60 text-yellow-300 shadow-[0_0_16px_rgba(250,204,21,0.6)]'
                      : 'border-white/10 bg-black/40 text-gray-400 hover:text-white'
                  }`}
                >
                  10m
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 4: SOUNDTRACK & GLOWING GOLDEN SINUSOIDAL WAVEFORM WITH MUSICAL NOTES */}
          <div className="relative overflow-hidden p-3 sm:p-3.5 rounded-2xl bg-[#0c0a14]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)] mb-3">
            <div className="flex items-center justify-between text-xs mb-2" style={{ fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif' }}>
              <span className="text-gray-200 uppercase tracking-wider text-[11px] sm:text-xs font-bold">SOUNDTRACK</span>
              <span className="text-gray-400 text-[11px] font-normal truncate max-w-[190px]">
                {currentThemeObj.musicName || 'Cinematic Score'}
              </span>
            </div>

            {/* Glowing Golden Waveform with Floating Musical Notes */}
            <div className="relative h-14 sm:h-16 w-full flex items-center justify-center overflow-hidden rounded-xl bg-black/50 border border-amber-400/15">
              {/* Sinusoidal Wave SVG Ribbon with Dual Layer Glow */}
              <svg className="w-full h-full absolute inset-0 preserve-3d" viewBox="0 0 400 64" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="goldWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1" />
                    <stop offset="20%" stopColor="#fbbf24" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#fef08a" stopOpacity="1" />
                    <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.1" />
                  </linearGradient>
                  <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                {/* Background ambient ribbon */}
                <path
                  d="M0 32 Q 50 10, 100 32 T 200 32 T 300 32 T 400 32 L 400 64 L 0 64 Z"
                  fill="url(#goldWaveGrad)"
                  opacity="0.15"
                />
                {/* Secondary flowing harmonic wave */}
                <path
                  d="M0 32 Q 50 50, 100 32 T 200 32 T 300 32 T 400 32"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  opacity="0.6"
                  fill="none"
                />
                {/* Primary luminous sine wave with filter glow */}
                <path
                  d="M0 32 Q 50 8, 100 32 T 200 32 T 300 32 T 400 32"
                  stroke="url(#goldWaveGrad)"
                  strokeWidth="3.2"
                  filter="url(#waveGlow)"
                  fill="none"
                />
              </svg>

              {/* Floating Golden Musical Notes (♪, ♫, ♬, 𝄞) hovering organically over the wave */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-around px-3 text-amber-200/90 text-sm sm:text-base font-serif select-none">
                <span className="transform -translate-y-2 opacity-80 animate-pulse" style={{ animationDuration: '3s' }}>♪</span>
                <span className="transform translate-y-2 opacity-90 animate-bounce" style={{ animationDuration: '2.4s' }}>♫</span>
                <span className="transform -translate-y-3 opacity-95 text-lg font-bold" style={{ textShadow: '0 0 10px #fbbf24' }}>𝄞</span>
                <span className="transform translate-y-1 opacity-85 animate-pulse" style={{ animationDuration: '2.8s' }}>♬</span>
                <span className="transform -translate-y-1 opacity-70 animate-bounce" style={{ animationDuration: '3.2s' }}>♪</span>
                <span className="transform translate-y-3 opacity-80">𝄢</span>
                <span className="transform -translate-y-2 opacity-90 animate-pulse" style={{ animationDuration: '2.1s' }}>♫</span>
              </div>
            </div>
          </div>

          {/* Big Launch Button */}
          <button
            type="button"
            onClick={onStartGame}
            className="w-full py-2.5 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-black font-black text-xs sm:text-base uppercase tracking-wider sm:tracking-widest shadow-[0_0_35px_rgba(245,158,11,0.55),inset_0_1px_2px_rgba(255,255,255,0.7)] border border-amber-200 ring-2 ring-amber-400/40 transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <span>{gameMode === 'ai' ? 'Start Game vs AI' : 'Start 2-Player Game'}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
          </button>
        </div>
      </main>

      {/* Bottom Subtle Tagline */}
      <footer className="w-full max-w-7xl mx-auto flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400/80 pointer-events-none shrink-0 mt-2 px-1">
        <span>Grand Cathedral Arena • Living 3D Orbit</span>
        <span className="hidden lg:inline text-amber-300/60 font-mono text-[10px] uppercase tracking-wider">3D Real-time Visual Arena</span>
      </footer>

      {/* =========================================================================
          THEME VAULT REALM MODAL: Browse 11 Themes Across Categories
          ========================================================================= */}
      {showThemeVault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#1b1233] via-[#100a20] to-[#070512] border border-amber-400/40 rounded-3xl p-5 sm:p-6 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_60px_rgba(245,158,11,0.2)] text-white ring-1 ring-amber-400/30 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-black text-amber-100 leading-tight">
                    Cathedral Realm Vault
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Choose from 11 living 3D environments with dynamic fires &amp; orchestral soundtracks
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowThemeVault(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 py-3 shrink-0 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All 11 Realms' },
                { id: 'horror', label: '💀 Horror (2)' },
                { id: 'adventure', label: '🧭 Adventure (2)' },
                { id: 'action', label: '⚔️ Action / War (2)' },
                { id: 'classic', label: '👑 Classic (5)' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setThemeFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    themeFilter === cat.id
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto pr-1 my-1 flex-1">
              {filteredThemes.map(t => {
                const isSelected = royalTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onSelectTheme(t.id);
                      setShowThemeVault(false);
                    }}
                    className={`relative p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer group ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400/25 via-amber-500/15 to-purple-600/20 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                        : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-amber-400/40'
                    }`}
                  >
                    {/* Badge / Color Icon */}
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.badgeClass || 'from-amber-400 to-purple-600'} flex items-center justify-center text-white font-bold text-sm shadow shrink-0 border border-white/20 group-hover:scale-105 transition`}>
                      {t.genre === 'horror' ? '💀' : t.genre === 'adventure' ? '🧭' : t.genre === 'action' ? '⚔️' : '♔'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs sm:text-sm text-white truncate">
                          {t.name}
                        </div>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[10px] text-amber-300 font-bold bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40 shrink-0">
                            <Check className="w-3 h-3 text-amber-300" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-amber-300/80 font-mono truncate mt-0.5">
                        {t.warTitle || 'Cathedral Clash'}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 mt-1 truncate">
                        <Volume2 className="w-3 h-3 text-amber-400/70 shrink-0" />
                        <span className="truncate">{t.musicName}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <span>Dynamic 3D fires &amp; lighting update instantly upon selection.</span>
              <button
                type="button"
                onClick={() => setShowThemeVault(false)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
