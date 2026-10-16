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
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1b1233]/75 via-[#100a20]/80 to-[#070512]/90 backdrop-blur-2xl border border-amber-400/40 rounded-3xl p-4 sm:p-5 shadow-[0_25px_80px_rgba(0,0,0,0.88),0_0_50px_rgba(245,158,11,0.15),inset_0_1px_2px_rgba(255,255,255,0.25)] text-white ring-1 ring-amber-400/25">
          
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

          {/* Two Mode Choice Tabs */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-2.5 sm:mb-3">
            {/* Tab 1: Solo vs AI */}
            <button
              type="button"
              onClick={() => setGameMode('ai')}
              className={`p-2.5 sm:p-3 rounded-2xl border text-left transition flex items-center gap-2.5 sm:gap-3 cursor-pointer ${
                gameMode === 'ai'
                  ? 'bg-gradient-to-r from-amber-400/25 via-amber-500/15 to-purple-600/20 border-amber-400 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                  : 'bg-white/[0.04] backdrop-blur-md border-white/10 text-slate-300 hover:bg-white/[0.08] hover:border-amber-400/40'
              }`}
            >
              <div className="p-1.5 sm:p-2 rounded-xl bg-amber-400/20 text-amber-300 shrink-0 border border-amber-400/30">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs sm:text-sm text-white truncate">Play vs AI</div>
                  {gameMode === 'ai' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] shrink-0 ml-1" />
                  )}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">Solo match vs AI</div>
              </div>
            </button>

            {/* Tab 2: 2-Player Pass & Play */}
            <button
              type="button"
              onClick={() => setGameMode('2p')}
              className={`p-2.5 sm:p-3 rounded-2xl border text-left transition flex items-center gap-2.5 sm:gap-3 cursor-pointer ${
                gameMode === '2p'
                  ? 'bg-gradient-to-r from-purple-500/30 via-purple-600/20 to-amber-500/15 border-purple-400 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.25)] ring-1 ring-purple-400/50'
                  : 'bg-white/[0.04] backdrop-blur-md border-white/10 text-slate-300 hover:bg-white/[0.08] hover:border-purple-400/40'
              }`}
            >
              <div className="p-1.5 sm:p-2 rounded-xl bg-purple-500/25 text-purple-300 shrink-0 border border-purple-400/30">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs sm:text-sm text-white truncate">Pass &amp; Play</div>
                  {gameMode === '2p' && (
                    <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc] shrink-0 ml-1" />
                  )}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">2 Players, local</div>
              </div>
            </button>
          </div>

          {/* Mode Settings Area */}
          {gameMode === 'ai' ? (
            <div className="p-2.5 sm:p-3 rounded-2xl bg-black/35 backdrop-blur-md border border-white/10 space-y-2 sm:space-y-2.5 mb-2.5 sm:mb-3">
              {/* Play Side (White or Black) */}
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                  Your Piece Color
                </span>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setPlayerColor('w')}
                    className={`py-1.5 sm:py-2 px-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      playerColor === 'w'
                        ? 'bg-amber-400/30 border border-amber-400 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                        : 'bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm">♔</span>
                    <span>White (Move 1st)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerColor('b')}
                    className={`py-1.5 sm:py-2 px-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      playerColor === 'b'
                        ? 'bg-purple-500/35 border border-purple-400 text-purple-100 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                        : 'bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm">♚</span>
                    <span>Black (AI Moves 1st)</span>
                  </button>
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                  AI Difficulty
                </span>
                <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
                  {['easy', 'medium', 'hard', 'expert'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setAiDifficulty(lvl)}
                      className={`py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold capitalize transition cursor-pointer ${
                        aiDifficulty === lvl
                          ? 'bg-amber-400/30 border border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                          : 'bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2.5 sm:p-3 rounded-2xl bg-black/35 backdrop-blur-md border border-white/10 space-y-1.5 mb-2.5 sm:mb-3 text-[11px] sm:text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>White moves first, alternating turns automatically</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Green indicators show all legal destination squares</span>
              </div>
            </div>
          )}

          {/* Match Time Control (Blitz, Rapid, Classical, Untimed) */}
          <div className="p-2 sm:p-2.5 sm:px-3 rounded-2xl bg-black/35 backdrop-blur-md border border-white/10 mb-2.5 sm:mb-3">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1.5">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Match Timer</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-300 font-mono">
                {matchDurationMin === 0 ? 'No clock (Casual)' : `${matchDurationMin}m per player`}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
              {[
                { label: '3m', sub: 'Blitz', val: 3 },
                { label: '5m', sub: 'Blitz', val: 5 },
                { label: '10m', sub: 'Rapid', val: 10 },
                { label: '15m', sub: 'Rapid', val: 15 },
                { label: '∞', sub: 'Untimed', val: 0 }
              ].map((tc) => (
                <button
                  key={tc.val}
                  type="button"
                  onClick={() => onSetTimeControl(tc.val)}
                  className={`py-1 sm:py-1.5 px-1 rounded-xl transition flex flex-col items-center justify-center cursor-pointer ${
                    matchDurationMin === tc.val
                      ? 'bg-gradient-to-b from-amber-400/30 to-amber-500/20 border border-amber-400 text-amber-200 shadow-sm'
                      : 'bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-extrabold text-[11px] sm:text-xs">{tc.label}</span>
                  <span className="text-[8px] sm:text-[9px] font-medium opacity-70 leading-none mt-0.5">{tc.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Big Launch Button */}
          <button
            type="button"
            onClick={onStartGame}
            className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-black font-black text-sm sm:text-base uppercase tracking-wider sm:tracking-widest shadow-[0_0_35px_rgba(245,158,11,0.55),inset_0_1px_2px_rgba(255,255,255,0.7)] border border-amber-200 ring-2 ring-amber-400/40 transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
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
