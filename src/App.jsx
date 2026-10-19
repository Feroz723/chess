import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { Chess } from 'chess.js';
import {
  Castle, Bot, Users, Palette, Camera, RotateCcw,
  Volume2, Volume1, VolumeX, Music, Shield, UserPlus, Search,
  History, Swords, Check, CheckCircle2, X, ArrowLeft, Home,
  Sparkles, Crown, RefreshCw, Compass,
  ScrollText, ChevronDown, ChevronRight, Send, MousePointerClick,
  Lock, Flame, Eye, EyeOff, LogIn, LogOut, Clock, User,
  Flag, Handshake, AlertTriangle
} from 'lucide-react';
import { findBestAiMove } from './chessAi.js';
import { SimpleMainMenu, SimpleAuthModal } from './SimpleMainMenu.jsx';
import { LandingPage, AuthGateModal, LobbyPage, LANDING_THEMES } from './LandingAndLobby.jsx';

const ROYAL_THEMES = {
  sanctum: {
    id: 'sanctum',
    name: 'Sanctum Cathedral',
    shortName: 'Sanctum',
    warTitle: 'Twilight Cathedral War',
    musicName: 'Checkmate at Dawn',
    musicFile: '/music/checkmate_at_dawn.mp3',
    badgeClass: 'from-purple-500 to-amber-200',
    whiteOrderName: 'Alabaster Order',
    blackOrderName: 'Obsidian Order',
    bgHex: 0x09080d,
    fogDensity: 0.024,
    roseOuterHex: 0xa855f7,
    roseCoreHex: 0xfbbf24,
    lightBeamHex: 0xc084fc,
    torchFlameHex: 0xa855f7,
    torchLightHex: 0xc084fc,
    bannerWhiteHex: 0xfef08a,
    bannerBlackHex: 0x581c87,
    emberHex: 0xfbbf24,
    stoneHex: 0x1a1724,
    lightSquareHex: 0xd8d0c5,
    darkSquareHex: 0x262134,
    whitePiece: { base: '#f7f4ee', vein1: '#d6c7b2', vein2: '#b89f72', color: 0xfaf7f2, accent: 0xf59e0b, emissive: 0x451a03 },
    blackPiece: { base: '#14111d', vein1: '#4c1d95', vein2: '#7e22ce', color: 0x1a1528, accent: 0xa855f7, emissive: 0x581c87 }
  },
  imperial: {
    id: 'imperial',
    name: 'Imperial Throne',
    shortName: 'Imperial',
    warTitle: 'Dragon Fortress Siege',
    musicName: 'Decisive Impact',
    musicFile: '/music/decisive_impact.mp3',
    badgeClass: 'from-red-600 to-yellow-400',
    whiteOrderName: 'Sovereign Gold',
    blackOrderName: 'Crimson Ruby',
    bgHex: 0x12080a,
    fogDensity: 0.026,
    roseOuterHex: 0xdc2626,
    roseCoreHex: 0xfacc15,
    lightBeamHex: 0xf87171,
    torchFlameHex: 0xef4444,
    torchLightHex: 0xf97316,
    bannerWhiteHex: 0xfef08a,
    bannerBlackHex: 0x991b1b,
    emberHex: 0xf87171,
    stoneHex: 0x241014,
    lightSquareHex: 0xf3e5ab,
    darkSquareHex: 0x3b1219,
    whitePiece: { base: '#fffbeb', vein1: '#f59e0b', vein2: '#b45309', color: 0xfef3c7, accent: 0xeab308, emissive: 0x713f12 },
    blackPiece: { base: '#28070d', vein1: '#991b1b', vein2: '#f59e0b', color: 0x380811, accent: 0xef4444, emissive: 0x7f1d1d }
  },
  sapphire: {
    id: 'sapphire',
    name: 'Celestial Sapphire',
    shortName: 'Sapphire',
    warTitle: 'Astral Void Citadel',
    musicName: 'Weightless Isolation',
    musicFile: '/music/weightless_isolation.mp3',
    badgeClass: 'from-blue-600 to-cyan-200',
    whiteOrderName: 'Platinum Ivory',
    blackOrderName: 'Royal Lapis',
    bgHex: 0x050a18,
    fogDensity: 0.022,
    roseOuterHex: 0x2563eb,
    roseCoreHex: 0x38bdf8,
    lightBeamHex: 0x60a5fa,
    torchFlameHex: 0x38bdf8,
    torchLightHex: 0x60a5fa,
    bannerWhiteHex: 0xe0f2fe,
    bannerBlackHex: 0x1e3a8a,
    emberHex: 0x38bdf8,
    stoneHex: 0x0f172a,
    lightSquareHex: 0xe2e8f0,
    darkSquareHex: 0x172554,
    whitePiece: { base: '#f8fafc', vein1: '#94a3b8', vein2: '#38bdf8', color: 0xf1f5f9, accent: 0x38bdf8, emissive: 0x0c4a6e },
    blackPiece: { base: '#0f172a', vein1: '#1d4ed8', vein2: '#fbbf24', color: 0x172554, accent: 0x60a5fa, emissive: 0x1e3a8a }
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Basilica',
    shortName: 'Emerald',
    warTitle: 'Gargoyle Ruin Battlefield',
    musicName: 'Decisive Impact II',
    musicFile: '/music/decisive_impact_1.mp3',
    badgeClass: 'from-emerald-600 to-amber-300',
    whiteOrderName: 'Imperial Pearl',
    blackOrderName: 'Dark Malachite',
    bgHex: 0x04130e,
    fogDensity: 0.025,
    roseOuterHex: 0x059669,
    roseCoreHex: 0xfcd34d,
    lightBeamHex: 0x34d399,
    torchFlameHex: 0x10b981,
    torchLightHex: 0x34d399,
    bannerWhiteHex: 0xd1fae5,
    bannerBlackHex: 0x064e3b,
    emberHex: 0x34d399,
    stoneHex: 0x0a1d15,
    lightSquareHex: 0xd1fae5,
    darkSquareHex: 0x064e3b,
    whitePiece: { base: '#ecfdf5', vein1: '#6ee7b7', vein2: '#d97706', color: 0xf0fdf4, accent: 0xfbbf24, emissive: 0x065f46 },
    blackPiece: { base: '#022c22', vein1: '#059669', vein2: '#10b981', color: 0x064e3b, accent: 0x10b981, emissive: 0x065f46 }
  },
  solar: {
    id: 'solar',
    name: 'Solar Citadel',
    shortName: 'Solar',
    warTitle: 'Paladin Dawn Crusade',
    musicName: 'Rise of the Dawn',
    musicFile: '/music/rise_of_the_dawn.mp3',
    badgeClass: 'from-amber-400 via-orange-400 to-yellow-200',
    whiteOrderName: 'Radiant Gold',
    blackOrderName: 'Eclipse Obsidian',
    bgHex: 0x180f08,
    fogDensity: 0.023,
    roseOuterHex: 0xf59e0b,
    roseCoreHex: 0xfef08a,
    lightBeamHex: 0xfde047,
    torchFlameHex: 0xf59e0b,
    torchLightHex: 0xfde047,
    bannerWhiteHex: 0xfffbeb,
    bannerBlackHex: 0x7c2d12,
    emberHex: 0xfde047,
    stoneHex: 0x261910,
    lightSquareHex: 0xfef3c7,
    darkSquareHex: 0x451a03,
    whitePiece: { base: '#fffbeb', vein1: '#f59e0b', vein2: '#fbbf24', color: 0xfffdf5, accent: 0xf59e0b, emissive: 0x78350f },
    blackPiece: { base: '#1a1008', vein1: '#b45309', vein2: '#d97706', color: 0x24150b, accent: 0xf97316, emissive: 0x7c2d12 }
  },

  // === GENRE: HORROR (2 THEMES) ===
  crypt: {
    id: 'crypt',
    genre: 'horror',
    name: 'Crimson Crypt',
    shortName: 'Crimson Crypt',
    warTitle: 'Bloodmoon Crypt Siege',
    musicName: 'The Midnight Perimeter',
    musicFile: '/music/The_Midnight_Perimeter.mp3',
    fallbackMusicFile: '/music/decisive_impact.mp3',
    badgeClass: 'from-red-950 via-red-800 to-rose-500',
    whiteOrderName: 'Pale Bone Knights',
    blackOrderName: 'Bloodmoon Cult',
    bgHex: 0x0d0305,
    fogDensity: 0.028,
    roseOuterHex: 0xe11d48,
    roseCoreHex: 0x991b1b,
    lightBeamHex: 0xf43f5e,
    torchFlameHex: 0xff1e42,
    torchLightHex: 0xff0033,
    bannerWhiteHex: 0xfecdd3,
    bannerBlackHex: 0x4c0519,
    emberHex: 0xff2244,
    stoneHex: 0x1c060d,
    lightSquareHex: 0xfbd5db,
    darkSquareHex: 0x3d0714,
    whitePiece: { base: '#fff1f2', vein1: '#fda4af', vein2: '#e11d48', color: 0xffe4e6, accent: 0xf43f5e, emissive: 0x4c0519 },
    blackPiece: { base: '#1a0409', vein1: '#881337', vein2: '#be123c', color: 0x2d0611, accent: 0xff1e42, emissive: 0x881337 }
  },
  necropolis: {
    id: 'necropolis',
    genre: 'horror',
    name: 'Spectral Necropolis',
    shortName: 'Necropolis',
    warTitle: 'Wraith Citadel Awakening',
    musicName: 'Rituals at the Sunken Threshold',
    musicFile: '/music/Rituals_at_the_Sunken_Threshold.mp3',
    fallbackMusicFile: '/music/weightless_isolation.mp3',
    badgeClass: 'from-teal-950 via-cyan-900 to-emerald-500',
    whiteOrderName: 'Ghost Ivory Phantoms',
    blackOrderName: 'Abyssal Wraithlords',
    bgHex: 0x020f12,
    fogDensity: 0.026,
    roseOuterHex: 0x14b8a6,
    roseCoreHex: 0x2dd4bf,
    lightBeamHex: 0x5eead4,
    torchFlameHex: 0x2dd4bf,
    torchLightHex: 0x06b6d4,
    bannerWhiteHex: 0xccfbf1,
    bannerBlackHex: 0x042f2e,
    emberHex: 0x2dd4bf,
    stoneHex: 0x072227,
    lightSquareHex: 0xd1fae5,
    darkSquareHex: 0x042f2e,
    whitePiece: { base: '#f0fdfa', vein1: '#5eead4', vein2: '#14b8a6', color: 0xecfeff, accent: 0x2dd4bf, emissive: 0x115e59 },
    blackPiece: { base: '#04171a', vein1: '#0f766e', vein2: '#14b8a6', color: 0x082f35, accent: 0x2dd4bf, emissive: 0x0e7490 }
  },

  // === GENRE: ADVENTURE (2 THEMES) ===
  jungle: {
    id: 'jungle',
    genre: 'adventure',
    name: 'Forgotten Temple',
    shortName: 'Lost Temple',
    warTitle: 'Lost Temple of the Sun Gods',
    musicName: 'Threshold of the Lost',
    musicFile: '/music/Threshold_of_the_Lost.mp3',
    fallbackMusicFile: '/music/rise_of_the_dawn.mp3',
    badgeClass: 'from-amber-700 via-emerald-800 to-yellow-400',
    whiteOrderName: 'Golden Sun Voyagers',
    blackOrderName: 'Emerald Serpent Guardians',
    bgHex: 0x0a140b,
    fogDensity: 0.025,
    roseOuterHex: 0xeab308,
    roseCoreHex: 0x22c55e,
    lightBeamHex: 0xfacc15,
    torchFlameHex: 0xf97316,
    torchLightHex: 0xfbbf24,
    bannerWhiteHex: 0xfef9c3,
    bannerBlackHex: 0x14532d,
    emberHex: 0xfacc15,
    stoneHex: 0x132415,
    lightSquareHex: 0xfef08a,
    darkSquareHex: 0x143e1d,
    whitePiece: { base: '#fefce8', vein1: '#facc15', vein2: '#ca8a04', color: 0xfef9c3, accent: 0xeab308, emissive: 0x713f12 },
    blackPiece: { base: '#052312', vein1: '#15803d', vein2: '#ca8a04', color: 0x0a381e, accent: 0x22c55e, emissive: 0x14532d }
  },
  glacial: {
    id: 'glacial',
    genre: 'adventure',
    name: 'Glacial Summit',
    shortName: 'Glacial Peak',
    warTitle: 'Frozen Peak of the Valkyries',
    musicName: 'Beneath the Frozen Ridge',
    musicFile: '/music/Beneath_the_Frozen_Ridge.mp3',
    fallbackMusicFile: '/music/weightless_isolation.mp3',
    badgeClass: 'from-sky-900 via-blue-700 to-cyan-300',
    whiteOrderName: 'Frostborne Paladins',
    blackOrderName: 'Blizzard Jarls',
    bgHex: 0x050c18,
    fogDensity: 0.024,
    roseOuterHex: 0x38bdf8,
    roseCoreHex: 0xa5f3fc,
    lightBeamHex: 0x7dd3fc,
    torchFlameHex: 0x00e5ff,
    torchLightHex: 0x38bdf8,
    bannerWhiteHex: 0xf0f9ff,
    bannerBlackHex: 0x0c4a6e,
    emberHex: 0x7dd3fc,
    stoneHex: 0x0c1e33,
    lightSquareHex: 0xe0f2fe,
    darkSquareHex: 0x0c3156,
    whitePiece: { base: '#f8fafc', vein1: '#bae6fd', vein2: '#38bdf8', color: 0xf0f9ff, accent: 0x38bdf8, emissive: 0x0369a1 },
    blackPiece: { base: '#081726', vein1: '#0284c7', vein2: '#38bdf8', color: 0x0d2847, accent: 0x38bdf8, emissive: 0x075985 }
  },

  // === GENRE: ACTION / WAR (2 THEMES) ===
  volcano: {
    id: 'volcano',
    genre: 'action',
    name: 'Inferno Bastion',
    shortName: 'Inferno',
    warTitle: 'Cataclysm of the Molten Core',
    musicName: 'Beneath a Thousand Shields',
    musicFile: '/music/Beneath_a_Thousand_Shields.mp3',
    fallbackMusicFile: '/music/decisive_impact.mp3',
    badgeClass: 'from-orange-900 via-amber-700 to-red-600',
    whiteOrderName: 'Forgemaster Legion',
    blackOrderName: 'Nether Molten Horde',
    bgHex: 0x160503,
    fogDensity: 0.027,
    roseOuterHex: 0xf97316,
    roseCoreHex: 0xff2200,
    lightBeamHex: 0xfb923c,
    torchFlameHex: 0xff3b00,
    torchLightHex: 0xff6600,
    bannerWhiteHex: 0xffedd5,
    bannerBlackHex: 0x7c2d12,
    emberHex: 0xff5500,
    stoneHex: 0x220c08,
    lightSquareHex: 0xfed7aa,
    darkSquareHex: 0x4a1207,
    whitePiece: { base: '#fff7ed', vein1: '#fdba74', vein2: '#ea580c', color: 0xffedd5, accent: 0xf97316, emissive: 0x7c2d12 },
    blackPiece: { base: '#1b0906', vein1: '#c2410c', vein2: '#ff4400', color: 0x2e0f09, accent: 0xff4400, emissive: 0x9a3412 }
  },
  cyber: {
    id: 'cyber',
    genre: 'action',
    name: 'Cyber War-Grid',
    shortName: 'Cyber War',
    warTitle: 'Digital Warfront 2099',
    musicName: 'Upon the Frozen Altar',
    musicFile: '/music/Upon_the_Frozen_Altar.mp3',
    fallbackMusicFile: '/music/checkmate_at_dawn.mp3',
    badgeClass: 'from-fuchsia-950 via-purple-900 to-cyan-400',
    whiteOrderName: 'Neon Synth Vanguard',
    blackOrderName: 'Quantum Glitch Legion',
    bgHex: 0x070514,
    fogDensity: 0.022,
    roseOuterHex: 0xd946ef,
    roseCoreHex: 0x06b6d4,
    lightBeamHex: 0xa855f7,
    torchFlameHex: 0x00f0ff,
    torchLightHex: 0xd946ef,
    bannerWhiteHex: 0xfae8ff,
    bannerBlackHex: 0x4a044e,
    emberHex: 0x00f0ff,
    stoneHex: 0x120c24,
    lightSquareHex: 0xfdf4ff,
    darkSquareHex: 0x250e3d,
    whitePiece: { base: '#faf5ff', vein1: '#e879f9', vein2: '#22d3ee', color: 0xf5f3ff, accent: 0x06b6d4, emissive: 0x6b21a8 },
    blackPiece: { base: '#0b0617', vein1: '#a21caf', vein2: '#06b6d4', color: 0x170b2e, accent: 0xd946ef, emissive: 0x701a75 }
  }
};


// Robust helper functions for chess.js compatibility across versions
function chessInCheck(chess) {
  if (!chess) return false;
  if (typeof chess.isCheck === 'function') return chess.isCheck();
  if (typeof chess.in_check === 'function') return chess.in_check();
  return false;
}

function chessInCheckmate(chess) {
  if (!chess) return false;
  if (typeof chess.isCheckmate === 'function') return chess.isCheckmate();
  if (typeof chess.in_checkmate === 'function') return chess.in_checkmate();
  return false;
}

function chessInDraw(chess) {
  if (!chess) return false;
  if (typeof chess.isDraw === 'function') return chess.isDraw();
  if (typeof chess.in_draw === 'function') return chess.in_draw();
  return false;
}

function chessInStalemate(chess) {
  if (!chess) return false;
  if (typeof chess.isStalemate === 'function') return chess.isStalemate();
  if (typeof chess.in_stalemate === 'function') return chess.in_stalemate();
  return false;
}

function chessInThreefoldRepetition(chess) {
  if (!chess) return false;
  if (typeof chess.isThreefoldRepetition === 'function') return chess.isThreefoldRepetition();
  if (typeof chess.in_threefold_repetition === 'function') return chess.in_threefold_repetition();
  return false;
}

function chessInInsufficientMaterial(chess) {
  if (!chess) return false;
  if (typeof chess.isInsufficientMaterial === 'function') return chess.isInsufficientMaterial();
  if (typeof chess.insufficient_material === 'function') return chess.insufficient_material();
  return false;
}

function chessIsGameOver(chess) {
  if (!chess) return false;
  if (typeof chess.isGameOver === 'function') return chess.isGameOver();
  if (typeof chess.game_over === 'function') return chess.game_over();
  return false;
}

export function resolveAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';
  const cleanPath = path.replace(/^\/+/, '');
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
}

const AUDIO_TRACKS = {
  landing: '/music/two_kingdoms_poised.mp3',
  landingTitle: 'Two Kingdoms Poised',
  victory: '/music/crown_of_gold.mp3',
  victoryTitle: 'Crown of Gold',
  defeat: '/music/a_graceful_bow.mp3',
  defeatTitle: 'A Graceful Bow',
  draw: '/music/a_graceful_bow.mp3',
  drawTitle: 'A Graceful Bow'
};

class CathedralAudioController {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.masterGain = null;
    this.isMuted = false;
    this.musicVolume = 0.65;
    this.savedVolume = 0.65;
    this.currentTheme = 'sanctum';
    this.currentTrackType = 'landing'; // 'landing' | 'game' | 'victory' | 'defeat'
    this.currentTrackSrc = AUDIO_TRACKS.landing;
    this.currentTrackTitle = AUDIO_TRACKS.landingTitle;
    this.musicPlaying = false;
    this.wantsMusic = true;
    this._gestureUnlockArmed = false;

    // Native HTML5 Audio for continuous, looping MP3 playback
    const existingAudio = typeof document !== 'undefined' ? document.getElementById('cathedral-bgm') : null;
    this.audio = existingAudio || (typeof Audio !== 'undefined' ? new Audio() : null);
    if (this.audio) {
      this.audio.loop = true;
      this.audio.volume = this.musicVolume;
      this.audio.preload = 'auto';
      if (!this.audio.src) {
        this.audio.src = resolveAssetUrl(AUDIO_TRACKS.landing);
      }
    }
  }

  getAudio() {
    if (!this.audio && typeof document !== 'undefined') {
      this.audio = document.getElementById('cathedral-bgm') || (typeof Audio !== 'undefined' ? new Audio() : null);
    }
    return this.audio;
  }

  ensureCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  armGestureUnlock(onStateChange) {
    if (this._gestureUnlockArmed) return;
    this._gestureUnlockArmed = true;

    const unlock = () => {
      this.ensureCtx();
      const a = this.getAudio();
      if (a && this.wantsMusic && !this.isMuted) {
        a.play().then(() => {
          this.musicPlaying = true;
          if (onStateChange) onStateChange(true, this.currentTrackTitle);
          cleanup();
        }).catch(() => {});
      }
    };

    const cleanup = () => {
      this._gestureUnlockArmed = false;
      ['pointerdown', 'touchstart', 'click', 'keydown'].forEach(evt => {
        window.removeEventListener(evt, unlock, { capture: true });
      });
    };

    ['pointerdown', 'touchstart', 'click', 'keydown'].forEach(evt => {
      window.addEventListener(evt, unlock, { capture: true, once: true, passive: true });
    });
  }

  playTrack(src, title, loop = true, onStateChange) {
    const audio = this.getAudio();
    if (!audio) return;
    this.ensureCtx();
    const resolvedSrc = resolveAssetUrl(src);
    this.currentTrackSrc = resolvedSrc;
    this.currentTrackTitle = title || '';

    let needsLoad = false;
    try {
      const currentUrl = audio.src ? new URL(audio.src, window.location.href).href : '';
      const targetUrl = new URL(resolvedSrc, window.location.href).href;
      if (currentUrl !== targetUrl) {
        audio.src = resolvedSrc;
        needsLoad = true;
      }
    } catch (e) {
      if (audio.src !== resolvedSrc) {
        audio.src = resolvedSrc;
        needsLoad = true;
      }
    }

    if (needsLoad) {
      audio.currentTime = 0;
      audio.load();
    }

    audio.loop = loop;
    audio.volume = this.isMuted ? 0 : this.musicVolume;
    audio.muted = this.isMuted;

    if (this.wantsMusic && !this.isMuted) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.musicPlaying = true;
          if (onStateChange) onStateChange(true, this.currentTrackTitle);
        }).catch(() => {
          this.musicPlaying = false;
          if (onStateChange) onStateChange(false, this.currentTrackTitle);
          this.armGestureUnlock(onStateChange);
        });
      }
    } else {
      audio.pause();
      this.musicPlaying = false;
      if (onStateChange) onStateChange(false, this.currentTrackTitle);
    }
  }

  playLandingMusic(themeId = 'royal-gold', onStateChange) {
    this.currentTrackType = 'landing';
    const lTheme = LANDING_THEMES[themeId] || LANDING_THEMES['royal-gold'];
    this.playTrack(lTheme.musicFile, lTheme.musicName, true, onStateChange);
  }

  playGameThemeMusic(themeKey = this.currentTheme, onStateChange) {
    this.currentTheme = themeKey;
    this.currentTrackType = 'game';
    const themeObj = ROYAL_THEMES[themeKey] || ROYAL_THEMES.sanctum;
    const targetFile = themeObj.musicFile;
    const fallbackFile = themeObj.fallbackMusicFile || '/music/checkmate_at_dawn.mp3';

    // Set an error listener on audio element in case track fails to load
    const audio = this.getAudio();
    if (audio) {
      const errorHandler = () => {
        audio.removeEventListener('error', errorHandler);
        const resolvedFallback = resolveAssetUrl(fallbackFile);
        if (resolvedFallback && audio.src && !audio.src.includes(fallbackFile)) {
          audio.src = resolvedFallback;
          audio.currentTime = 0;
          audio.load();
          if (this.wantsMusic && !this.isMuted) {
            audio.play().then(() => {
              this.musicPlaying = true;
              if (onStateChange) onStateChange(true, `${themeObj.musicName} (Preview)`);
            }).catch(() => {});
          }
        }
      };
      if (audio._lastErrorHandler) audio.removeEventListener('error', audio._lastErrorHandler);
      audio._lastErrorHandler = errorHandler;
      audio.addEventListener('error', errorHandler, { once: true });
    }

    this.playTrack(targetFile, themeObj.musicName, true, onStateChange);
  }

  playTheme(themeKey, onStateChange) {
    this.playGameThemeMusic(themeKey, onStateChange);
  }

  playVictoryMusic(onStateChange) {
    this.currentTrackType = 'victory';
    this.playTrack(AUDIO_TRACKS.victory, AUDIO_TRACKS.victoryTitle, true, onStateChange);
  }

  playDefeatOrDrawMusic(onStateChange) {
    this.currentTrackType = 'defeat';
    this.playTrack(AUDIO_TRACKS.defeat, AUDIO_TRACKS.defeatTitle, true, onStateChange);
  }

  startMusic(themeKey = this.currentTheme, onStateChange) {
    this.wantsMusic = true;
    this.ensureCtx();
    if (this.isMuted) {
      this.isMuted = false;
      this.musicVolume = this.savedVolume > 0.05 ? this.savedVolume : 0.65;
    }
    if (!this.audio) return;
    this.audio.volume = this.musicVolume;
    this.audio.muted = false;
    this.audio.loop = true;

    if (this.currentTrackType === 'game') {
      this.playGameThemeMusic(themeKey, onStateChange);
    } else {
      this.playLandingMusic(onStateChange);
    }
  }

  stopMusic(onStateChange) {
    this.wantsMusic = false;
    this.musicPlaying = false;
    if (this.audio) {
      this.audio.pause();
    }
    if (onStateChange) onStateChange(false);
  }

  pauseOnGameOver(onStateChange) {
    this.musicPlaying = false;
    if (this.audio) {
      this.audio.pause();
    }
    if (onStateChange) onStateChange(false);
  }

  toggleSound(onMuteChange, onVolumeChange, setMusicPlaying) {
    this.ensureCtx();
    const isCurrentlySilent = this.isMuted || !this.musicPlaying || (this.audio && this.audio.paused);

    if (isCurrentlySilent) {
      // User clicked to UNMUTE and PLAY
      this.isMuted = false;
      this.wantsMusic = true;
      this.musicVolume = this.savedVolume > 0.05 ? this.savedVolume : 0.65;
      if (this.audio) {
        if (!this.audio.src || this.audio.src === '' || this.audio.src === window.location.href) {
          this.audio.src = this.currentTrackSrc || AUDIO_TRACKS.landing;
        }
        this.audio.volume = this.musicVolume;
        this.audio.muted = false;
        this.audio.play().then(() => {
          this.musicPlaying = true;
          if (setMusicPlaying) setMusicPlaying(true);
        }).catch(() => {});
      }
      if (onMuteChange) onMuteChange(false);
      if (onVolumeChange) onVolumeChange(Math.round(this.musicVolume * 100));
      if (setMusicPlaying) setMusicPlaying(true);
      return false;
    } else {
      // User clicked to MUTE and PAUSE
      this.isMuted = true;
      this.wantsMusic = false;
      this.musicPlaying = false;
      if (this.musicVolume > 0) this.savedVolume = this.musicVolume;
      this.musicVolume = 0;
      if (this.audio) {
        this.audio.volume = 0;
        this.audio.muted = true;
        this.audio.pause();
      }
      if (onMuteChange) onMuteChange(true);
      if (onVolumeChange) onVolumeChange(0);
      if (setMusicPlaying) setMusicPlaying(false);
      return true;
    }
  }

  toggleMute(onMuteChange, onVolumeChange, setMusicPlaying) {
    return this.toggleSound(onMuteChange, onVolumeChange, setMusicPlaying);
  }

  setVolume(val, onMuteChange, onVolumeChange, setMusicPlaying) {
    this.ensureCtx();
    const v = Math.max(0, Math.min(1, val));
    this.musicVolume = v;
    if (v === 0) {
      this.isMuted = true;
      this.wantsMusic = false;
      this.musicPlaying = false;
      if (this.audio) {
        this.audio.volume = 0;
        this.audio.muted = true;
        this.audio.pause();
      }
      if (onMuteChange) onMuteChange(true);
      if (onVolumeChange) onVolumeChange(0);
      if (setMusicPlaying) setMusicPlaying(false);
    } else {
      this.isMuted = false;
      this.wantsMusic = true;
      this.savedVolume = v;
      if (this.audio) {
        if (!this.audio.src || this.audio.src === '' || this.audio.src === window.location.href) {
          this.audio.src = this.currentTrackSrc || AUDIO_TRACKS.landing;
        }
        this.audio.volume = v;
        this.audio.muted = false;
        if (this.audio.paused) {
          this.audio.play().then(() => {
            this.musicPlaying = true;
            if (setMusicPlaying) setMusicPlaying(true);
          }).catch(() => {});
        } else {
          this.musicPlaying = true;
          if (setMusicPlaying) setMusicPlaying(true);
        }
      }
      if (onMuteChange) onMuteChange(false);
      if (onVolumeChange) onVolumeChange(Math.round(v * 100));
      if (setMusicPlaying) setMusicPlaying(true);
    }
  }

  playSelect() {
    if (!this.sfxEnabled) return;
    this.ensureCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(790, now + 0.14);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  playSlide() {
    if (!this.sfxEnabled) return;
    this.ensureCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(112, now);
    osc.frequency.exponentialRampToValueAtTime(66, now + 0.32);
    gain.gain.setValueAtTime(0.17, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  playShatter() {
    if (!this.sfxEnabled) return;
    this.ensureCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bass = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bass.type = 'sawtooth';
    bass.frequency.setValueAtTime(96, now);
    bass.frequency.exponentialRampToValueAtTime(28, now + 0.55);
    bassGain.gain.setValueAtTime(0.3, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
    bass.connect(bassGain);
    bassGain.connect(this.masterGain);
    bass.start(now);
    bass.stop(now + 0.6);

    [920, 1280, 1690, 2140].forEach((freq, i) => {
      const chime = this.ctx.createOscillator();
      const cGain = this.ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(freq, now + i * 0.04);
      chime.frequency.exponentialRampToValueAtTime(freq * 0.6, now + i * 0.04 + 0.26);
      cGain.gain.setValueAtTime(0.08, now + i * 0.04);
      cGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.29);
      chime.connect(cGain);
      cGain.connect(this.masterGain);
      chime.start(now + i * 0.04);
      chime.stop(now + i * 0.04 + 0.3);
    });
  }

  playCheck() {
    if (!this.sfxEnabled) return;
    this.ensureCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25].forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.08);
      gain.gain.setValueAtTime(0.14, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.42);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  }
}

const audioCtrl = new CathedralAudioController();

export default function App() {
  const mountRef = useRef(null);

  // Production Gameflow Architecture: 'landing' -> 'lobby' -> 'game'
  const [currentScreen, setCurrentScreen] = useState('landing');
  const currentScreenRef = useRef('landing');
  const [landingTheme, setLandingTheme] = useState('royal-gold');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authKey, setAuthKey] = useState('ARCHMAGE-2026-TITAN-GOLD');
  const [authUsername, setAuthUsername] = useState('Archmage_Aurelius');
  const [authHouse, setAuthHouse] = useState('Alabaster Archmage');

  // Game & Navigation State
  const [gameMode, setGameMode] = useState('ai'); // 'ai' | '2p'
  const [playerColor, setPlayerColor] = useState('w'); // 'w' | 'b' (Player chooses White or Black)
  const [aiDifficulty, setAiDifficulty] = useState('medium'); // 'easy' | 'medium' | 'hard' | 'expert'
  const [aiThinking, setAiThinking] = useState(false);
  const workerRef = useRef(null);
  const [royalTheme, setRoyalTheme] = useState('sanctum');
  const [camPreset, setCamPreset] = useState('orbit');
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(65);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [currentMusicTitle, setCurrentMusicTitle] = useState('Two Kingdoms Poised');

  // Chess Telemetry State
  const [turnColor, setTurnColor] = useState('w');
  const [inCheck, setInCheck] = useState(false);
  const [gameOverText, setGameOverText] = useState('');
  const [matchResult, setMatchResult] = useState(null); // { result, winner, opponent, moveCount, reason, theme }
  const [isInspectingBoard, setIsInspectingBoard] = useState(false);
  const [subStatusText, setSubStatusText] = useState('Alabaster Order • Select a piece to command');
  const [moveHistory, setMoveHistory] = useState([]);
  const [capturedByWhite, setCapturedByWhite] = useState([]);
  const [capturedByBlack, setCapturedByBlack] = useState([]);
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const isGameActive = currentScreen === 'game' && moveHistory.length > 0 && !gameOverText && !matchResult;
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterGameFullscreen = useCallback(() => {
    try {
      const docEl = document.documentElement;
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        }
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  useEffect(() => {
    let worker = null;
    try {
      worker = new Worker(new URL('./aiWorker.js', import.meta.url), { type: 'module' });
      workerRef.current = worker;
    } catch (e) {
      console.warn('Web Worker fallback to synchronous execution:', e);
    }
    return () => {
      if (worker) worker.terminate();
    };
  }, []);

  // Tactical Notice Board (Alternative Move Control) State
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [noticeBoardOpen, setNoticeBoardOpen] = useState(true);
  const [noticeTab, setNoticeTab] = useState('board'); // 'board' (2D Parchment Grid) | 'moves' (Legal Moves Roster)
  const [commandInput, setCommandInput] = useState('');
  const [commandError, setCommandError] = useState('');

  // Sanctum Registry State (Clean Player-Facing)
  const [sanctumModalOpen, setSanctumModalOpen] = useState(false);
  const [registryAuthTab, setRegistryAuthTab] = useState('signup'); // 'signup' | 'login'
  const [registryUsername, setRegistryUsername] = useState('');
  const [registryEmail, setRegistryEmail] = useState('');
  const [registryPassword, setRegistryPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registryHouse, setRegistryHouse] = useState('Alabaster Archmage');
  const [registryLoading, setRegistryLoading] = useState(false);
  const [registryError, setRegistryError] = useState('');
  const [registrySuccessMsg, setRegistrySuccessMsg] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(() => (navigator.onLine ? 'Online' : 'Offline'));
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const lastRecordedFenRef = useRef('');

  // Step 2 In-Game Telemetry & Confirmation States
  const [returnConfirmOpen, setReturnConfirmOpen] = useState(false);
  const [resignConfirmOpen, setResignConfirmOpen] = useState(false);
  const [drawOfferStatus, setDrawOfferStatus] = useState('');
  const [gameThemeVaultOpen, setGameThemeVaultOpen] = useState(false);
  const [gameThemeFilter, setGameThemeFilter] = useState('all');
  const [gameThemeDropdownOpen, setGameThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef(null);
  const [queuedInvites, setQueuedInvites] = useState([]);
  const [whiteClockSec, setWhiteClockSec] = useState(600);
  const [blackClockSec, setBlackClockSec] = useState(600);
  const [isTimedMatch, setIsTimedMatch] = useState(true);
  const [matchDurationMin, setMatchDurationMin] = useState(10); // 3 | 5 | 10 | 15 | 0 (Untimed)

  const handleSetTimeControl = useCallback((minutes) => {
    if (currentScreen === 'game' && isGameActive) return;
    setMatchDurationMin(minutes);
    if (minutes === 0) {
      setIsTimedMatch(false);
    } else {
      setIsTimedMatch(true);
      setWhiteClockSec(minutes * 60);
      setBlackClockSec(minutes * 60);
    }
    audioCtrl.playSelect();
  }, [currentScreen, isGameActive]);

  // Auto-close open popups on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        setGameThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-close Sanctum Registry and other open modals when a match becomes active
  useEffect(() => {
    if (isGameActive) {
      setSanctumModalOpen(false);
      setAuthModalOpen(false);
      setShowVolumePopup(false);
      setGameThemeDropdownOpen(false);
    }
  }, [isGameActive]);

  // Ensure 3D board background is always auto-orbiting and positioned on the right side on the Home screen
  useEffect(() => {
    currentScreenRef.current = currentScreen;
    const eng = engineRef.current;
    if (!eng) return;
    if (currentScreen !== 'game') {
      eng.autoOrbit = true;
      eng.targetPhi = 0.92;
      eng.targetRadius = 16.0;
      if (eng.camera && window.innerWidth >= 1024) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        eng.camera.setViewOffset(w, h, -Math.round(w * 0.15), 0, w, h);
        eng.camera.updateProjectionMatrix();
      }
    } else {
      if (eng.camera) {
        eng.camera.clearViewOffset();
        eng.camera.updateProjectionMatrix();
      }
    }
  }, [currentScreen]);

  // Remove any legacy database connection strings from local storage
  useEffect(() => {
    try {
      localStorage.removeItem('wizards_chess_neon_url');
      localStorage.removeItem('wizards_chess_node_api');
    } catch (e) {}
  }, []);

  // Monitor real network connectivity
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('Online');
    const handleOffline = () => setConnectionStatus('Offline');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // User Profile, Friends & Match History State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('wizards_react_user_v1'));
      if (saved && saved.username) return saved;
    } catch (e) {}
    return { username: 'Guest_Player', isGuest: true, wins: 0, losses: 0, draws: 0 };
  });

  const [wizardsDirectory, setWizardsDirectory] = useState(() => {
    const now = Date.now();
    return [
      { username: 'Morgana_LeFay', house: 'Obsidian Order • AI Practice', isAiPractice: true, wins: 42, losses: 11, draws: 4, online: true, isFriend: true, lastSeen: now },
      { username: 'Cedric_Storm', house: 'Imperial Order • AI Practice', isAiPractice: true, wins: 29, losses: 14, draws: 3, online: true, isFriend: true, lastSeen: now },
      { username: 'Aurelia_Crown', house: 'Sapphire Order • AI Practice', isAiPractice: true, wins: 19, losses: 8, draws: 5, online: false, isFriend: true, lastSeen: now - 600000 },
      { username: 'Balthazar_Rune', house: 'Emerald Order • AI Practice', isAiPractice: true, wins: 34, losses: 19, draws: 2, online: true, isFriend: false, lastSeen: now },
      { username: 'Seraphina_Vale', house: 'Alabaster Order • AI Practice', isAiPractice: true, wins: 51, losses: 9, draws: 6, online: true, isFriend: false, lastSeen: now },
      { username: 'Draco_Obsidian', house: 'Obsidian Order • AI Practice', isAiPractice: true, wins: 16, losses: 15, draws: 1, online: false, isFriend: false, lastSeen: now - 900000 }
    ];
  });

  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [friendSearchResults, setFriendSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeFriendOpponent, setActiveFriendOpponent] = useState(null);
  const [incomingInvite, setIncomingInvite] = useState(null);
  const [matchHistoryVault, setMatchHistoryVault] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('wizards_react_history_v1'));
      if (Array.isArray(saved)) return saved;
    } catch (e) {}
    return [];
  });


  // Mutable 3D & Chess Engine Refs
  const engineRef = useRef({
    chess: null,
    scene: null,
    camera: null,
    renderer: null,
    piecesGroup: null,
    pieceMeshes: {},
    squareMeshes: {},
    highlightMeshes: {},
    materials: {},
    roseOuter: null,
    roseCore: null,
    lightCone: null,
    rimLightWhite: null,
    rimLightBlack: null,
    selectedSquare: null,
    legalMoves: [],
    isAnimating: false,
    camTheta: 0,
    camPhi: 0.92,
    camRadius: 16.0,
    targetTheta: 0,
    targetPhi: 0.92,
    targetRadius: 16.0,
    autoOrbit: true,
    screenShake: 0,
    activeFragments: [],
    rebuildPieces: null,
    applyTheme: null,
    executeMove3D: null,
    clearHighlights: null
  });

  const recordCompletedMatchToDB = useCallback(async (resultLabel, opponentName, movesArray, themeName, reason) => {
    // Only save history for signed-in users
    if (!currentUser || !currentUser.username) return;

    const eng = engineRef.current;
    const currentFen = eng.chess ? eng.chess.fen() : '';
    const finishKey = `${currentFen}_${resultLabel}_${movesArray ? movesArray.length : 0}`;
    // Prevent duplicate entries for the same game finish
    if (finishKey && finishKey === lastRecordedFenRef.current) return;
    if (finishKey) lastRecordedFenRef.current = finishKey;

    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        wins: resultLabel === 'VICTORY' ? (prev.wins || 0) + 1 : (prev.wins || 0),
        losses: resultLabel === 'DEFEAT' ? (prev.losses || 0) + 1 : (prev.losses || 0),
        draws: resultLabel === 'DRAW' ? (prev.draws || 0) + 1 : (prev.draws || 0)
      };
      localStorage.setItem('wizards_react_user_v1', JSON.stringify(updated));
      return updated;
    });

    const entry = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      opponent: opponentName,
      result: resultLabel,
      reason: reason || 'Concluded',
      timeControl: 'Standard (Untimed)',
      moves: movesArray && movesArray.length ? movesArray.join(' ') : 'Opening Phase',
      theme: themeName,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setMatchHistoryVault(prev => {
      const next = [entry, ...prev].slice(0, 40);
      localStorage.setItem('wizards_react_history_v1', JSON.stringify(next));
      return next;
    });

    // Sync to Node.js backend if available
    try {
      const token = localStorage.getItem('wizards_jwt_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      fetch('/api/history', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          playerUsername: currentUser.username,
          opponentName: entry.opponent,
          result: entry.result,
          movesSan: entry.moves,
          theme: entry.theme
        })
      }).catch(() => {});
    } catch (e) {}
  }, [currentUser]);

  const handleMatchConclusion = useCallback(({ result, winner, reason, opponent }) => {
    const eng = engineRef.current;
    const history = eng.chess ? eng.chess.history() : [];
    const moveCount = Math.ceil(history.length / 2);
    const themeObj = ROYAL_THEMES[royalTheme] || ROYAL_THEMES.sanctum;
    const themeName = themeObj.name;

    const finalOpponent = opponent || activeFriendOpponent || (gameMode === 'ai' ? `${playerColor === 'w' ? themeObj.blackOrderName : themeObj.whiteOrderName} AI (${aiDifficulty.toUpperCase()})` : 'Local Challenger');

    const details = {
      result, // 'VICTORY' | 'DEFEAT' | 'DRAW'
      winner: winner || (result === 'VICTORY' ? `You (${playerColor === 'w' ? 'White' : 'Black'})` : result === 'DEFEAT' ? finalOpponent : 'None (Draw)'),
      reason: reason || 'Checkmate',
      opponent: finalOpponent,
      moveCount: moveCount || 1,
      theme: themeName
    };

    setMatchResult(details);
    setIsInspectingBoard(false);
    setGameOverText(result);

    // Audio triggers per Step 4 Requirement 2
    if (result === 'VICTORY') {
      setSubStatusText('Glorious Victory! The Crown of Gold is yours.');
      audioCtrl.playVictoryMusic(setMusicPlaying);
    } else if (result === 'DEFEAT') {
      setSubStatusText(`${details.winner} triumphs. Defeat is the forge of mastery.`);
      audioCtrl.playDefeatOrDrawMusic(setMusicPlaying);
    } else {
      setSubStatusText(`Honourable draw concluded by ${reason || 'mutual agreement'}.`);
      audioCtrl.playDefeatOrDrawMusic(setMusicPlaying);
    }

    // Auto-record once to database / history vault per Step 4 Requirement 1
    recordCompletedMatchToDB(result, finalOpponent, history, themeName, reason);
  }, [activeFriendOpponent, aiDifficulty, gameMode, playerColor, recordCompletedMatchToDB, royalTheme]);

  // Chess clocks countdown for timed & online games
  useEffect(() => {
    if (!isGameActive || gameOverText || matchResult) return;
    if (!isTimedMatch && gameMode !== 'online' && !activeFriendOpponent) return;

    const timer = setInterval(() => {
      if (turnColor === 'w') {
        setWhiteClockSec(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            const playerLost = playerColor === 'w';
            const opp = activeFriendOpponent || (gameMode === 'ai' ? `${ROYAL_THEMES[royalTheme][playerColor === 'w' ? 'blackOrderName' : 'whiteOrderName']} AI (${aiDifficulty.toUpperCase()})` : 'Opponent');
            handleMatchConclusion({
              result: playerLost ? 'DEFEAT' : 'VICTORY',
              winner: playerLost ? opp : `You (${playerColor === 'w' ? 'White' : 'Black'})`,
              reason: 'Timeout',
              opponent: opp
            });
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackClockSec(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            const playerLost = playerColor === 'b';
            const opp = activeFriendOpponent || (gameMode === 'ai' ? `${ROYAL_THEMES[royalTheme][playerColor === 'w' ? 'blackOrderName' : 'whiteOrderName']} AI (${aiDifficulty.toUpperCase()})` : 'Opponent');
            handleMatchConclusion({
              result: playerLost ? 'DEFEAT' : 'VICTORY',
              winner: playerLost ? opp : `You (${playerColor === 'w' ? 'White' : 'Black'})`,
              reason: 'Timeout',
              opponent: opp
            });
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, gameOverText, matchResult, isTimedMatch, gameMode, activeFriendOpponent, turnColor, playerColor, royalTheme, aiDifficulty, handleMatchConclusion]);

  useEffect(() => {
    // Attempt soundtrack autoplay on initial load
    const lTheme = LANDING_THEMES[landingTheme] || LANDING_THEMES['royal-gold'];
    audioCtrl.playTrack(lTheme.musicFile, lTheme.musicName, true, (playing, title) => {
      setMusicPlaying(playing);
      setCurrentMusicTitle(title || lTheme.musicName);
    });

    const unlockAudio = () => {
      audioCtrl.ensureCtx();
      const a = audioCtrl.getAudio();
      if (a) {
        if (!audioCtrl.isMuted) {
          a.muted = false;
          a.volume = audioCtrl.musicVolume;
        }
        if (audioCtrl.wantsMusic && a.paused) {
          const p = a.play();
          if (p !== undefined) {
            p.then(() => {
              setMusicPlaying(true);
              audioCtrl.musicPlaying = true;
              unlockEvents.forEach(evt => {
                window.removeEventListener(evt, unlockAudio, { capture: true });
                document.removeEventListener(evt, unlockAudio, { capture: true });
              });
            }).catch(() => {});
          }
        }
      }
    };

    // Unlock on user gesture anywhere on window/document with capture: true
    const unlockEvents = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'];
    unlockEvents.forEach(evt => {
      window.addEventListener(evt, unlockAudio, { passive: true, capture: true });
      document.addEventListener(evt, unlockAudio, { passive: true, capture: true });
    });

    const a = audioCtrl.getAudio();
    const handleAudioPlay = () => setMusicPlaying(true);
    const handleAudioPause = () => setMusicPlaying(false);
    if (a) {
      a.addEventListener('play', handleAudioPlay);
      a.addEventListener('pause', handleAudioPause);
    }

    // Try unlocking immediately
    unlockAudio();

    // Live online presence heartbeat simulation every 15s
    const presenceInterval = setInterval(() => {
      setWizardsDirectory(prev =>
        prev.map(w => (Math.random() < 0.14 ? { ...w, online: !w.online } : w))
      );
    }, 15000);

    return () => {
      unlockEvents.forEach(evt => {
        window.removeEventListener(evt, unlockAudio, { capture: true });
        document.removeEventListener(evt, unlockAudio, { capture: true });
      });
      if (a) {
        a.removeEventListener('play', handleAudioPlay);
        a.removeEventListener('pause', handleAudioPause);
      }
      clearInterval(presenceInterval);
    };
  }, []);

  const syncHudFromChess = useCallback(() => {
    const chess = engineRef.current.chess;
    if (!chess) return;

    const turn = chess.turn();
    const themeObj = ROYAL_THEMES[royalTheme] || ROYAL_THEMES.sanctum;
    setTurnColor(turn);
    setInCheck(chessInCheck(chess));

    const verboseHistory = chess.history({ verbose: true });
    setMoveHistory(verboseHistory.map((m, i) => ({ num: i + 1, san: m.san })));

    const symbols = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛' };
    const capW = [];
    const capB = [];
    verboseHistory.forEach(m => {
      if (m.captured) {
        if (m.color === 'w') capB.push(symbols[m.captured] || '♟');
        else capW.push(symbols[m.captured] || '♟');
      }
    });
    setCapturedByWhite(capW);
    setCapturedByBlack(capB);

    if (chessInCheckmate(chess)) {
      const winnerSide = turn === 'w' ? 'b' : 'w';
      const winnerName = winnerSide === 'w' ? 'White' : 'Black';
      const playerWon = (winnerSide === playerColor);
      const opp = activeFriendOpponent || (gameMode === 'ai' ? `${ROYAL_THEMES[royalTheme][playerColor === 'w' ? 'blackOrderName' : 'whiteOrderName']} AI (${aiDifficulty.toUpperCase()})` : 'Local Challenger');
      const winnerDisplay = gameMode === 'local'
        ? `${winnerName} Order`
        : (playerWon ? `You (${playerColor === 'w' ? 'White' : 'Black'})` : opp);

      handleMatchConclusion({
        result: (gameMode === 'local' || playerWon) ? 'VICTORY' : 'DEFEAT',
        winner: winnerDisplay,
        reason: 'Checkmate',
        opponent: opp
      });
      return;
    }

    let drawReason = null;
    if (chessInStalemate(chess)) drawReason = 'Stalemate';
    else if (chessInThreefoldRepetition(chess)) drawReason = 'Threefold Repetition';
    else if (chessInInsufficientMaterial(chess)) drawReason = 'Insufficient Material';
    else if (chessInDraw(chess)) drawReason = 'Draw';

    if (drawReason) {
      const opp = activeFriendOpponent || (gameMode === 'ai' ? `${ROYAL_THEMES[royalTheme][playerColor === 'w' ? 'blackOrderName' : 'whiteOrderName']} AI (${aiDifficulty.toUpperCase()})` : 'Local Challenger');
      handleMatchConclusion({
        result: 'DRAW',
        winner: 'None (Draw)',
        reason: drawReason,
        opponent: opp
      });
      return;
    }

    if (turn === playerColor) {
      setSubStatusText(`Your Turn (${playerColor === 'w' ? themeObj.whiteOrderName : themeObj.blackOrderName}) • Command your sculptures`);
    } else {
      const opp = activeFriendOpponent || (gameMode === 'ai' ? `${playerColor === 'w' ? themeObj.blackOrderName : themeObj.whiteOrderName} AI (${aiDifficulty.toUpperCase()})` : 'Challenger');
      setSubStatusText(`${opp} • Calculating strategic moves`);
    }
  }, [activeFriendOpponent, aiDifficulty, gameMode, handleMatchConclusion, playerColor, royalTheme]);


  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const eng = engineRef.current;
    eng.chess = new Chess();

    // 1. Scene, Camera & WebGLRenderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09080d);
    scene.fog = new THREE.FogExp2(0x09080d, 0.024);
    eng.scene = scene;

    const isMobileDevice = typeof window !== 'undefined' && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768);
    const isTabletDevice = typeof window !== 'undefined' && (window.innerWidth >= 768 && window.innerWidth <= 1024);

    const initialFov = container.clientWidth < 640 ? 54 : container.clientWidth < 1024 ? 46 : 42;
    const camera = new THREE.PerspectiveCamera(initialFov, container.clientWidth / container.clientHeight, 0.1, 150);
    eng.camera = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobileDevice,
      powerPreference: isMobileDevice ? 'default' : 'high-performance',
      precision: isMobileDevice ? 'mediump' : 'highp'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isMobileDevice ? 1.0 : isTabletDevice ? 1.25 : Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = !isMobileDevice;
    if (!isMobileDevice) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.shadowMap.autoUpdate = false;
      renderer.shadowMap.needsUpdate = true;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.42;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    eng.renderer = renderer;
    eng.pieceMeshList = [];

    // 2. Cathedral Lighting & Radiant Illumination
    scene.add(new THREE.AmbientLight(0xdcd5f2, 0.96));
    const mainSpot = new THREE.SpotLight(0xfff6e4, 3.4);
    mainSpot.position.set(6, 18, 8);
    mainSpot.angle = Math.PI / 2.7;
    mainSpot.penumbra = 0.65;
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 1024;
    mainSpot.shadow.mapSize.height = 1024;
    mainSpot.shadow.bias = -0.0005;
    scene.add(mainSpot);

    const fillLight = new THREE.DirectionalLight(0xfff5e4, 0.82);
    fillLight.position.set(-8, 14, -6);
    scene.add(fillLight);

    const bounceLight = new THREE.DirectionalLight(0xebe5ff, 0.4);
    bounceLight.position.set(0, -6, 0);
    scene.add(bounceLight);

    const rimWhite = new THREE.DirectionalLight(0xfde68a, 1.25);
    rimWhite.position.set(0, 9, 13);
    scene.add(rimWhite);
    eng.rimLightWhite = rimWhite;

    const rimBlack = new THREE.DirectionalLight(0xc084fc, 1.25);
    rimBlack.position.set(0, 9, -13);
    scene.add(rimBlack);
    eng.rimLightBlack = rimBlack;

    // 3. Five Distinct Bespoke 3D World Architectures (1-to-1 with Royal Themes)

    // A. Sanctum Cathedral World
    const sanctumGroup = new THREE.Group();
    scene.add(sanctumGroup);
    const sanctumStoneMat = new THREE.MeshStandardMaterial({ color: 0x1a1724, roughness: 0.85, metalness: 0.15 });
    const sanctumAltar = new THREE.Mesh(new THREE.BoxGeometry(10.8, 1.2, 10.8), sanctumStoneMat);
    sanctumAltar.position.y = -0.75;
    sanctumAltar.receiveShadow = true;
    sanctumGroup.add(sanctumAltar);

    const sanctumStep = new THREE.Mesh(new THREE.BoxGeometry(12.6, 0.45, 12.6), sanctumStoneMat);
    sanctumStep.position.y = -1.35;
    sanctumStep.receiveShadow = true;
    sanctumGroup.add(sanctumStep);

    const pillarGeo = new THREE.CylinderGeometry(0.55, 0.7, 22, 12);
    [[-11, -11], [11, -11], [-11, 11], [11, 11], [-11, 0], [11, 0], [0, -13], [0, 13]].forEach(([px, pz]) => {
      const pillar = new THREE.Mesh(pillarGeo, sanctumStoneMat);
      pillar.position.set(px, 8, pz);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      sanctumGroup.add(pillar);
    });

    // Cathedral Gothic Ribbed Vault Ceiling Arches (Gallery Image 1)
    const vaultArchGeo = new THREE.TorusGeometry(11.2, 0.24, 8, 32, Math.PI);
    [-11, 0, 11].forEach(az => {
      const rib = new THREE.Mesh(vaultArchGeo, sanctumStoneMat);
      rib.position.set(0, 16.5, az);
      sanctumGroup.add(rib);
    });
    // Diagonal Groin Vault Crossing Ribs
    const diagRib1 = new THREE.Mesh(new THREE.TorusGeometry(15.2, 0.20, 8, 32, Math.PI), sanctumStoneMat);
    diagRib1.position.set(0, 17.5, 0);
    diagRib1.rotation.y = Math.PI / 4;
    sanctumGroup.add(diagRib1);
    const diagRib2 = new THREE.Mesh(new THREE.TorusGeometry(15.2, 0.20, 8, 32, Math.PI), sanctumStoneMat);
    diagRib2.position.set(0, 17.5, 0);
    diagRib2.rotation.y = -Math.PI / 4;
    sanctumGroup.add(diagRib2);

    // Left and Right Gothic Nave Interior Walls with Stained-Glass Lancet Windows
    [-14.2, 14.2].forEach((wx, wIdx) => {
      const naveWall = new THREE.Mesh(new THREE.BoxGeometry(1.2, 22, 34), sanctumStoneMat);
      naveWall.position.set(wx, 8.5, 0);
      sanctumGroup.add(naveWall);

      // 3 Arched Stained Glass Lancet Windows per wall
      [-9, 0, 9].forEach(wz => {
        const winGlass = new THREE.Mesh(
          new THREE.PlaneGeometry(1.5, 6.4),
          new THREE.MeshBasicMaterial({
            color: wz === 0 ? 0xfbbf24 : 0xa855f7,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending
          })
        );
        winGlass.position.set(wx - (wIdx === 0 ? -0.58 : 0.58), 8.5, wz);
        winGlass.rotation.y = Math.PI / 2;
        sanctumGroup.add(winGlass);

        const winLight = new THREE.PointLight(wz === 0 ? 0xfbbf24 : 0xa855f7, 1.2, 9, 2);
        winLight.position.set(wx - (wIdx === 0 ? -0.85 : 0.85), 8.5, wz);
        sanctumGroup.add(winLight);
      });
    });

    const roseOuter = new THREE.Mesh(
      new THREE.RingGeometry(2.6, 4.4, 32),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
    );
    roseOuter.position.set(0, 9.8, -18);
    sanctumGroup.add(roseOuter);

    const roseCore = new THREE.Mesh(
      new THREE.CircleGeometry(2.2, 32),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    roseCore.position.set(0, 9.8, -17.98);
    sanctumGroup.add(roseCore);

    const lightCone = new THREE.Mesh(
      new THREE.ConeGeometry(8.5, 22, 24, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xc084fc,
        transparent: true,
        opacity: 0.055,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    lightCone.position.set(0, 5.2, -7.5);
    lightCone.rotation.x = Math.PI / 3.1;
    sanctumGroup.add(lightCone);

    const sanctumBraziers = [];
    [[-6.3, -6.3], [6.3, -6.3], [-6.3, 6.3], [6.3, 6.3]].forEach(([bx, bz], idx) => {
      const bzGrp = new THREE.Group();
      bzGrp.position.set(bx, 0, bz);
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.46, 1.2, 8), sanctumStoneMat);
      ped.position.y = -0.38;
      bzGrp.add(ped);
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.36, 0.38, 8), new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.5, metalness: 0.8 }));
      bowl.position.y = 0.26;
      bzGrp.add(bowl);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.82, 8), new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }));
      flame.position.y = 0.68;
      bzGrp.add(flame);
      const light = new THREE.PointLight(0xc084fc, 2.2, 10, 2);
      light.position.y = 0.82;
      bzGrp.add(light);
      sanctumGroup.add(bzGrp);
      sanctumBraziers.push({ flame, light, idx });
    });

    // B. Imperial Siege Fortress World
    const imperialGroup = new THREE.Group();
    scene.add(imperialGroup);
    imperialGroup.visible = false;
    const fortressStoneMat = new THREE.MeshStandardMaterial({ color: 0x221316, roughness: 0.9, metalness: 0.1 });
    const fortressAltar = new THREE.Mesh(new THREE.BoxGeometry(11.2, 1.3, 11.2), fortressStoneMat);
    fortressAltar.position.y = -0.75;
    fortressAltar.receiveShadow = true;
    imperialGroup.add(fortressAltar);

    // Fortress Curtain Wall behind the battlefield
    const fortressWall = new THREE.Mesh(new THREE.BoxGeometry(26, 8, 2.4), fortressStoneMat);
    fortressWall.position.set(0, 3.2, -16);
    fortressWall.castShadow = true;
    fortressWall.receiveShadow = true;
    imperialGroup.add(fortressWall);

    // Wall Crenellations (Merlons)
    for (let i = -11; i <= 11; i += 3.2) {
      const merlon = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.5, 2.6), fortressStoneMat);
      merlon.position.set(i, 7.8, -16);
      merlon.castShadow = true;
      imperialGroup.add(merlon);
    }

    // 4 Heavy Fortress Bastion Towers with Arrow Slits
    const towerGeo = new THREE.CylinderGeometry(1.5, 1.8, 15, 8);
    const roofGeo = new THREE.ConeGeometry(1.8, 3.2, 8);
    [[-14, -14], [14, -14], [-14, 14], [14, 14]].forEach(([tx, tz]) => {
      const tower = new THREE.Mesh(towerGeo, fortressStoneMat);
      tower.position.set(tx, 6, tz);
      tower.castShadow = true;
      tower.receiveShadow = true;
      imperialGroup.add(tower);
      const roof = new THREE.Mesh(roofGeo, new THREE.MeshStandardMaterial({ color: 0x3b1219, roughness: 0.7, metalness: 0.4 }));
      roof.position.set(tx, 14.8, tz);
      roof.castShadow = true;
      imperialGroup.add(roof);
    });

    // Imperial Roaring Fire Cauldrons
    const imperialCauldrons = [];
    [[-6.4, -6.4], [6.4, -6.4], [-6.4, 6.4], [6.4, 6.4]].forEach(([bx, bz], idx) => {
      const cGrp = new THREE.Group();
      cGrp.position.set(bx, 0, bz);
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.55, 1.3, 8), fortressStoneMat);
      stand.position.y = -0.35;
      cGrp.add(stand);
      const cauldron = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.42, 0.45, 8), new THREE.MeshStandardMaterial({ color: 0x160a0c, roughness: 0.4, metalness: 0.85 }));
      cauldron.position.y = 0.3;
      cGrp.add(cauldron);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.34, 1.1, 8), new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending }));
      flame.position.y = 0.82;
      cGrp.add(flame);
      const light = new THREE.PointLight(0xf97316, 2.6, 11, 2);
      light.position.y = 0.95;
      cGrp.add(light);
      imperialGroup.add(cGrp);
      imperialCauldrons.push({ flame, light, idx });
    });

    // Imperial War Banners
    const imperialBanners = [];
    [[-8.5, 0, 7.8], [8.5, 0, 7.8], [-8.5, 0, -7.8], [8.5, 0, -7.8]].forEach((pos, idx) => {
      const bGrp = new THREE.Group();
      bGrp.position.set(pos[0], 0, pos[2]);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 7.5, 8), new THREE.MeshStandardMaterial({ color: 0x331015, roughness: 0.5, metalness: 0.7 }));
      pole.position.y = 2.5;
      bGrp.add(pole);
      const cloth = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 4.0), new THREE.MeshStandardMaterial({ color: idx < 2 ? 0xfacc15 : 0x991b1b, side: THREE.DoubleSide, roughness: 0.85 }));
      cloth.position.set(0, 3.4, 0.02);
      bGrp.add(cloth);
      imperialGroup.add(bGrp);
      imperialBanners.push({ mesh: bGrp, idx });
    });

    // C. Celestial Sapphire Astral Void World
    const sapphireGroup = new THREE.Group();
    scene.add(sapphireGroup);
    sapphireGroup.visible = false;
    const sapphireStoneMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.6 });
    const sapphireAltar = new THREE.Mesh(new THREE.CylinderGeometry(8.2, 8.6, 1.2, 32), sapphireStoneMat);
    sapphireAltar.position.y = -0.75;
    sapphireAltar.receiveShadow = true;
    sapphireGroup.add(sapphireAltar);

    // Glowing Concentric Arcane Summoning Rings
    const sapphireRings = [];
    [3.8, 6.8, 9.6].forEach((r, idx) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r, r + 0.16, 48),
        new THREE.MeshBasicMaterial({ color: idx % 2 === 0 ? 0x38bdf8 : 0x60a5fa, side: THREE.DoubleSide, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.02;
      sapphireGroup.add(ring);
      sapphireRings.push(ring);
    });

    // 6 Levitating Sapphire Crystal Obelisks (Floating in zero gravity)
    const sapphireObelisks = [];
    const crystalGeo = new THREE.ConeGeometry(0.55, 6.5, 4);
    const gemGeo = new THREE.OctahedronGeometry(0.85, 0);
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0c4a6e, roughness: 0.2, metalness: 0.9, transparent: true, opacity: 0.85 });
    [[-11, 4.5, -11], [11, 6.0, -11], [-11, 5.0, 11], [11, 4.2, 11], [-13, 6.5, 0], [13, 5.5, 0]].forEach(([ox, oy, oz], idx) => {
      const obGrp = new THREE.Group();
      obGrp.position.set(ox, oy, oz);
      obGrp.userData.baseY = oy;
      const cMesh = new THREE.Mesh(crystalGeo, crystalMat);
      cMesh.rotation.z = Math.PI;
      obGrp.add(cMesh);
      const gMesh = new THREE.Mesh(gemGeo, crystalMat);
      gMesh.position.y = 3.6;
      obGrp.add(gMesh);
      sapphireGroup.add(obGrp);
      sapphireObelisks.push(obGrp);
    });

    // 4 Cyan Energy Beacon Pylons
    const sapphirePylons = [];
    [[-6.2, -6.2], [6.2, -6.2], [-6.2, 6.2], [6.2, 6.2]].forEach(([bx, bz], idx) => {
      const pGrp = new THREE.Group();
      pGrp.position.set(bx, 0, bz);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.44, 1.2, 8), sapphireStoneMat);
      base.position.y = -0.38;
      pGrp.add(base);
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      orb.position.y = 0.55;
      pGrp.add(orb);
      const light = new THREE.PointLight(0x60a5fa, 2.0, 9, 2);
      light.position.y = 0.7;
      pGrp.add(light);
      sapphireGroup.add(pGrp);
      sapphirePylons.push({ orb, light, idx });
    });

    // D. Emerald Overgrown Gargoyle Ruins World
    const emeraldGroup = new THREE.Group();
    scene.add(emeraldGroup);
    emeraldGroup.visible = false;
    const ruinStoneMat = new THREE.MeshStandardMaterial({ color: 0x0f2219, roughness: 0.95, metalness: 0.05 });
    const emeraldAltar = new THREE.Mesh(new THREE.BoxGeometry(10.8, 1.2, 10.8), ruinStoneMat);
    emeraldAltar.position.y = -0.75;
    emeraldAltar.receiveShadow = true;
    emeraldGroup.add(emeraldAltar);

    // Broken Ruin Pillars of Staggered Heights
    [
      { pos: [-11, -11], h: 6.5 },
      { pos: [11, -11], h: 10.5 },
      { pos: [-11, 11], h: 4.2 },
      { pos: [11, 11], h: 8.0 },
      { pos: [-11, 0], h: 9.5 },
      { pos: [11, 0], h: 5.2 },
      { pos: [0, -14], h: 7.0 }
    ].forEach(({ pos, h }) => {
      const rPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, h, 10), ruinStoneMat);
      rPillar.position.set(pos[0], h / 2 - 1.2, pos[1]);
      rPillar.castShadow = true;
      rPillar.receiveShadow = true;
      emeraldGroup.add(rPillar);
    });

    // 4 Ancient Glowing Celtic Runic Standing Stones (Menhirs)
    const emeraldMonoliths = [];
    [[-8.5, -8.5], [8.5, -8.5], [-8.5, 8.5], [8.5, 8.5]].forEach(([mx, mz], idx) => {
      const mMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 5.2, 0.45),
        new THREE.MeshStandardMaterial({ color: 0x0a1d15, emissive: 0x10b981, emissiveIntensity: 0.45, roughness: 0.8, metalness: 0.2 })
      );
      mMesh.position.set(mx, 2.0, mz);
      mMesh.rotation.y = idx * 0.8;
      mMesh.castShadow = true;
      emeraldGroup.add(mMesh);
      emeraldMonoliths.push(mMesh);
    });

    // Green Soul-Fire Lanterns
    const emeraldLanterns = [];
    [[-6.2, -6.2], [6.2, -6.2], [-6.2, 6.2], [6.2, 6.2]].forEach(([bx, bz], idx) => {
      const lGrp = new THREE.Group();
      lGrp.position.set(bx, 0, bz);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.4, 1.2, 8), ruinStoneMat);
      post.position.y = -0.38;
      lGrp.add(post);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.85, 8), new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }));
      flame.position.y = 0.65;
      lGrp.add(flame);
      const light = new THREE.PointLight(0x34d399, 2.2, 9, 2);
      light.position.y = 0.8;
      lGrp.add(light);
      emeraldGroup.add(lGrp);
      emeraldLanterns.push({ flame, light, idx });
    });

    // E. Solar Citadel Golden Sun Colosseum World
    const solarGroup = new THREE.Group();
    scene.add(solarGroup);
    solarGroup.visible = false;
    const solarGoldMat = new THREE.MeshStandardMaterial({ color: 0x452208, roughness: 0.35, metalness: 0.75 });
    const solarAltar = new THREE.Mesh(new THREE.BoxGeometry(11.0, 1.2, 11.0), solarGoldMat);
    solarAltar.position.y = -0.75;
    solarAltar.receiveShadow = true;
    solarGroup.add(solarAltar);

    // 8 Classical Fluted Golden Colonnade Pillars with Sun Capitals
    const colGeo = new THREE.CylinderGeometry(0.65, 0.75, 18, 16);
    const capGeo = new THREE.BoxGeometry(1.6, 0.6, 1.6);
    [[-11, -11], [11, -11], [-11, 11], [11, 11], [-11, 0], [11, 0], [0, -14], [0, 14]].forEach(([px, pz]) => {
      const col = new THREE.Mesh(colGeo, solarGoldMat);
      col.position.set(px, 7.8, pz);
      col.castShadow = true;
      col.receiveShadow = true;
      solarGroup.add(col);
      const cap = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.85 }));
      cap.position.set(px, 16.8, pz);
      solarGroup.add(cap);
    });

    // Massive Radiant Solar Sunburst Halo Disc behind the Colosseum
    const solarSunburst = new THREE.Group();
    solarSunburst.position.set(0, 10.5, -18);
    const sunDisc = new THREE.Mesh(
      new THREE.RingGeometry(2.8, 4.6, 32),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    solarSunburst.add(sunDisc);

    // Radiating Sun Flare Rays
    const flareGeo = new THREE.ConeGeometry(0.38, 2.8, 3);
    const flareMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide });
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * Math.PI * 2;
      const flare = new THREE.Mesh(flareGeo, flareMat);
      flare.position.set(Math.cos(ang) * 5.2, Math.sin(ang) * 5.2, 0);
      flare.rotation.z = ang - Math.PI / 2;
      solarSunburst.add(flare);
    }
    solarGroup.add(solarSunburst);

    // Golden Sunfire Braziers
    const solarBraziers = [];
    [[-6.3, -6.3], [6.3, -6.3], [-6.3, 6.3], [6.3, 6.3]].forEach(([bx, bz], idx) => {
      const sGrp = new THREE.Group();
      sGrp.position.set(bx, 0, bz);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.48, 1.2, 8), solarGoldMat);
      base.position.y = -0.38;
      sGrp.add(base);
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.38, 0.38, 8), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.85 }));
      bowl.position.y = 0.26;
      sGrp.add(bowl);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.9, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending }));
      flame.position.y = 0.72;
      sGrp.add(flame);
      const light = new THREE.PointLight(0xfde047, 2.4, 10, 2);
      light.position.y = 0.85;
      sGrp.add(light);
      solarGroup.add(sGrp);
      solarBraziers.push({ flame, light, idx });
    });

    // =========================================================================
    // F. CRIMSON CRYPT WORLD (Horror 1) - Gothic Bloodmoon Crypt with Bloodfires
    // =========================================================================
    const cryptGroup = new THREE.Group();
    scene.add(cryptGroup);
    cryptGroup.visible = false;
    const cryptStoneMat = new THREE.MeshStandardMaterial({ color: 0x14060a, roughness: 0.85, metalness: 0.3 });
    const cryptBloodMat = new THREE.MeshStandardMaterial({ color: 0x590815, roughness: 0.4, metalness: 0.6 });
    const cryptAltar = new THREE.Mesh(new THREE.BoxGeometry(11.2, 1.3, 11.2), cryptStoneMat);
    cryptAltar.position.y = -0.75;
    cryptAltar.receiveShadow = true;
    cryptGroup.add(cryptAltar);

    // Glowing Blood Moon behind crypt
    const cryptMoon = new THREE.Mesh(
      new THREE.SphereGeometry(3.6, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xbe123c })
    );
    cryptMoon.position.set(0, 11, -19);
    cryptGroup.add(cryptMoon);
    const cryptMoonGlow = new THREE.Mesh(
      new THREE.RingGeometry(3.8, 5.2, 32),
      new THREE.MeshBasicMaterial({ color: 0xe11d48, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
    );
    cryptMoonGlow.position.set(0, 11, -18.9);
    cryptGroup.add(cryptMoonGlow);

    // Ruined Gothic Stone Arch framing the Blood Moon (Gallery Image 3)
    const cryptArch = new THREE.Mesh(
      new THREE.TorusGeometry(5.2, 0.48, 8, 28, Math.PI),
      cryptStoneMat
    );
    cryptArch.position.set(0, 11.0, -18.2);
    cryptGroup.add(cryptArch);

    // Gothic Bone Crypt Pillars (4 corner spires)
    const cryptPillarGeo = new THREE.CylinderGeometry(0.55, 0.8, 17, 8);
    const cryptPillars = [];
    [[-10, -10], [10, -10], [-10, 10], [10, 10]].forEach(([px, pz]) => {
      const pil = new THREE.Mesh(cryptPillarGeo, cryptStoneMat);
      pil.position.set(px, 7.5, pz);
      pil.castShadow = true;
      cryptGroup.add(pil);
      const topSpire = new THREE.Mesh(new THREE.ConeGeometry(0.8, 3, 6), cryptBloodMat);
      topSpire.position.set(px, 17.5, pz);
      cryptGroup.add(topSpire);
      cryptPillars.push(pil);
    });

    // 4 Bloodflame Braziers + 1 Central Fire Ring beneath the chessboard
    const cryptBraziers = [];
    [[-6.2, -6.2], [6.2, -6.2], [-6.2, 6.2], [6.2, 6.2]].forEach(([bx, bz], idx) => {
      const bGrp = new THREE.Group();
      bGrp.position.set(bx, 0, bz);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.5, 1.1, 8), cryptStoneMat);
      base.position.y = -0.4;
      bGrp.add(base);
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.35, 0.4, 8), cryptBloodMat);
      bowl.position.y = 0.25;
      bGrp.add(bowl);
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.32, 1.1, 8),
        new THREE.MeshBasicMaterial({ color: 0xff1e42, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending })
      );
      flame.position.y = 0.85;
      bGrp.add(flame);
      const light = new THREE.PointLight(0xff0033, 2.8, 11, 2);
      light.position.y = 0.95;
      bGrp.add(light);
      cryptGroup.add(bGrp);
      cryptBraziers.push({ flame, light, idx });
    });

    // Central Crypt Chasm Under-Glow Fire
    const cryptCentralFire = new THREE.PointLight(0xe11d48, 2.5, 9, 2);
    cryptCentralFire.position.set(0, 0.3, 0);
    cryptGroup.add(cryptCentralFire);

    // =========================================================================
    // G. SPECTRAL NECROPOLIS WORLD (Horror 2) - Floating Monoliths & Soulfire
    // =========================================================================
    const necropolisGroup = new THREE.Group();
    scene.add(necropolisGroup);
    necropolisGroup.visible = false;
    const necroStoneMat = new THREE.MeshStandardMaterial({ color: 0x051b1f, roughness: 0.7, metalness: 0.5 });
    const necroAltar = new THREE.Mesh(new THREE.BoxGeometry(11.0, 1.2, 11.0), necroStoneMat);
    necroAltar.position.y = -0.75;
    necroAltar.receiveShadow = true;
    necropolisGroup.add(necroAltar);

    // Floating Anti-Gravity Spectral Monoliths
    const necroMonoliths = [];
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const dist = 12.5;
      const m = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.4, 0),
        new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.3, metalness: 0.8, emissive: 0x14b8a6, emissiveIntensity: 0.45 })
      );
      m.position.set(Math.cos(ang) * dist, 6.5, Math.sin(ang) * dist);
      m.userData = { baseAngle: ang, dist, baseY: 6.5, speed: 0.4 + i * 0.1 };
      necropolisGroup.add(m);
      necroMonoliths.push(m);
    }

    // Rotating Spectral Rune Ring
    const necroRuneRing = new THREE.Mesh(
      new THREE.RingGeometry(7.5, 9.5, 48),
      new THREE.MeshBasicMaterial({ color: 0x2dd4bf, side: THREE.DoubleSide, transparent: true, opacity: 0.55, wireframe: true })
    );
    necroRuneRing.rotation.x = Math.PI / 2;
    necroRuneRing.position.y = -0.15;
    necropolisGroup.add(necroRuneRing);

    // Soul-Fire Altars with teal/cyan soul flames
    const necroBraziers = [];
    [[-6.2, -6.2], [6.2, -6.2], [-6.2, 6.2], [6.2, 6.2]].forEach(([bx, bz], idx) => {
      const bGrp = new THREE.Group();
      bGrp.position.set(bx, 0, bz);
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 1.2, 6), necroStoneMat);
      ped.position.y = -0.35;
      bGrp.add(ped);
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 1.1, 8),
        new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending })
      );
      flame.position.y = 0.85;
      bGrp.add(flame);
      const light = new THREE.PointLight(0x14b8a6, 2.5, 10, 2);
      light.position.y = 0.95;
      bGrp.add(light);
      necropolisGroup.add(bGrp);
      necroBraziers.push({ flame, light, idx });
    });

    // Central Soulfire Light
    const necroCenterLight = new THREE.PointLight(0x2dd4bf, 2.2, 8, 2);
    necroCenterLight.position.set(0, 0.35, 0);
    necropolisGroup.add(necroCenterLight);

    // =========================================================================
    // H. FORGOTTEN TEMPLE WORLD (Adventure 1) - Aztec Ruins, Sun Disc & Tiki Fire
    // =========================================================================
    const jungleGroup = new THREE.Group();
    scene.add(jungleGroup);
    jungleGroup.visible = false;
    const templeStoneMat = new THREE.MeshStandardMaterial({ color: 0x1a2b16, roughness: 0.85, metalness: 0.2 });
    const templeGoldMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.3, metalness: 0.85 });
    const templeAltar = new THREE.Mesh(new THREE.BoxGeometry(11.4, 1.2, 11.4), templeStoneMat);
    templeAltar.position.y = -0.75;
    templeAltar.receiveShadow = true;
    jungleGroup.add(templeAltar);

    // Stepped Aztec Pyramid Pillars
    const junglePillars = [];
    [[-11, -11], [11, -11], [-11, 11], [11, 11]].forEach(([px, pz]) => {
      const pGrp = new THREE.Group();
      pGrp.position.set(px, 0, pz);
      const baseBlock = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4, 2.4), templeStoneMat);
      baseBlock.position.y = 2;
      pGrp.add(baseBlock);
      const midBlock = new THREE.Mesh(new THREE.BoxGeometry(1.8, 5, 1.8), templeStoneMat);
      midBlock.position.y = 6.5;
      pGrp.add(midBlock);
      const topGoldIdol = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9), templeGoldMat);
      topGoldIdol.position.y = 10;
      pGrp.add(topGoldIdol);
      jungleGroup.add(pGrp);
      junglePillars.push(topGoldIdol);
    });

    // Giant Rotating Aztec Sun Calendar Disc
    const aztecSunDisc = new THREE.Group();
    aztecSunDisc.position.set(0, 10.5, -18);
    const discOuter = new THREE.Mesh(
      new THREE.RingGeometry(3.5, 5.2, 32),
      new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.35, metalness: 0.8, side: THREE.DoubleSide })
    );
    aztecSunDisc.add(discOuter);
    const discInner = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 16),
      new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.5, metalness: 0.6 })
    );
    aztecSunDisc.add(discInner);
    jungleGroup.add(aztecSunDisc);

    // Tiki Fire Bowls with leaping orange fire
    const jungleBraziers = [];
    [[-6.3, -6.3], [6.3, -6.3], [-6.3, 6.3], [6.3, 6.3]].forEach(([bx, bz], idx) => {
      const bGrp = new THREE.Group();
      bGrp.position.set(bx, 0, bz);
      const woodBase = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.44, 1.1, 8), templeStoneMat);
      woodBase.position.y = -0.38;
      bGrp.add(woodBase);
      const goldBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.4, 0.45, 8), templeGoldMat);
      goldBowl.position.y = 0.28;
      bGrp.add(goldBowl);
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.35, 1.15, 8),
        new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending })
      );
      flame.position.y = 0.9;
      bGrp.add(flame);
      const light = new THREE.PointLight(0xfacc15, 2.6, 11, 2);
      light.position.y = 1.0;
      bGrp.add(light);
      jungleGroup.add(bGrp);
      jungleBraziers.push({ flame, light, idx });
    });

    // Central Jungle Hearth Light
    const jungleCenterLight = new THREE.PointLight(0xf97316, 2.4, 9, 2);
    jungleCenterLight.position.set(0, 0.35, 0);
    jungleGroup.add(jungleCenterLight);

    // =========================================================================
    // I. GLACIAL SUMMIT WORLD (Adventure 2) - Himalayas, Frozen Ice Board & Aurora Borealis
    // =========================================================================
    const glacialGroup = new THREE.Group();
    scene.add(glacialGroup);
    glacialGroup.visible = false;
    const frostStoneMat = new THREE.MeshStandardMaterial({
      color: 0x0a2238,
      roughness: 0.15,
      metalness: 0.8,
      transparent: true,
      opacity: 0.88
    });
    const iceCrystalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });

    // 1. Translucent Frozen Blue Ice Altar Slab
    const glacialAltar = new THREE.Mesh(new THREE.BoxGeometry(11.4, 1.3, 11.4), frostStoneMat);
    glacialAltar.position.y = -0.75;
    glacialAltar.receiveShadow = true;
    glacialGroup.add(glacialAltar);

    // 2. Hanging Translucent Icicle Stalactites along Altar Edges (Gallery Image 3)
    const icicleGeo = new THREE.ConeGeometry(0.16, 1.6, 6);
    icicleGeo.rotateX(Math.PI); // Point downward
    for (let ic = 0; ic < 28; ic++) {
      const side = ic % 4;
      const t = (Math.floor(ic / 4) / 7) - 0.5;
      const icicle = new THREE.Mesh(icicleGeo, iceCrystalMat);
      const span = 5.2;
      if (side === 0) icicle.position.set(t * span * 2, -1.4, -5.6);
      else if (side === 1) icicle.position.set(t * span * 2, -1.4, 5.6);
      else if (side === 2) icicle.position.set(-5.6, -1.4, t * span * 2);
      else icicle.position.set(5.6, -1.4, t * span * 2);
      icicle.scale.set(0.7 + Math.random() * 0.6, 0.7 + Math.random() * 0.7, 0.7 + Math.random() * 0.6);
      glacialGroup.add(icicle);
    }

    // 3. Towering Himalayan Mountain Range Perimeter (Gallery Image 3)
    const mountainRockMat = new THREE.MeshStandardMaterial({ color: 0x182436, roughness: 0.9, metalness: 0.15 });
    const snowCapMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.05 });
    const himalayanPeaks = [];
    const peakCount = 20;
    for (let p = 0; p < peakCount; p++) {
      const ang = (p / peakCount) * Math.PI * 2;
      const dist = 24 + (p % 3) * 5;
      const px = Math.cos(ang) * dist;
      const pz = Math.sin(ang) * dist;
      const peakHeight = 18 + ((p * 7) % 15) * 1.3;
      const baseRadius = 5 + (p % 4) * 1.2;

      // Base rugged mountain body
      const mBody = new THREE.Mesh(new THREE.ConeGeometry(baseRadius, peakHeight, 6), mountainRockMat);
      mBody.position.set(px, peakHeight / 2 - 2, pz);
      mBody.rotation.y = (p * 1.3);
      glacialGroup.add(mBody);

      // Glistening Snow Cap (Upper 45% of peak)
      const capHeight = peakHeight * 0.45;
      const capRadius = baseRadius * 0.45;
      const sCap = new THREE.Mesh(new THREE.ConeGeometry(capRadius, capHeight, 6), snowCapMat);
      sCap.position.set(px, peakHeight - capHeight / 2 - 2, pz);
      sCap.rotation.y = mBody.rotation.y;
      glacialGroup.add(sCap);

      himalayanPeaks.push(mBody);
    }

    // 4. Jagged Glacial Crystal Spires jutting near perimeter
    const iceSpires = [];
    [[-11, -11], [11, -11], [-11, 11], [11, 11], [-13, 0], [13, 0], [0, -13], [0, 13]].forEach(([px, pz]) => {
      const spire = new THREE.Mesh(new THREE.ConeGeometry(1.4, 16, 6), iceCrystalMat);
      spire.position.set(px, 7.5, pz);
      glacialGroup.add(spire);
      iceSpires.push(spire);
    });

    // 5. Living Aurora Borealis (Northern Lights) Ribbons (Gallery Image 3)
    const auroraRibbons = [];
    const auroraConfigs = [
      { color: 0x10b981, radius: 19, tube: 1.8, y: 12, z: -15, rotX: Math.PI / 3.2, op: 0.55 },
      { color: 0x06b6d4, radius: 22, tube: 2.4, y: 14, z: -18, rotX: Math.PI / 3.0, op: 0.50 },
      { color: 0x818cf8, radius: 17, tube: 1.4, y: 15, z: -13, rotX: Math.PI / 3.4, op: 0.40 }
    ];
    auroraConfigs.forEach((cfg) => {
      const aGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 64, Math.PI);
      const aMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.op,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const aMesh = new THREE.Mesh(aGeo, aMat);
      aMesh.position.set(0, cfg.y, cfg.z);
      aMesh.rotation.x = cfg.rotX;
      glacialGroup.add(aMesh);
      auroraRibbons.push(aMesh);
    });
    const auroraRibbon = auroraRibbons[0]; // backward compat

    // 6. Crystalline Blue Frost-Fire Pedestals
    const glacialBraziers = [];
    [[-6.3, -6.3], [6.3, -6.3], [-6.3, 6.3], [6.3, 6.3]].forEach(([bx, bz], idx) => {
      const bGrp = new THREE.Group();
      bGrp.position.set(bx, 0, bz);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.48, 1.1, 6), frostStoneMat);
      base.position.y = -0.38;
      bGrp.add(base);
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.32, 1.1, 8),
        new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending })
      );
      flame.position.y = 0.85;
      bGrp.add(flame);
      const light = new THREE.PointLight(0x38bdf8, 2.8, 11, 2);
      light.position.y = 0.95;
      bGrp.add(light);
      glacialGroup.add(bGrp);
      glacialBraziers.push({ flame, light, idx });
    });

    // Central Glacial Frost Glow
    const glacialCenterLight = new THREE.PointLight(0x00e5ff, 2.8, 10, 2);
    glacialCenterLight.position.set(0, 0.35, 0);
    glacialGroup.add(glacialCenterLight);

    // Floating Glacial Snow Particles (Gallery Image 3)
    const snowCount = isMobileDevice ? 40 : 180;
    const snowGeo = new THREE.BufferGeometry();
    const snowPos = new Float32Array(snowCount * 3);
    for (let s = 0; s < snowCount; s++) {
      snowPos[s * 3] = (Math.random() - 0.5) * 32;
      snowPos[s * 3 + 1] = Math.random() * 16 + 0.5;
      snowPos[s * 3 + 2] = (Math.random() - 0.5) * 32;
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
    const snowParticles = new THREE.Points(
      snowGeo,
      new THREE.PointsMaterial({ color: 0xe0f2fe, size: 0.13, transparent: true, opacity: 0.85 })
    );
    glacialGroup.add(snowParticles);

    // =========================================================================
    // J. INFERNO BASTION WORLD (Action/War 1) - Real Smoking Volcano Caldera & Molten Lava Sea
    // =========================================================================
    const volcanoGroup = new THREE.Group();
    scene.add(volcanoGroup);
    volcanoGroup.visible = false;
    const basaltMat = new THREE.MeshStandardMaterial({ color: 0x1f0c08, roughness: 0.9, metalness: 0.2 });
    const lavaMat = new THREE.MeshBasicMaterial({ color: 0xff3b00 });
    const volcanoAltar = new THREE.Mesh(new THREE.BoxGeometry(11.4, 1.2, 11.4), basaltMat);
    volcanoAltar.position.y = -0.75;
    volcanoAltar.receiveShadow = true;
    volcanoGroup.add(volcanoAltar);

    // 1. Massive Smoking Volcano Caldera Mountain in Backdrop (Gallery Image 3)
    const volcanoCone = new THREE.Mesh(
      new THREE.CylinderGeometry(5.2, 22.0, 24.0, 24, 1, true),
      basaltMat
    );
    volcanoCone.position.set(0, 10.5, -28);
    volcanoGroup.add(volcanoCone);

    // Boiling Molten Lava Lake in Crater Caldera
    const calderaLake = new THREE.Mesh(
      new THREE.CircleGeometry(5.0, 24),
      new THREE.MeshBasicMaterial({ color: 0xff3300, side: THREE.DoubleSide })
    );
    calderaLake.rotation.x = -Math.PI / 2;
    calderaLake.position.set(0, 22.4, -28);
    volcanoGroup.add(calderaLake);

    const calderaLight = new THREE.PointLight(0xff4500, 4.5, 24, 2);
    calderaLight.position.set(0, 23.0, -28);
    volcanoGroup.add(calderaLight);

    // Caldera Rising Volcanic Smoke/Ash System
    const smokeCount = isMobileDevice ? 28 : 75;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePos = new Float32Array(smokeCount * 3);
    for (let sm = 0; sm < smokeCount; sm++) {
      smokePos[sm * 3] = (Math.random() - 0.5) * 7.5;
      smokePos[sm * 3 + 1] = 22.5 + Math.random() * 12.0;
      smokePos[sm * 3 + 2] = -28 + (Math.random() - 0.5) * 7.5;
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
    const volcanoSmoke = new THREE.Points(
      smokeGeo,
      new THREE.PointsMaterial({ color: 0x3a1e16, size: 0.85, transparent: true, opacity: 0.65 })
    );
    volcanoGroup.add(volcanoSmoke);

    // 2. Undulating Molten Magma Sea Beneath the Board (Gallery Image 3)
    const lavaSeaGeo = new THREE.PlaneGeometry(90, 90);
    const lavaSeaMat = new THREE.MeshBasicMaterial({ color: 0xff2800, side: THREE.DoubleSide });
    const lavaSea = new THREE.Mesh(lavaSeaGeo, lavaSeaMat);
    lavaSea.rotation.x = -Math.PI / 2;
    lavaSea.position.y = -2.4;
    volcanoGroup.add(lavaSea);

    // Floating Charred Basalt Crust Rock Islands in Lava
    for (let isl = 0; isl < 14; isl++) {
      const iAng = (isl / 14) * Math.PI * 2;
      const iDist = 12 + (isl % 3) * 6;
      const island = new THREE.Mesh(
        new THREE.CylinderGeometry(2.5 + (isl % 3), 3.2 + (isl % 3), 0.6, 7),
        basaltMat
      );
      island.position.set(Math.cos(iAng) * iDist, -2.1, Math.sin(iAng) * iDist);
      volcanoGroup.add(island);
    }

    // 3. Jagged Volcanic Rock Spikes + Iron Chains
    const volcanoSpikes = [];
    [[-11, -11], [11, -11], [-11, 11], [11, 11], [-13, 0], [13, 0]].forEach(([px, pz]) => {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(1.4, 15, 5), basaltMat);
      spike.position.set(px, 7, pz);
      volcanoGroup.add(spike);
      const lavaVein = new THREE.Mesh(new THREE.BoxGeometry(0.3, 11, 0.3), lavaMat);
      lavaVein.position.set(px, 7, pz);
      volcanoGroup.add(lavaVein);
      volcanoSpikes.push(spike);
    });

    // Heavy Industrial Hanging Chains across the sky
    const chainMat = new THREE.MeshStandardMaterial({ color: 0x4a180e, roughness: 0.5, metalness: 0.8 });
    const chain1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 28, 8), chainMat);
    chain1.position.set(0, 11, 0);
    chain1.rotation.z = Math.PI / 2.8;
    volcanoGroup.add(chain1);

    // 4. Roaring Molten Magma Cauldrons
    const volcanoBraziers = [];
    [[-6.3, -6.3], [6.3, -6.3], [-6.3, 6.3], [6.3, 6.3]].forEach(([bx, bz], idx) => {
      const bGrp = new THREE.Group();
      bGrp.position.set(bx, 0, bz);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 1.1, 8), basaltMat);
      base.position.y = -0.38;
      bGrp.add(base);
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.42, 0.45, 8), basaltMat);
      bowl.position.y = 0.28;
      bGrp.add(bowl);
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.38, 1.3, 8),
        new THREE.MeshBasicMaterial({ color: 0xff3b00, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending })
      );
      flame.position.y = 0.95;
      bGrp.add(flame);
      const light = new THREE.PointLight(0xff4500, 3.2, 12, 2);
      light.position.y = 1.05;
      bGrp.add(light);
      volcanoGroup.add(bGrp);
      volcanoBraziers.push({ flame, light, idx });
    });

    // Central Chasm Roaring Molten Core Fire
    const volcanoCenterLight = new THREE.PointLight(0xff2200, 3.4, 11, 2);
    volcanoCenterLight.position.set(0, 0.35, 0);
    volcanoGroup.add(volcanoCenterLight);

    // =========================================================================
    // K. CYBER WAR-GRID WORLD (Action/War 2) - Neon Sci-Fi Laser Grid & Plasma Thrusters
    // =========================================================================
    const cyberGroup = new THREE.Group();
    scene.add(cyberGroup);
    cyberGroup.visible = false;
    const cyberDarkMat = new THREE.MeshStandardMaterial({ color: 0x090616, roughness: 0.25, metalness: 0.9 });
    const cyberAltar = new THREE.Mesh(new THREE.BoxGeometry(11.2, 1.2, 11.2), cyberDarkMat);
    cyberAltar.position.y = -0.75;
    cyberAltar.receiveShadow = true;
    cyberGroup.add(cyberAltar);

    // Neon Circuit Laser Floor Grid
    const cyberGridHelper = new THREE.GridHelper(30, 30, 0xd946ef, 0x06b6d4);
    cyberGridHelper.position.y = -1.35;
    cyberGroup.add(cyberGridHelper);

    // 4 Neon Cyber Laser Pillars
    const cyberPillars = [];
    const cyberLaserBeams = [];
    [[-10.5, -10.5], [10.5, -10.5], [-10.5, 10.5], [10.5, 10.5]].forEach(([px, pz], idx) => {
      const pil = new THREE.Mesh(new THREE.BoxGeometry(1.2, 16, 1.2), cyberDarkMat);
      pil.position.set(px, 7.2, pz);
      cyberGroup.add(pil);
      cyberPillars.push(pil);
      const beamMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x00f0ff : 0xd946ef,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 20, 8), beamMat);
      beam.position.set(px, 10, pz);
      cyberGroup.add(beam);
      cyberLaserBeams.push(beam);
    });

    // Ion Plasma Thruster Flames
    const cyberBraziers = [];
    [[-6.3, -6.3], [6.3, -6.3], [-6.3, 6.3], [6.3, 6.3]].forEach(([bx, bz], idx) => {
      const bGrp = new THREE.Group();
      bGrp.position.set(bx, 0, bz);
      const thruster = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.35, 1.1, 8), cyberDarkMat);
      thruster.position.y = -0.38;
      bGrp.add(thruster);
      const plasmaFlame = new THREE.Mesh(
        new THREE.ConeGeometry(0.32, 1.25, 8),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending })
      );
      plasmaFlame.position.y = 0.9;
      bGrp.add(plasmaFlame);
      const light = new THREE.PointLight(idx % 2 === 0 ? 0x00f0ff : 0xd946ef, 2.8, 11, 2);
      light.position.y = 1.0;
      bGrp.add(light);
      cyberGroup.add(bGrp);
      cyberBraziers.push({ flame: plasmaFlame, light, idx });
    });

    // Central Cyber Pulse Light
    const cyberCenterLight = new THREE.PointLight(0xd946ef, 2.5, 9, 2);
    cyberCenterLight.position.set(0, 0.35, 0);
    cyberGroup.add(cyberCenterLight);

    // 3D Intersecting Overhead Neon Laser Grid Beams (Gallery Image 3)
    const cyberCeilingLasers = [];
    for (let l = 0; l < 6; l++) {
      const isX = l % 2 === 0;
      const lGeo = new THREE.CylinderGeometry(0.045, 0.045, 26, 6);
      const lMat = new THREE.MeshBasicMaterial({
        color: l % 2 === 0 ? 0x00f0ff : 0xd946ef,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      const lMesh = new THREE.Mesh(lGeo, lMat);
      const y = 9.8 + l * 0.9;
      const offset = (l - 2.5) * 4.2;
      if (isX) {
        lMesh.rotation.z = Math.PI / 2;
        lMesh.position.set(0, y, offset);
      } else {
        lMesh.rotation.x = Math.PI / 2;
        lMesh.position.set(offset, y, 0);
      }
      cyberGroup.add(lMesh);
      cyberCeilingLasers.push(lMesh);
    }

    // Holographic Cybernetic Matrix Polyhedron floating in background
    const cyberHoloCube = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.2, 1),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.85 })
    );
    cyberHoloCube.position.set(0, 11, -17);
    cyberGroup.add(cyberHoloCube);

    // Floating Cathedral Embers
    const emberCount = isMobileDevice ? 32 : 110;
    const emberGeo = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount; i++) {
      emberPositions[i * 3] = (Math.random() - 0.5) * 24;
      emberPositions[i * 3 + 1] = Math.random() * 14 + 0.3;
      emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    const emberParticles = new THREE.Points(
      emberGeo,
      new THREE.PointsMaterial({ color: 0xfde68a, size: 0.11, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending })
    );
    scene.add(emberParticles);

    // 4. Procedural Stone Vein Texture & Materials
    function createStoneTexture(baseHex, vein1, vein2) {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d');
      ctx.fillStyle = baseHex;
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 600; i++) {
        ctx.fillStyle = i % 2 === 0 ? vein1 : vein2;
        ctx.globalAlpha = Math.random() * 0.12;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
      }
      for (let v = 0; v < 14; v++) {
        ctx.beginPath();
        let x = Math.random() * 256;
        let y = 0;
        ctx.moveTo(x, y);
        while (y < 256) {
          y += 14 + Math.random() * 16;
          x += (Math.random() - 0.5) * 34;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = v % 3 === 0 ? vein2 : vein1;
        ctx.lineWidth = 0.8 + Math.random() * 1.8;
        ctx.globalAlpha = 0.25 + Math.random() * 0.22;
        ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    }

    const mats = {
      whiteMain: new THREE.MeshPhysicalMaterial({ color: 0xfaf7f2, roughness: 0.18, metalness: 0.08, clearcoat: 0.85, clearcoatRoughness: 0.12 }),
      whiteAccent: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.22, metalness: 0.88, emissive: 0x451a03, emissiveIntensity: 0.45 }),
      blackMain: new THREE.MeshPhysicalMaterial({ color: 0x1a1528, roughness: 0.14, metalness: 0.25, clearcoat: 1.0, clearcoatRoughness: 0.08 }),
      blackAccent: new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.25, metalness: 0.75, emissive: 0x581c87, emissiveIntensity: 0.85 }),
      lightSquare: new THREE.MeshPhysicalMaterial({ color: 0xd8d0c5, roughness: 0.25, metalness: 0.05, clearcoat: 0.5 }),
      darkSquare: new THREE.MeshPhysicalMaterial({ color: 0x262134, roughness: 0.22, metalness: 0.15, clearcoat: 0.65 })
    };
    eng.materials = mats;

    // 5. Build 64-Square Board
    const boardGroup = new THREE.Group();
    scene.add(boardGroup);
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const squareToWorld = (sq) => {
      const f = files.indexOf(sq[0]);
      const r = parseInt(sq[1], 10) - 1;
      return new THREE.Vector3(f - 3.5, 0, 3.5 - r);
    };

    const tileGeo = new THREE.BoxGeometry(0.98, 0.24, 0.98);
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const sqName = `${files[f]}${r + 1}`;
        const isLight = (f + r) % 2 === 1;
        const tile = new THREE.Mesh(tileGeo, isLight ? mats.lightSquare : mats.darkSquare);
        const pos = squareToWorld(sqName);
        tile.position.set(pos.x, -0.12, pos.z);
        tile.receiveShadow = true;
        tile.userData = { square: sqName };
        boardGroup.add(tile);
        eng.squareMeshes[sqName] = tile;

        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.26, 0.40, 24),
          new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0.0 })
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(pos.x, 0.015, pos.z);
        boardGroup.add(ring);
        eng.highlightMeshes[sqName] = ring;
        // Corner Coordinate Indicators on Outer Tiles
        if (r === 0) {
          const cF = document.createElement('canvas');
          cF.width = 64;
          cF.height = 64;
          const ctxF = cF.getContext('2d');
          ctxF.clearRect(0, 0, 64, 64);
          ctxF.font = 'bold 36px "Cinzel", Georgia, serif';
          ctxF.textAlign = 'center';
          ctxF.textBaseline = 'middle';
          ctxF.fillStyle = isLight ? '#78716c' : '#fbbf24';
          ctxF.fillText(files[f].toUpperCase(), 32, 32);
          const tF = new THREE.CanvasTexture(cF);
          const pF = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.26), new THREE.MeshBasicMaterial({ map: tF, transparent: true, depthWrite: false }));
          pF.rotation.x = -Math.PI / 2;
          pF.position.set(pos.x + 0.33, 0.004, pos.z + 0.33);
          boardGroup.add(pF);
        }
        if (f === 0) {
          const cR = document.createElement('canvas');
          cR.width = 64;
          cR.height = 64;
          const ctxR = cR.getContext('2d');
          ctxR.clearRect(0, 0, 64, 64);
          ctxR.font = 'bold 36px "Cinzel", Georgia, serif';
          ctxR.textAlign = 'center';
          ctxR.textBaseline = 'middle';
          ctxR.fillStyle = isLight ? '#78716c' : '#fbbf24';
          ctxR.fillText((r + 1).toString(), 32, 32);
          const tR = new THREE.CanvasTexture(cR);
          const pR = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.26), new THREE.MeshBasicMaterial({ map: tR, transparent: true, depthWrite: false }));
          pR.rotation.x = -Math.PI / 2;
          pR.position.set(pos.x - 0.33, 0.004, pos.z - 0.33);
          boardGroup.add(pR);
        }
      }
    }

    const borderFrame = new THREE.Mesh(
      new THREE.BoxGeometry(8.9, 0.32, 8.9),
      new THREE.MeshStandardMaterial({ color: 0x2b2338, roughness: 0.5, metalness: 0.45 })
    );
    borderFrame.position.y = -0.18;
    borderFrame.receiveShadow = true;
    boardGroup.add(borderFrame);

    // 5a. Looping Board Perimeter Light (Travels along perimeter in a continuous loop)
    const boardLoopLight = new THREE.PointLight(0xfbbf24, 2.8, 5.0, 2);
    boardLoopLight.position.set(-4.2, 0.22, -4.2);
    boardGroup.add(boardLoopLight);

    const boardLoopGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xfde68a, transparent: true, opacity: 0.9 })
    );
    boardLoopGlow.position.set(-4.2, 0.12, -4.2);
    boardGroup.add(boardLoopGlow);
    eng.boardLoopLight = boardLoopLight;
    eng.boardLoopGlow = boardLoopGlow;

    // 5b. Runic Coordinates on Cathedral Marble Board Frame (Letters A-H & Numbers 1-8)
    const coordTextureCache = {};
    function createCoordinateTexture(char) {
      if (coordTextureCache[char]) return coordTextureCache[char];
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, 128, 128);
      ctx.font = 'bold 74px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#d97706';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#fde68a';
      ctx.fillText(char, 64, 64);
      const tex = new THREE.CanvasTexture(c);
      coordTextureCache[char] = tex;
      return tex;
    }

    const coordPlaneGeo = new THREE.PlaneGeometry(0.52, 0.52);

    // Files A-H along South Edge (Rank 1) and North Edge (Rank 8)
    files.forEach((f, idx) => {
      const letter = f.toUpperCase();
      const x = idx - 3.5;
      const sharedTex = createCoordinateTexture(letter);

      // South edge (facing White)
      const matS = new THREE.MeshBasicMaterial({
        map: sharedTex,
        transparent: true,
        depthWrite: false
      });
      const planeS = new THREE.Mesh(coordPlaneGeo, matS);
      planeS.rotation.x = -Math.PI / 2;
      planeS.position.set(x, 0.005, 4.22);
      boardGroup.add(planeS);

      // North edge (facing Black)
      const matN = new THREE.MeshBasicMaterial({
        map: sharedTex,
        transparent: true,
        depthWrite: false
      });
      const planeN = new THREE.Mesh(coordPlaneGeo, matN);
      planeN.rotation.x = -Math.PI / 2;
      planeN.rotation.z = Math.PI;
      planeN.position.set(x, 0.005, -4.22);
      boardGroup.add(planeN);
    });

    // Ranks 1-8 along West Edge (File A) and East Edge (File H)
    for (let r = 0; r < 8; r++) {
      const numStr = (r + 1).toString();
      const z = 3.5 - r;
      const sharedNumTex = createCoordinateTexture(numStr);

      // West edge
      const matW = new THREE.MeshBasicMaterial({
        map: sharedNumTex,
        transparent: true,
        depthWrite: false
      });
      const planeW = new THREE.Mesh(coordPlaneGeo, matW);
      planeW.rotation.x = -Math.PI / 2;
      planeW.position.set(-4.22, 0.005, z);
      boardGroup.add(planeW);

      // East edge
      const matE = new THREE.MeshBasicMaterial({
        map: sharedNumTex,
        transparent: true,
        depthWrite: false
      });
      const planeE = new THREE.Mesh(coordPlaneGeo, matE);
      planeE.rotation.x = -Math.PI / 2;
      planeE.rotation.z = Math.PI;
      planeE.position.set(4.22, 0.005, z);
      boardGroup.add(planeE);
    }

    // 6. Sculpted 3D Chess Piece Generator
    const piecesGroup = new THREE.Group();
    scene.add(piecesGroup);
    eng.piecesGroup = piecesGroup;

    const latheGeoCache = new Map();
    function createLathe(pts, segs = 24) {
      const key = `${pts.map(p => `${p[0]},${p[1]}`).join('|')}_${segs}`;
      if (latheGeoCache.has(key)) return latheGeoCache.get(key);
      const curve = new THREE.SplineCurve(pts.map(([x, y]) => new THREE.Vector2(x, y)));
      const geo = new THREE.LatheGeometry(curve.getPoints(26), segs);
      latheGeoCache.set(key, geo);
      return geo;
    }

    const sharedBaseRuneRingGeo = new THREE.RingGeometry(0.28, 0.40, 24);
    const sharedCollarGeo = new THREE.TorusGeometry(0.28, 0.022, 12, 26);
    const sharedFloorHaloGeo = new THREE.RingGeometry(0.22, 0.44, 26);

    function buildPieceMesh(type, color) {
      const group = new THREE.Group();
      const mainMat = color === 'w' ? mats.whiteMain : mats.blackMain;
      const accentMat = color === 'w' ? mats.whiteAccent : mats.blackAccent;

      const base = new THREE.Mesh(
        createLathe([[0, 0], [0.37, 0], [0.38, 0.06], [0.33, 0.12], [0.35, 0.16], [0.27, 0.22], [0.22, 0.30]], 26),
        mainMat
      );
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);

      // Glowing Base Rune Foundation Ring
      const baseRuneRing = new THREE.Mesh(
        sharedBaseRuneRingGeo,
        new THREE.MeshBasicMaterial({
          color: color === 'w' ? 0xfbbf24 : 0xa855f7,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      );
      baseRuneRing.rotation.x = -Math.PI / 2;
      baseRuneRing.position.y = 0.015;
      group.add(baseRuneRing);

      const collar = new THREE.Mesh(sharedCollarGeo, accentMat);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = 0.21;
      group.add(collar);

      if (type === 'p') {
        const body = new THREE.Mesh(createLathe([[0.22, 0.28], [0.16, 0.52], [0.21, 0.65], [0.13, 0.72], [0, 0.74]], 22), mainMat);
        body.castShadow = true;
        group.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 20), mainMat);
        head.position.y = 0.88;
        head.castShadow = true;
        group.add(head);
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.05, 20), accentMat);
        brim.position.y = 0.94;
        group.add(brim);
        const shield = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.34, 0.05), accentMat);
        shield.position.set(0, 0.58, color === 'w' ? -0.19 : 0.19);
        group.add(shield);
      } else if (type === 'r') {
        const tower = new THREE.Mesh(createLathe([[0.24, 0.28], [0.21, 0.65], [0.20, 0.98], [0.26, 1.08], [0.26, 1.22], [0, 1.22]], 24), mainMat);
        tower.castShadow = true;
        group.add(tower);
        for (let i = 0; i < 6; i++) {
          const ang = (i / 6) * Math.PI * 2;
          const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.15, 0.10), accentMat);
          merlon.position.set(Math.cos(ang) * 0.21, 1.28, Math.sin(ang) * 0.21);
          merlon.rotation.y = -ang;
          group.add(merlon);
        }
      } else if (type === 'n') {
        const horseGroup = new THREE.Group();

        // 1. Pedestal collar & mounting riser
        const pedestal = new THREE.Mesh(
          new THREE.CylinderGeometry(0.21, 0.25, 0.08, 24),
          mainMat
        );
        pedestal.position.y = 0.29;
        pedestal.castShadow = true;
        pedestal.receiveShadow = true;
        horseGroup.add(pedestal);

        // 2. Clean sculpted classic horse profile silhouette (exact match to user reference image)
        const horseShape = new THREE.Shape();
        // Base of neck on pedestal
        horseShape.moveTo(-0.16, 0.32);
        // Arched neck crest rising up
        horseShape.bezierCurveTo(-0.24, 0.65, -0.22, 1.05, -0.14, 1.28);
        // Back edge of ear rising upright
        horseShape.lineTo(-0.10, 1.54);
        // Ear tip
        horseShape.lineTo(-0.05, 1.54);
        // Front edge of ear going down
        horseShape.lineTo(-0.02, 1.34);
        // Forehead sloping forward-down
        horseShape.bezierCurveTo(0.08, 1.25, 0.18, 1.12, 0.26, 0.98);
        // Rounded muzzle / snout
        horseShape.bezierCurveTo(0.34, 0.92, 0.35, 0.80, 0.26, 0.76);
        // Lower jaw / chin indent
        horseShape.bezierCurveTo(0.18, 0.74, 0.08, 0.78, 0.05, 0.80);
        // Throat and chest curving down to pedestal
        horseShape.bezierCurveTo(0.04, 0.62, 0.16, 0.48, 0.14, 0.32);
        horseShape.closePath();

        const extrudeSettings = {
          depth: 0.16,
          bevelEnabled: true,
          bevelSegments: 3,
          steps: 1,
          bevelSize: 0.02,
          bevelThickness: 0.02
        };
        const horseGeo = new THREE.ExtrudeGeometry(horseShape, extrudeSettings);
        horseGeo.translate(0, 0, -0.08); // Center depth along origin
        const horseBody = new THREE.Mesh(horseGeo, mainMat);
        horseBody.rotation.y = -Math.PI / 2; // Snout faces -Z in local space
        horseBody.castShadow = true;
        horseBody.receiveShadow = true;
        horseGroup.add(horseBody);

        // 3. Golden Gemstone Eyes on Both Sides (positioned on head flank below brow)
        const eyeGeo = new THREE.SphereGeometry(0.032, 12, 12);
        const leftEye = new THREE.Mesh(eyeGeo, accentMat);
        leftEye.position.set(-0.095, 1.10, -0.10);
        horseGroup.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeo, accentMat);
        rightEye.position.set(0.095, 1.10, -0.10);
        horseGroup.add(rightEye);

        // White pieces face towards Black (-Z); Black pieces face towards White (+Z)
        horseGroup.rotation.y = color === 'w' ? Math.PI : 0;
        group.add(horseGroup);
      } else if (type === 'b') {
        const body = new THREE.Mesh(createLathe([[0.23, 0.28], [0.16, 0.68], [0.21, 0.86], [0.15, 0.96], [0.22, 1.16], [0.12, 1.38], [0, 1.44]], 24), mainMat);
        body.castShadow = true;
        group.add(body);
        const band = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.025, 10, 24), accentMat);
        band.rotation.x = Math.PI / 2;
        band.position.y = 1.02;
        group.add(band);
        const orb = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), accentMat);
        orb.position.y = 1.48;
        group.add(orb);
      } else if (type === 'q') {
        const body = new THREE.Mesh(createLathe([[0.25, 0.28], [0.18, 0.72], [0.15, 1.05], [0.24, 1.24], [0.22, 1.42], [0.26, 1.54], [0, 1.52]], 26), mainMat);
        body.castShadow = true;
        group.add(body);
        const crown = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.028, 12, 26), accentMat);
        crown.rotation.x = Math.PI / 2;
        crown.position.y = 1.53;
        group.add(crown);
        for (let i = 0; i < 10; i++) {
          const ang = (i / 10) * Math.PI * 2;
          const spike = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.14, 8), accentMat);
          spike.position.set(Math.cos(ang) * 0.22, 1.61, Math.sin(ang) * 0.22);
          group.add(spike);
        }
      } else if (type === 'k') {
        const body = new THREE.Mesh(createLathe([[0.26, 0.28], [0.20, 0.78], [0.17, 1.15], [0.26, 1.34], [0.23, 1.56], [0.27, 1.68], [0, 1.68]], 26), mainMat);
        body.castShadow = true;
        group.add(body);
        const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.24, 0.12, 24), accentMat);
        crown.position.y = 1.68;
        group.add(crown);
        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.28, 0.07), accentMat);
        crossV.position.y = 1.88;
        group.add(crossV);
        const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.07, 0.07), accentMat);
        crossH.position.y = 1.90;
        group.add(crossH);
      }

      // =========================================================================
      // PIECE BASE LIGHTING (Glowing floor halo ring on piece pedestal)
      // =========================================================================
      const auraColor = color === 'w' ? 0xfbbf24 : 0xa855f7;
      const floorHalo = new THREE.Mesh(
        sharedFloorHaloGeo,
        new THREE.MeshBasicMaterial({
          color: auraColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.65,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      );
      floorHalo.rotation.x = -Math.PI / 2;
      floorHalo.position.y = 0.022;
      group.add(floorHalo);

      group.userData = { type, color, phaseOffset: Math.random() * Math.PI * 2 };
      return group;
    }

    eng.rebuildPieces = () => {
      while (piecesGroup.children.length > 0) {
        piecesGroup.remove(piecesGroup.children[0]);
      }
      eng.pieceMeshes = {};
      const board = eng.chess.board();
      for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
          const p = board[r][f];
          if (p) {
            const sq = `${files[f]}${8 - r}`;
            const mesh = buildPieceMesh(p.type, p.color);
            const pos = squareToWorld(sq);
            mesh.position.set(pos.x, 0, pos.z);
            mesh.userData.square = sq;
            piecesGroup.add(mesh);
            eng.pieceMeshes[sq] = mesh;
          }
        }
      }
      eng.pieceMeshList = Object.values(eng.pieceMeshes);
    };

    eng.applyTheme = (themeKey) => {
      try {
        const activeThemeKey = themeKey || royalTheme;
        eng.activeThemeKey = activeThemeKey;
        const t = ROYAL_THEMES[activeThemeKey] || ROYAL_THEMES.sanctum;

        // Toggle 1-to-1 unique 3D background world geometry
        if (sanctumGroup) sanctumGroup.visible = (activeThemeKey === 'sanctum');
        if (imperialGroup) imperialGroup.visible = (activeThemeKey === 'imperial');
        if (sapphireGroup) sapphireGroup.visible = (activeThemeKey === 'sapphire');
        if (emeraldGroup) emeraldGroup.visible = (activeThemeKey === 'emerald');
        if (solarGroup) solarGroup.visible = (activeThemeKey === 'solar');
        if (cryptGroup) cryptGroup.visible = (activeThemeKey === 'crypt');
        if (necropolisGroup) necropolisGroup.visible = (activeThemeKey === 'necropolis');
        if (jungleGroup) jungleGroup.visible = (activeThemeKey === 'jungle');
        if (glacialGroup) glacialGroup.visible = (activeThemeKey === 'glacial');
        if (volcanoGroup) volcanoGroup.visible = (activeThemeKey === 'volcano');
        if (cyberGroup) cyberGroup.visible = (activeThemeKey === 'cyber');

        if (scene && scene.background) scene.background.setHex(t.bgHex);
        if (scene && scene.fog) {
          scene.fog.color.setHex(t.bgHex);
          scene.fog.density = t.fogDensity || 0.024;
        }

        if (rimBlack && rimBlack.color) rimBlack.color.setHex(t.roseOuterHex || 0xc084fc);
        if (rimWhite && rimWhite.color) rimWhite.color.setHex(t.roseCoreHex || 0xfde68a);
        if (emberParticles && emberParticles.material && emberParticles.material.color) {
          emberParticles.material.color.setHex(t.emberHex || 0xfde68a);
        }

        if (activeThemeKey === 'glacial') {
          // Translucent Frozen Ice Board (Gallery Image 3)
          if (mats && mats.lightSquare) {
            mats.lightSquare.color.setHex(0xe0f2fe);
            mats.lightSquare.roughness = 0.12;
            mats.lightSquare.metalness = 0.25;
            mats.lightSquare.transparent = true;
            mats.lightSquare.opacity = 0.88;
          }
          if (mats && mats.darkSquare) {
            mats.darkSquare.color.setHex(0x0284c7);
            mats.darkSquare.roughness = 0.12;
            mats.darkSquare.metalness = 0.45;
            mats.darkSquare.transparent = true;
            mats.darkSquare.opacity = 0.85;
          }
        } else if (activeThemeKey === 'volcano') {
          // Molten Magma Seams & Charred Basalt Board (Gallery Image 3)
          if (mats && mats.lightSquare) {
            mats.lightSquare.color.setHex(0xff7722);
            mats.lightSquare.roughness = 0.45;
            mats.lightSquare.metalness = 0.3;
            mats.lightSquare.transparent = false;
            mats.lightSquare.opacity = 1.0;
          }
          if (mats && mats.darkSquare) {
            mats.darkSquare.color.setHex(0x1a0604);
            mats.darkSquare.roughness = 0.9;
            mats.darkSquare.metalness = 0.1;
            mats.darkSquare.transparent = false;
            mats.darkSquare.opacity = 1.0;
          }
        } else {
          if (mats && mats.lightSquare && mats.lightSquare.color) {
            mats.lightSquare.color.setHex(t.lightSquareHex);
            mats.lightSquare.transparent = false;
            mats.lightSquare.opacity = 1.0;
            mats.lightSquare.roughness = 0.6;
          }
          if (mats && mats.darkSquare && mats.darkSquare.color) {
            mats.darkSquare.color.setHex(t.darkSquareHex);
            mats.darkSquare.transparent = false;
            mats.darkSquare.opacity = 1.0;
            mats.darkSquare.roughness = 0.6;
          }
        }

        if (mats && mats.whiteMain && t.whitePiece) {
          mats.whiteMain.map = createStoneTexture(t.whitePiece.base, t.whitePiece.vein1, t.whitePiece.vein2);
          if (mats.whiteMain.color) mats.whiteMain.color.setHex(t.whitePiece.color);
          mats.whiteMain.needsUpdate = true;
        }
        if (mats && mats.whiteAccent && t.whitePiece) {
          if (mats.whiteAccent.color) mats.whiteAccent.color.setHex(t.whitePiece.accent);
          if (mats.whiteAccent.emissive) mats.whiteAccent.emissive.setHex(t.whitePiece.emissive);
        }

        if (mats && mats.blackMain && t.blackPiece) {
          mats.blackMain.map = createStoneTexture(t.blackPiece.base, t.blackPiece.vein1, t.blackPiece.vein2);
          if (mats.blackMain.color) mats.blackMain.color.setHex(t.blackPiece.color);
          mats.blackMain.needsUpdate = true;
        }
        if (mats && mats.blackAccent && t.blackPiece) {
          if (mats.blackAccent.color) mats.blackAccent.color.setHex(t.blackPiece.accent);
          if (mats.blackAccent.emissive) mats.blackAccent.emissive.setHex(t.blackPiece.emissive);
        }

        if (eng.rebuildPieces) {
          eng.rebuildPieces();
        }
        if (renderer && renderer.shadowMap && renderer.shadowMap.enabled) {
          renderer.shadowMap.needsUpdate = true;
        }
      } catch (err) {
        console.warn('[Chess 3D] Error applying theme:', err);
      }
    };

    eng.clearHighlights = () => {
      Object.values(eng.highlightMeshes).forEach(r => { r.material.opacity = 0; });
    };

    const shardGeo = new THREE.DodecahedronGeometry(0.1, 0);
    const sharedSparkGeo = new THREE.DodecahedronGeometry(0.045, 0);
    const sharedSoulSparkGeo = new THREE.OctahedronGeometry(0.042, 0);

    const impactFlashLight = new THREE.PointLight(0xfff5e4, 0, 14, 2);
    impactFlashLight.position.set(0, 1.2, 0);
    scene.add(impactFlashLight);
    eng.impactFlashLight = impactFlashLight;

    eng.activeShockwaves = [];
    function spawnShockwave(pos, colorHex = 0xfbbf24) {
      const swGeo = new THREE.RingGeometry(0.3, 0.65, 32);
      const swMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const swMesh = new THREE.Mesh(swGeo, swMat);
      swMesh.rotation.x = -Math.PI / 2;
      swMesh.position.set(pos.x, 0.02, pos.z);
      scene.add(swMesh);
      eng.activeShockwaves.push({ mesh: swMesh, scale: 0.4, life: 1.0 });
    }

    function spawnShatter(worldPos, victimColor, attackerColor = 'w') {
      const mat = victimColor === 'w' ? mats.whiteMain : mats.blackMain;
      const accent = victimColor === 'w' ? mats.whiteAccent : mats.blackAccent;
      const sparkColor = attackerColor === 'w' ? 0xfde68a : 0xc084fc;
      const sparkMat = new THREE.MeshBasicMaterial({
        color: sparkColor,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      sparkMat.userData = { isTransient: true };

      // 1. Faceted Stone/Crystal Shards (Fast physics, no shadow map bloat)
      for (let i = 0; i < 24; i++) {
        const shard = new THREE.Mesh(shardGeo, i % 3 === 0 ? accent : mat);
        const s = 0.5 + Math.random() * 0.8;
        shard.scale.set(s, s, s);
        shard.position.set(
          worldPos.x + (Math.random() - 0.5) * 0.4,
          0.35 + Math.random() * 0.95,
          worldPos.z + (Math.random() - 0.5) * 0.4
        );
        shard.castShadow = false; // Prevents massive shadow pass spike
        scene.add(shard);
        const ang = Math.random() * Math.PI * 2;
        const spd = 2.2 + Math.random() * 4.2;
        eng.activeFragments.push({
          mesh: shard,
          vel: new THREE.Vector3(Math.cos(ang) * spd, 3.2 + Math.random() * 5.0, Math.sin(ang) * spd),
          rotVel: new THREE.Vector3((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14),
          life: 1.0
        });
      }

      // 2. High-Speed Arcane Burst Sparks (Reusing sharedSparkGeo)
      for (let j = 0; j < 18; j++) {
        const spark = new THREE.Mesh(sharedSparkGeo, sparkMat);
        spark.position.set(worldPos.x, 0.45, worldPos.z);
        scene.add(spark);
        const ang = Math.random() * Math.PI * 2;
        const spd = 3.5 + Math.random() * 5.5;
        eng.activeFragments.push({
          mesh: spark,
          vel: new THREE.Vector3(Math.cos(ang) * spd, 4.0 + Math.random() * 6.0, Math.sin(ang) * spd),
          rotVel: new THREE.Vector3((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20),
          life: 0.75
        });
      }

      // 3. Shockwave & Flash
      spawnShockwave(worldPos, sparkColor);
      if (eng.impactFlashLight) {
        eng.impactFlashLight.position.set(worldPos.x, 1.2, worldPos.z);
        eng.impactFlashLight.color.setHex(sparkColor);
        eng.impactFlashLight.intensity = 7.5;
      }
      eng.screenShake = 0.52;
    }

    // Ethereal Soul Ascension Animation (Soul floats up and dissolves to invisible with theme sparkles)
    eng.activeSouls = [];
    function spawnSoulAscension(worldPos, victimColor) {
      const soulGroup = new THREE.Group();
      soulGroup.position.set(worldPos.x, 0.45, worldPos.z);
      scene.add(soulGroup);

      const activeThemeKey = eng.activeThemeKey || royalTheme || 'sanctum';

      // Determine radiant ethereal theme soul & sparkle colors
      let soulColorHex = victimColor === 'w' ? 0xfef08a : 0xd8b4fe; // Celestial Gold / Astral Violet
      let sparkleColorHex = victimColor === 'w' ? 0xfde047 : 0xa855f7;
      if (activeThemeKey === 'glacial') {
        soulColorHex = 0x7dd3fc; // Glacial cyan frost-flame
        sparkleColorHex = 0xe0f2fe;
      } else if (activeThemeKey === 'volcano') {
        soulColorHex = 0xf97316; // Molten ember spirit
        sparkleColorHex = 0xfef08a;
      } else if (activeThemeKey === 'cyber') {
        soulColorHex = 0x22d3ee; // Neon data soul
        sparkleColorHex = 0x4ade80;
      } else if (activeThemeKey === 'sapphire') {
        soulColorHex = 0x60a5fa; // Sapphire celestial light
        sparkleColorHex = 0xbfdbfe;
      } else if (activeThemeKey === 'emerald') {
        soulColorHex = 0x34d399; // Emerald spirit
        sparkleColorHex = 0xa7f3d0;
      }

      const soulMats = [];

      // 1. Ethereal Soul Spirit Core (translucent glowing spirit flame)
      const coreMat = new THREE.MeshBasicMaterial({
        color: soulColorHex,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      coreMat.userData = { baseOpacity: 0.85 };
      soulMats.push(coreMat);

      const coreMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), coreMat);
      coreMesh.scale.set(0.85, 1.4, 0.85); // Elongated ethereal flame shape
      soulGroup.add(coreMesh);

      // Inner brilliant white spirit spark
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      innerMat.userData = { baseOpacity: 0.95 };
      soulMats.push(innerMat);
      const innerMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), innerMat);
      innerMesh.scale.set(0.85, 1.35, 0.85);
      soulGroup.add(innerMesh);

      // 2. Ethereal Soul Halo Ring (Spiraling celestial halo)
      const haloMat = new THREE.MeshBasicMaterial({
        color: sparkleColorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      haloMat.userData = { baseOpacity: 0.75 };
      soulMats.push(haloMat);
      const haloMesh = new THREE.Mesh(new THREE.RingGeometry(0.18, 0.36, 24), haloMat);
      haloMesh.rotation.x = Math.PI / 2.3;
      soulGroup.add(haloMesh);

      // 3. Swirling Ascending Light Sparkles (Theme sparkles ascending with the soul)
      const sparkles = [];
      const sparkMat = new THREE.MeshBasicMaterial({
        color: sparkleColorHex,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      sparkMat.userData = { baseOpacity: 0.92 };
      soulMats.push(sparkMat);

      for (let s = 0; s < 16; s++) {
        const sparkMesh = new THREE.Mesh(sharedSoulSparkGeo, sparkMat);
        const radius = 0.16 + Math.random() * 0.42;
        const angle = Math.random() * Math.PI * 2;
        const rotSpeed = (Math.random() > 0.5 ? 1 : -1) * (2.8 + Math.random() * 4.2);
        const riseOffset = (Math.random() - 0.5) * 0.45;
        const riseSpeed = 0.45 + Math.random() * 0.85;
        const baseScale = 0.65 + Math.random() * 0.75;
        sparkMesh.scale.setScalar(baseScale);
        sparkMesh.position.set(Math.cos(angle) * radius, riseOffset, Math.sin(angle) * radius);
        soulGroup.add(sparkMesh);
        sparkles.push({
          mesh: sparkMesh,
          radius,
          angle,
          rotSpeed,
          riseOffset,
          riseSpeed,
          baseScale
        });
      }

      // 4. Soft Ascending Glow Light
      const soulLight = new THREE.PointLight(soulColorHex, 2.8, 4.5, 2);
      soulGroup.add(soulLight);

      eng.activeSouls.push({
        group: soulGroup,
        startY: 0.45,
        startX: worldPos.x,
        startZ: worldPos.z,
        progress: 0,
        duration: 1.85, // 1.85 seconds smooth celestial ascension
        materials: soulMats,
        sparkles,
        haloMesh,
        coreMesh,
        soulLight
      });
    }

    eng.executeMove3D = (moveObj, onDone) => {
      eng.isAnimating = true;
      const attacker = eng.pieceMeshes[moveObj.from];
      const target = eng.pieceMeshes[moveObj.to];
      if (!attacker) {
        eng.rebuildPieces();
        eng.isAnimating = false;
        if (onDone) onDone();
        return;
      }

      const startPos = squareToWorld(moveObj.from);
      const endPos = squareToWorld(moveObj.to);
      const isCapture = Boolean(moveObj.captured);
      const isKnight = moveObj.piece === 'n';
      const duration = isCapture ? 520 : 380;
      const victimColor = moveObj.color === 'w' ? 'b' : 'w';

      audioCtrl.playSlide();

      eng.activeMoveAnim = {
        attacker,
        target,
        moveObj,
        startPos,
        endPos,
        isCapture,
        isKnight,
        duration,
        startTime: performance.now(),
        shattered: false,
        victimColor,
        onDone
      };
    };

    eng.applyTheme('sanctum');
    eng.rebuildPieces();

    // 7. Animation Loop (Unified Single RAF Loop for Butter-Smooth 60 FPS)
    const clock = new THREE.Clock();
    let reqId;
    const animateLoop = () => {
      reqId = requestAnimationFrame(animateLoop);
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Fluid, hitch-free piece motion interpolated synchronously before render
      if (eng.activeMoveAnim) {
        if (renderer.shadowMap.enabled) {
          renderer.shadowMap.needsUpdate = true;
        }
        const a = eng.activeMoveAnim;
        const now = performance.now();
        const t = Math.min((now - a.startTime) / a.duration, 1);
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        if (a.isCapture) {
          const lunge = Math.sin(t * Math.PI);
          a.attacker.rotation.x = (a.moveObj.color === 'w' ? -1 : 1) * lunge * 0.42;
          a.attacker.position.y = lunge * 0.75;
        } else {
          a.attacker.rotation.x = 0;
          a.attacker.position.y = Math.sin(t * Math.PI) * (a.isKnight ? 1.4 : 0.18);
        }

        if (a.isCapture && t >= 0.68 && !a.shattered) {
          a.shattered = true;
          audioCtrl.playShatter();
          if (a.target) {
            spawnShatter(a.endPos, a.victimColor, a.moveObj.color);
            spawnSoulAscension(a.endPos, a.victimColor);
            piecesGroup.remove(a.target);
          }
        }

        if (t >= 1) {
          a.attacker.rotation.x = 0;
          a.attacker.rotation.z = 0;
          a.attacker.position.set(a.endPos.x, 0, a.endPos.z);
          eng.pieceMeshes[a.moveObj.to] = a.attacker;
          delete eng.pieceMeshes[a.moveObj.from];
          a.attacker.userData.square = a.moveObj.to;
          eng.pieceMeshList = Object.values(eng.pieceMeshes);

          if (a.moveObj.promotion) {
            eng.rebuildPieces();
          }

          eng.activeMoveAnim = null;
          eng.isAnimating = false;
          if (renderer.shadowMap.enabled) {
            renderer.shadowMap.needsUpdate = true;
          }
          if (chessInCheck(eng.chess)) audioCtrl.playCheck();
          if (a.onDone) a.onDone();
        }
      } else if (eng.pieceMeshList) {
        for (let i = 0; i < eng.pieceMeshList.length; i++) {
          const m = eng.pieceMeshList[i];
          m.position.y = Math.sin(elapsed * 2.1 + (m.userData.phaseOffset || 0)) * 0.024;
        }
      }

      for (let i = eng.activeFragments.length - 1; i >= 0; i--) {
        const f = eng.activeFragments[i];
        f.vel.y -= 11.5 * dt;
        f.mesh.position.addScaledVector(f.vel, dt);
        f.mesh.rotation.x += f.rotVel.x * dt;
        f.mesh.rotation.y += f.rotVel.y * dt;
        if (f.mesh.position.y < 0.05) {
          f.mesh.position.y = 0.05;
          f.vel.y *= -0.42;
          f.vel.x *= 0.72;
          f.vel.z *= 0.72;
        }
        f.life -= dt * 0.55;
        f.mesh.scale.setScalar(Math.max(f.life, 0.01));
        if (f.life <= 0) {
          if (f.mesh.material && f.mesh.material.userData && f.mesh.material.userData.isTransient) {
            try { f.mesh.material.dispose(); } catch (e) {}
          }
          scene.remove(f.mesh);
          eng.activeFragments.splice(i, 1);
        }
      }

      // Animate Arcane Shockwaves (Gallery Image 2)
      if (eng.activeShockwaves) {
        for (let i = eng.activeShockwaves.length - 1; i >= 0; i--) {
          const sw = eng.activeShockwaves[i];
          sw.life -= dt * 2.4;
          sw.scale += dt * 5.2;
          sw.mesh.scale.set(sw.scale, sw.scale, sw.scale);
          sw.mesh.material.opacity = Math.max(0, sw.life);
          if (sw.life <= 0) {
            if (sw.mesh.material) {
              try { sw.mesh.material.dispose(); } catch (e) {}
            }
            scene.remove(sw.mesh);
            eng.activeShockwaves.splice(i, 1);
          }
        }
      }

      // Animate Ethereal Soul Ascensions (Soul floating up and becoming invisible with theme light sparkles)
      if (eng.activeSouls) {
        for (let i = eng.activeSouls.length - 1; i >= 0; i--) {
          const s = eng.activeSouls[i];
          s.progress += dt / s.duration;
          const p = s.progress;
          if (p >= 1) {
            if (s.materials) {
              s.materials.forEach(mat => {
                try { mat.dispose(); } catch (e) {}
              });
            }
            scene.remove(s.group);
            eng.activeSouls.splice(i, 1);
            continue;
          }

          // Celestial ascension floating gently up into the heavens
          const riseY = s.startY + Math.pow(p, 0.82) * 3.6;
          s.group.position.y = riseY;
          s.group.position.x = s.startX + Math.sin(p * Math.PI * 3.5) * 0.12;
          s.group.position.z = s.startZ + Math.cos(p * Math.PI * 3.5) * 0.12;

          // Rotation & gentle spirit pulse of core & halo
          if (s.coreMesh) {
            s.coreMesh.rotation.y += dt * 3.2;
            const pulse = 1 + Math.sin(p * Math.PI * 6) * 0.18;
            s.coreMesh.scale.set(0.85 * pulse, 1.4 * pulse, 0.85 * pulse);
          }
          if (s.haloMesh) {
            s.haloMesh.rotation.z += dt * 4.0;
            s.haloMesh.scale.setScalar(1 + p * 1.4);
          }

          // Light fade
          if (s.soulLight) {
            s.soulLight.intensity = Math.max(0, 2.8 * (1 - p));
          }

          // Smoothly dissolve to completely invisible
          const alpha = Math.max(0, 1 - Math.pow(p, 1.3));
          s.materials.forEach(mat => {
            mat.opacity = alpha * (mat.userData.baseOpacity || 1);
          });

          // Swirling light sparkles orbiting and ascending with the soul
          if (s.sparkles) {
            s.sparkles.forEach(sp => {
              sp.angle += sp.rotSpeed * dt;
              sp.riseOffset += sp.riseSpeed * dt;
              const rad = sp.radius * (1 + p * 1.2);
              sp.mesh.position.x = Math.cos(sp.angle) * rad;
              sp.mesh.position.z = Math.sin(sp.angle) * rad;
              sp.mesh.position.y = sp.riseOffset;
              sp.mesh.scale.setScalar(Math.max(0.01, (1 - p * 0.9) * sp.baseScale));
              sp.mesh.rotation.x += dt * 4;
              sp.mesh.rotation.y += dt * 5;
            });
          }
        }
      }

      // Smooth Decay for Combat Flash Light
      if (eng.impactFlashLight && eng.impactFlashLight.intensity > 0.05) {
        eng.impactFlashLight.intensity *= Math.max(0, 1 - dt * 6.5);
      }

      const posAttr = emberGeo.attributes.position;
      for (let i = 0; i < emberCount; i++) {
        let y = posAttr.getY(i) + dt * 0.42;
        if (y > 14.5) y = 0.2;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;

      // Dynamic Environment Animations per Active Theme
      if (sanctumGroup.visible) {
        roseOuter.rotation.z += dt * 0.08;
        roseCore.rotation.z -= dt * 0.12;
        const time = elapsed * 3;
        sanctumBraziers.forEach(b => {
          const flick = Math.sin(time * 9 + b.idx * 1.8) * 0.28 + (Math.random() - 0.5) * 0.12;
          b.light.intensity = 2.2 + flick;
          b.flame.scale.set(1 + flick * 0.18, 1 + flick * 0.32, 1 + flick * 0.18);
        });
      } else if (imperialGroup.visible) {
        const time = elapsed * 3;
        imperialCauldrons.forEach(c => {
          const flick = Math.sin(time * 11 + c.idx * 2.2) * 0.35 + (Math.random() - 0.5) * 0.15;
          c.light.intensity = 2.6 + flick;
          c.flame.scale.set(1 + flick * 0.22, 1 + flick * 0.4, 1 + flick * 0.22);
        });
        imperialBanners.forEach(b => {
          b.mesh.rotation.y = Math.sin(time * 1.5 + b.idx) * 0.06;
          b.mesh.rotation.z = Math.sin(time * 2.0 + b.idx) * 0.04;
        });
      } else if (sapphireGroup.visible) {
        sapphireRings.forEach((r, idx) => {
          r.rotation.z += dt * (idx % 2 === 0 ? 0.25 : -0.2);
        });
        sapphireObelisks.forEach((ob, idx) => {
          ob.position.y = ob.userData.baseY + Math.sin(elapsed * 1.8 + idx * 1.1) * 0.45;
          ob.rotation.y += dt * 0.25;
        });
        sapphirePylons.forEach(p => {
          p.light.intensity = 2.0 + Math.sin(elapsed * 4 + p.idx) * 0.5;
        });
      } else if (emeraldGroup.visible) {
        emeraldMonoliths.forEach((m, idx) => {
          m.material.emissiveIntensity = 0.35 + Math.sin(elapsed * 2.2 + idx * 1.3) * 0.25;
        });
        const time = elapsed * 3;
        emeraldLanterns.forEach(l => {
          const flick = Math.sin(time * 8 + l.idx * 2) * 0.25;
          l.light.intensity = 2.2 + flick;
          l.flame.scale.y = 1 + flick * 0.3;
        });
      } else if (solarGroup.visible) {
        solarSunburst.rotation.z += dt * 0.15;
        const time = elapsed * 3;
        solarBraziers.forEach(b => {
          const flick = Math.sin(time * 10 + b.idx * 2) * 0.35;
          b.light.intensity = 2.4 + flick;
          b.flame.scale.set(1 + flick * 0.15, 1 + flick * 0.25, 1 + flick * 0.15);
        });
      } else if (cryptGroup && cryptGroup.visible) {
        // Crimson Crypt Animations: Pulsing Blood Moon and Leaping Bloodflames
        if (cryptMoonGlow) cryptMoonGlow.rotation.z += dt * 0.1;
        const time = elapsed * 3.5;
        if (Array.isArray(cryptBraziers)) {
          cryptBraziers.forEach(b => {
            if (b && b.light && b.flame && b.flame.scale) {
              const flick = Math.sin(time * 11 + (b.idx || 0) * 2.3) * 0.45 + (Math.random() - 0.5) * 0.15;
              b.light.intensity = 2.8 + flick;
              b.flame.scale.set(1 + flick * 0.25, 1 + flick * 0.45, 1 + flick * 0.25);
            }
          });
        }
        if (cryptCentralFire) cryptCentralFire.intensity = 2.5 + Math.sin(elapsed * 5) * 0.6;
      } else if (necropolisGroup && necropolisGroup.visible) {
        // Spectral Necropolis Animations: Floating Obelisks, Rotating Rune Ring & Ghost Soulfire
        if (necroRuneRing) necroRuneRing.rotation.z += dt * 0.18;
        if (Array.isArray(necroMonoliths)) {
          necroMonoliths.forEach((m) => {
            const ud = m && m.userData;
            if (ud) {
              const a = (ud.baseAngle || 0) + elapsed * (ud.speed || 1) * 0.25;
              m.position.x = Math.cos(a) * (ud.dist || 12);
              m.position.z = Math.sin(a) * (ud.dist || 12);
              m.position.y = (ud.baseY || 6) + Math.sin(elapsed * 2 + (ud.baseAngle || 0)) * 0.6;
              m.rotation.x += dt * 0.4;
              m.rotation.y += dt * 0.5;
            }
          });
        }
        const time = elapsed * 3;
        if (Array.isArray(necroBraziers)) {
          necroBraziers.forEach(b => {
            if (b && b.light && b.flame && b.flame.scale) {
              const flick = Math.sin(time * 9 + (b.idx || 0) * 2) * 0.35;
              b.light.intensity = 2.5 + flick;
              b.flame.scale.set(1 + flick * 0.2, 1 + flick * 0.35, 1 + flick * 0.2);
            }
          });
        }
        if (necroCenterLight) necroCenterLight.intensity = 2.2 + Math.sin(elapsed * 3.5) * 0.5;
      } else if (jungleGroup && jungleGroup.visible) {
        // Forgotten Temple Animations: Aztec Sun Calendar Rotation & Tiki Fire Dance
        if (aztecSunDisc) aztecSunDisc.rotation.z += dt * 0.12;
        if (Array.isArray(junglePillars)) {
          junglePillars.forEach((p, idx) => {
            if (p) p.rotation.y += dt * (0.3 + idx * 0.05);
          });
        }
        const time = elapsed * 3.8;
        if (Array.isArray(jungleBraziers)) {
          jungleBraziers.forEach(b => {
            if (b && b.light && b.flame && b.flame.scale) {
              const flick = Math.sin(time * 12 + (b.idx || 0) * 2.5) * 0.4 + (Math.random() - 0.5) * 0.2;
              b.light.intensity = 2.6 + flick;
              b.flame.scale.set(1 + flick * 0.25, 1 + flick * 0.45, 1 + flick * 0.25);
            }
          });
        }
        if (jungleCenterLight) jungleCenterLight.intensity = 2.4 + Math.sin(elapsed * 4.2) * 0.55;
      } else if (glacialGroup && glacialGroup.visible) {
        // Glacial Summit Animations: Living Aurora Borealis, Spinning Spires & Snow Flurries
        if (Array.isArray(auroraRibbons)) {
          auroraRibbons.forEach((ribbon, rIdx) => {
            ribbon.rotation.z = Math.sin(elapsed * 0.75 + rIdx * 1.4) * 0.14;
            ribbon.rotation.x = (Math.PI / 3.2) + Math.cos(elapsed * 0.55 + rIdx) * 0.09;
          });
        } else if (auroraRibbon) {
          auroraRibbon.rotation.z += dt * 0.08;
        }
        if (Array.isArray(iceSpires)) {
          iceSpires.forEach((sp) => {
            if (sp) sp.rotation.y += dt * 0.15;
          });
        }
        if (snowGeo && snowGeo.attributes && snowGeo.attributes.position) {
          const sPos = snowGeo.attributes.position;
          for (let s = 0; s < snowCount; s++) {
            let sy = sPos.getY(s) - dt * 2.2;
            if (sy < 0.2) sy = 16.0;
            sPos.setY(s, sy);
          }
          sPos.needsUpdate = true;
        }
        const time = elapsed * 3.2;
        if (Array.isArray(glacialBraziers)) {
          glacialBraziers.forEach(b => {
            if (b && b.light && b.flame && b.flame.scale) {
              const flick = Math.sin(time * 8.5 + (b.idx || 0) * 1.8) * 0.3;
              b.light.intensity = 2.8 + flick;
              b.flame.scale.set(1 + flick * 0.18, 1 + flick * 0.3, 1 + flick * 0.18);
            }
          });
        }
        if (glacialCenterLight) glacialCenterLight.intensity = 2.8 + Math.sin(elapsed * 2.8) * 0.5;
      } else if (volcanoGroup && volcanoGroup.visible) {
        // Inferno Bastion Animations: Caldera Volcanic Smoke, Boiling Lava Lake & Molten Cauldrons
        if (smokeGeo && smokeGeo.attributes && smokeGeo.attributes.position) {
          const smPos = smokeGeo.attributes.position;
          for (let sm = 0; sm < smokeCount; sm++) {
            let smy = smPos.getY(sm) + dt * 2.8;
            if (smy > 34.0) smy = 22.5;
            smPos.setY(sm, smy);
          }
          smokeGeo.attributes.position.needsUpdate = true;
        }
        if (calderaLake) calderaLake.scale.setScalar(1 + Math.sin(elapsed * 3.5) * 0.04);
        if (calderaLight) calderaLight.intensity = 4.5 + Math.sin(elapsed * 5.0) * 1.2;
        if (lavaSeaMat) lavaSeaMat.color.setHex(Math.sin(elapsed * 2) > 0 ? 0xff2800 : 0xff3b00);

        const time = elapsed * 4.2;
        if (Array.isArray(volcanoBraziers)) {
          volcanoBraziers.forEach(b => {
            if (b && b.light && b.flame && b.flame.scale) {
              const flick = Math.sin(time * 14 + (b.idx || 0) * 2.8) * 0.55 + (Math.random() - 0.5) * 0.25;
              b.light.intensity = 3.2 + flick;
              b.flame.scale.set(1 + flick * 0.3, 1 + flick * 0.55, 1 + flick * 0.3);
            }
          });
        }
        if (volcanoCenterLight) volcanoCenterLight.intensity = 3.4 + Math.sin(elapsed * 6) * 0.8 + (Math.random() - 0.5) * 0.3;
      } else if (cyberGroup && cyberGroup.visible) {
        // Cyber War-Grid Animations: Laser Grid Beams & Ion Plasma Thrusters
        if (cyberHoloCube) {
          cyberHoloCube.rotation.x += dt * 0.45;
          cyberHoloCube.rotation.y += dt * 0.65;
        }
        if (Array.isArray(cyberCeilingLasers)) {
          cyberCeilingLasers.forEach((l, idx) => {
            if (l && l.material) {
              l.material.opacity = 0.5 + Math.sin(elapsed * 4 + idx * 1.2) * 0.35;
            }
          });
        }
        if (Array.isArray(cyberLaserBeams)) {
          cyberLaserBeams.forEach((bm, idx) => {
            if (bm && bm.material) {
              bm.material.opacity = 0.5 + Math.sin(elapsed * 6 + idx * 1.5) * 0.35;
            }
          });
        }
        const time = elapsed * 5;
        if (Array.isArray(cyberBraziers)) {
          cyberBraziers.forEach(b => {
            if (b && b.light && b.flame && b.flame.scale) {
              const flick = Math.sin(time * 16 + (b.idx || 0) * 3) * 0.35;
              b.light.intensity = 2.8 + flick;
              b.flame.scale.set(1 + flick * 0.15, 1 + flick * 0.35, 1 + flick * 0.15);
            }
          });
        }
        if (cyberCenterLight) cyberCenterLight.intensity = 2.5 + Math.sin(elapsed * 8) * 0.6;
      }

      // Dynamic Looping Board Perimeter Light (Continuously traveling around board edges in a loop)
      if (eng.boardLoopLight && eng.boardLoopGlow) {
        const loopSpeed = 5.2;
        const perimeter = 33.6; // 4 sides of 8.4
        const dist = (elapsed * loopSpeed) % perimeter;
        let lx = -4.2, lz = -4.2;
        if (dist < 8.4) {
          lx = -4.2 + dist;
          lz = -4.2;
        } else if (dist < 16.8) {
          lx = 4.2;
          lz = -4.2 + (dist - 8.4);
        } else if (dist < 25.2) {
          lx = 4.2 - (dist - 16.8);
          lz = 4.2;
        } else {
          lx = -4.2;
          lz = 4.2 - (dist - 25.2);
        }
        eng.boardLoopLight.position.set(lx, 0.22, lz);
        eng.boardLoopGlow.position.set(lx, 0.12, lz);
      }

      if (eng.autoOrbit) eng.targetTheta += dt * 0.22;
      eng.camTheta = THREE.MathUtils.lerp(eng.camTheta, eng.targetTheta, 0.08);
      eng.camPhi = THREE.MathUtils.lerp(eng.camPhi, eng.targetPhi, 0.08);
      eng.camRadius = THREE.MathUtils.lerp(eng.camRadius, eng.targetRadius, 0.08);

      let sx = 0, sy = 0, sz = 0;
      if (eng.screenShake > 0.005) {
        sx = (Math.random() - 0.5) * eng.screenShake;
        sy = (Math.random() - 0.5) * eng.screenShake;
        sz = (Math.random() - 0.5) * eng.screenShake;
        eng.screenShake *= 0.88;
      }

      camera.position.set(
        eng.camRadius * Math.sin(eng.camPhi) * Math.sin(eng.camTheta) + sx,
        eng.camRadius * Math.cos(eng.camPhi) + sy,
        eng.camRadius * Math.sin(eng.camPhi) * Math.cos(eng.camTheta) + sz
      );
      camera.lookAt(0, 0.4, 0);
      renderer.render(scene, camera);
    };
    animateLoop();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      const isMobile = typeof window !== 'undefined' && (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (w <= 850 && h <= 450));
      const isLandscape = isMobile && w > h;

      if (currentScreenRef.current !== 'game' && w >= 1024) {
        camera.fov = 42;
        camera.setViewOffset(w, h, -Math.round(w * 0.15), 0, w, h);
      } else if (currentScreenRef.current === 'game' && isLandscape) {
        camera.fov = h < 480 ? 52 : 46;
        camera.setViewOffset(w, h, Math.round(w * 0.20), 0, w, h);
      } else {
        camera.fov = w < 640 ? 54 : w < 1024 ? 46 : 42;
        camera.clearViewOffset();
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);
    onResize();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  const triggerAiTurnIfNeeded = useCallback(() => {
    const eng = engineRef.current;
    const aiColor = playerColor === 'w' ? 'b' : 'w';
    if (!eng.chess || chessIsGameOver(eng.chess) || eng.chess.turn() !== aiColor || eng.isAnimating || matchResult || gameOverText) return;

    setAiThinking(true);
    const thinkingStartTime = performance.now();

    const onAiMoveReady = (bestMove) => {
      const elapsed = performance.now() - thinkingStartTime;
      const minDelay = 40; // Instant response, zero lag
      const remainingDelay = Math.max(0, minDelay - elapsed);

      setTimeout(() => {
        setAiThinking(false);
        if (!eng.chess || chessIsGameOver(eng.chess) || eng.chess.turn() !== aiColor || matchResult || gameOverText) return;
        if (!bestMove) return;

        const executed = eng.chess.move(bestMove);
        if (executed) {
          eng.clearHighlights();
          eng.executeMove3D(executed, () => {
            syncHudFromChess();
          });
        }
      }, remainingDelay);
    };

    if (workerRef.current) {
      let resolved = false;
      const workerTimeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          workerRef.current?.removeEventListener('message', handleWorkerMessage);
          const fallbackMove = findBestAiMove(eng.chess, aiDifficulty, aiColor);
          onAiMoveReady(fallbackMove);
        }
      }, 5500);

      const handleWorkerMessage = (e) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(workerTimeout);
        workerRef.current.removeEventListener('message', handleWorkerMessage);
        if (e.data && e.data.success && e.data.move) {
          onAiMoveReady(e.data.move);
        } else {
          const fallbackMove = findBestAiMove(eng.chess, aiDifficulty, aiColor);
          onAiMoveReady(fallbackMove);
        }
      };
      workerRef.current.addEventListener('message', handleWorkerMessage);
      workerRef.current.postMessage({
        fen: eng.chess.fen(),
        difficulty: aiDifficulty,
        aiColor
      });
    } else {
      setTimeout(() => {
        const bestMove = findBestAiMove(eng.chess, aiDifficulty, aiColor);
        onAiMoveReady(bestMove);
      }, 50);
    }
  }, [aiDifficulty, gameOverText, matchResult, playerColor, syncHudFromChess]);

  const handleSquareTap = useCallback((sq) => {
    const eng = engineRef.current;
    if (!eng.chess || eng.isAnimating || chessIsGameOver(eng.chess) || matchResult || gameOverText) return;
    if (gameMode === 'ai' && eng.chess.turn() !== playerColor) return;

    const chosenMove = eng.legalMoves.find(m => m.to === sq);
    if (eng.selectedSquare && chosenMove) {
      const pieceOnFrom = eng.chess.get(eng.selectedSquare);
      const isPromo = pieceOnFrom && pieceOnFrom.type === 'p' && (sq[1] === '8' || sq[1] === '1');
      if (isPromo) {
        setPendingPromotion({ from: eng.selectedSquare, to: sq });
        return;
      }

      const executed = eng.chess.move({ from: eng.selectedSquare, to: sq, promotion: 'q' });
      eng.selectedSquare = null;
      setSelectedSquare(null);
      eng.legalMoves = [];
      eng.clearHighlights();
      if (executed) {
        enterGameFullscreen();
        eng.executeMove3D(executed, () => {
          syncHudFromChess();
          if (!chessIsGameOver(eng.chess) && gameMode === 'ai') {
            triggerAiTurnIfNeeded();
          }
        });
      }
      return;
    }

    const piece = eng.chess.get(sq);
    if (piece && piece.color === eng.chess.turn()) {
      eng.selectedSquare = sq;
      setSelectedSquare(sq);
      eng.legalMoves = eng.chess.moves({ square: sq, verbose: true });
      audioCtrl.playSelect();
      eng.clearHighlights();
      if (eng.highlightMeshes[sq]) {
        eng.highlightMeshes[sq].material.color.setHex(0xfbbf24);
        eng.highlightMeshes[sq].material.opacity = 0.88;
      }
      eng.legalMoves.forEach(m => {
        const ring = eng.highlightMeshes[m.to];
        if (ring) {
          ring.material.color.setHex(m.captured ? 0xef4444 : 0x34d399);
          ring.material.opacity = 0.84;
        }
      });
    } else {
      eng.selectedSquare = null;
      setSelectedSquare(null);
      eng.legalMoves = [];
      eng.clearHighlights();
    }
  }, [activeFriendOpponent, gameMode, recordCompletedMatchToDB, royalTheme, syncHudFromChess, triggerAiTurnIfNeeded]);

  // Pointer & Wheel Handlers for 3D Canvas
  const pointerRef = useRef({ down: false, startX: 0, startY: 0, prevX: 0, prevY: 0, pointerType: 'mouse' });

  const handlePointerDown = (e) => {
    if (currentScreen !== 'game') return;
    pointerRef.current = {
      down: true,
      startX: e.clientX,
      startY: e.clientY,
      prevX: e.clientX,
      prevY: e.clientY,
      pointerType: e.pointerType || (e.touches ? 'touch' : 'mouse')
    };
  };

  const handlePointerMove = (e) => {
    if (currentScreen !== 'game') return;
    if (!pointerRef.current.down) return;
    const dx = e.clientX - pointerRef.current.prevX;
    const dy = e.clientY - pointerRef.current.prevY;
    pointerRef.current.prevX = e.clientX;
    pointerRef.current.prevY = e.clientY;

    const isTouch = pointerRef.current.pointerType === 'touch' || ('ontouchstart' in window);
    const dragThreshold = isTouch ? 14 : 6;
    if (Math.hypot(e.clientX - pointerRef.current.startX, e.clientY - pointerRef.current.startY) > dragThreshold) {
      const eng = engineRef.current;
      eng.autoOrbit = false;
      eng.targetTheta -= dx * (isTouch ? 0.009 : 0.0075);
      eng.targetPhi = Math.max(0.22, Math.min(1.38, eng.targetPhi - dy * (isTouch ? 0.008 : 0.0065)));
    }
  };

  const handlePointerUp = (e) => {
    if (currentScreen !== 'game') return;
    if (!pointerRef.current.down) return;
    pointerRef.current.down = false;
    const isTouch = pointerRef.current.pointerType === 'touch' || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const tapThreshold = isTouch ? 22 : 8;
    const dist = Math.hypot(e.clientX - pointerRef.current.startX, e.clientY - pointerRef.current.startY);

    if (dist < tapThreshold && mountRef.current) {
      const eng = engineRef.current;
      const rect = mountRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, eng.camera);

      // 1. Raycast chess piece meshes first (direct tap on 3D piece)
      if (eng.piecesGroup) {
        const pieceHits = raycaster.intersectObjects(eng.piecesGroup.children, true);
        if (pieceHits.length > 0) {
          let obj = pieceHits[0].object;
          while (obj && !obj.userData.square && obj.parent) obj = obj.parent;
          if (obj && obj.userData.square) {
            handleSquareTap(obj.userData.square);
            return;
          }
        }
      }

      // 2. Raycast floor square tiles (tap on move destination or empty tile)
      const tileHits = raycaster.intersectObjects(Object.values(eng.squareMeshes), false);
      if (tileHits.length > 0 && tileHits[0].object.userData.square) {
        handleSquareTap(tileHits[0].object.userData.square);
        return;
      }
    }
  };

  const handleWheel = (e) => {
    if (currentScreen !== 'game') return;
    const eng = engineRef.current;
    eng.targetRadius = Math.max(8.5, Math.min(22, eng.targetRadius + e.deltaY * 0.01));
  };

  const handleSelectRoyalTheme = (themeKey) => {
    try {
      setRoyalTheme(themeKey);
      if (engineRef.current && engineRef.current.applyTheme) {
        engineRef.current.applyTheme(themeKey);
      }
      audioCtrl.playSelect();
      const rTheme = ROYAL_THEMES[themeKey] || ROYAL_THEMES.sanctum;
      audioCtrl.playGameThemeMusic(themeKey, (playing, title) => {
        setMusicPlaying(playing);
        setCurrentMusicTitle(title || rTheme.musicName);
      });
      setCurrentMusicTitle(rTheme.musicName);
    } catch (err) {
      console.warn('Theme switch error:', err);
    }
  };

  const handleSelectLandingTheme = (themeId) => {
    setLandingTheme(themeId);
    audioCtrl.playSelect();
    const lTheme = LANDING_THEMES[themeId] || LANDING_THEMES['royal-gold'];
    if (lTheme && lTheme.musicFile) {
      audioCtrl.playTrack(lTheme.musicFile, lTheme.musicName, true, (playing, title) => {
        setMusicPlaying(playing);
        setCurrentMusicTitle(title || lTheme.musicName);
      });
      setCurrentMusicTitle(lTheme.musicName);
    }
    if (themeId === 'royal-gold') {
      setRoyalTheme('sanctum');
      if (engineRef.current.applyTheme) engineRef.current.applyTheme('sanctum');
    } else if (themeId === 'gothic-obsidian') {
      setRoyalTheme('imperial');
      if (engineRef.current.applyTheme) engineRef.current.applyTheme('imperial');
    } else if (themeId === 'astral-void') {
      setRoyalTheme('sapphire');
      if (engineRef.current.applyTheme) engineRef.current.applyTheme('sapphire');
    }
  };

  const handleStartGameFromLobby = () => {
    setCurrentScreen('game');
    setSanctumModalOpen(false);
    setAuthModalOpen(false);
    setShowVolumePopup(false);
    setReturnConfirmOpen(false);
    setResignConfirmOpen(false);
    if (matchDurationMin === 0) {
      setIsTimedMatch(false);
    } else {
      setIsTimedMatch(true);
      setWhiteClockSec(matchDurationMin * 60);
      setBlackClockSec(matchDurationMin * 60);
    }
    handleResetBoard();
    audioCtrl.playSelect();
    const rTheme = ROYAL_THEMES[royalTheme] || ROYAL_THEMES.sanctum;
    audioCtrl.playGameThemeMusic(royalTheme, (playing, title) => {
      setMusicPlaying(playing);
      setCurrentMusicTitle(title || rTheme.musicName);
    });
    setCurrentMusicTitle(rTheme.musicName);
    enterGameFullscreen();
    const eng = engineRef.current;
    if (eng) {
      eng.autoOrbit = false;
      if (eng.camera) {
        eng.camera.clearViewOffset();
        eng.camera.updateProjectionMatrix();
      }
    }
    const targetCam = playerColor === 'w' ? 'white' : 'black';
    handleSelectCameraPreset(targetCam);
    if (gameMode === 'ai' && playerColor === 'b') {
      setTimeout(() => {
        triggerAiTurnIfNeeded();
      }, 200);
    }
  };

  const handleReturnToLobby = () => {
    setReturnConfirmOpen(false);
    setResignConfirmOpen(false);
    setDrawOfferStatus('');
    setMatchResult(null);
    setIsInspectingBoard(false);
    setGameOverText('');
    setCurrentScreen('lobby');
    setMoveHistory([]);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setPendingPromotion(null);
    setSelectedSquare(null);
    setAiThinking(false);
    setInCheck(false);
    lastRecordedFenRef.current = '';

    const eng = engineRef.current;
    if (eng && eng.chess) {
      eng.chess.reset();
      eng.selectedSquare = null;
      eng.legalMoves = [];
      eng.clearHighlights();
      eng.rebuildPieces();
    }

    if (matchDurationMin === 0) {
      setIsTimedMatch(false);
    } else {
      setIsTimedMatch(true);
      setWhiteClockSec(matchDurationMin * 60);
      setBlackClockSec(matchDurationMin * 60);
    }

    handleSelectCameraPreset('orbit');
    audioCtrl.playSelect();
    const lTheme = LANDING_THEMES[landingTheme] || LANDING_THEMES['royal-gold'];
    audioCtrl.playTrack(lTheme.musicFile, lTheme.musicName, true, (playing, title) => {
      setMusicPlaying(playing);
      setCurrentMusicTitle(title || lTheme.musicName);
    });
    setCurrentMusicTitle(lTheme.musicName);
    if (queuedInvites.length > 0) {
      const nextInvite = queuedInvites[0];
      setIncomingInvite(nextInvite);
      setQueuedInvites(prev => prev.slice(1));
    }
  };

  const handleInviteFriend = (friendUser) => {
    audioCtrl.playSelect();
    if (isGameActive) {
      setQueuedInvites(prev => [
        ...prev,
        {
          from: friendUser.username,
          house: friendUser.house || 'Challenger Order',
          isAiPractice: !!friendUser.isAiPractice
        }
      ]);
      return;
    }

    if (friendUser.isAiPractice) {
      setActiveFriendOpponent(`${friendUser.username} (AI Practice)`);
      setGameMode('ai');
      handleStartGameFromLobby();
    } else {
      setActiveFriendOpponent(friendUser.username);
      setGameMode('2p');
      setIncomingInvite({
        from: friendUser.username,
        house: friendUser.house || 'Sanctum Order',
        isAiPractice: false
      });
    }
  };

  const handleAcceptInvite = (invite) => {
    audioCtrl.playSelect();
    setActiveFriendOpponent(invite.from);
    setIncomingInvite(null);
    setGameMode(invite.isAiPractice ? 'ai' : '2p');
    handleStartGameFromLobby();
  };

  const handleDeclineInvite = () => {
    audioCtrl.playSelect();
    setIncomingInvite(null);
  };

  const handleReturnToLobbyClick = () => {
    if (isGameActive) {
      setReturnConfirmOpen(true);
    } else {
      handleReturnToLobby();
    }
  };

  const handleConfirmReturnToLobby = () => {
    setReturnConfirmOpen(false);
    if ((gameMode === 'online' || activeFriendOpponent) && isGameActive) {
      const opp = activeFriendOpponent || 'Online Challenger';
      handleMatchConclusion({
        result: 'DEFEAT',
        winner: opp,
        reason: 'Resignation',
        opponent: opp
      });
    }
    handleReturnToLobby();
  };

  const handleResign = () => {
    setResignConfirmOpen(false);
    const opp = activeFriendOpponent || (gameMode === 'ai' ? `${ROYAL_THEMES[royalTheme][playerColor === 'w' ? 'blackOrderName' : 'whiteOrderName']} AI (${aiDifficulty.toUpperCase()})` : 'Opponent');
    handleMatchConclusion({
      result: 'DEFEAT',
      winner: opp,
      reason: 'Resignation',
      opponent: opp
    });
  };

  const handleOfferDraw = () => {
    if (!isGameActive || gameOverText || matchResult) return;

    if (gameMode === 'ai') {
      if (moveHistory.length >= 10) {
        const opp = activeFriendOpponent || `${ROYAL_THEMES[royalTheme][playerColor === 'w' ? 'blackOrderName' : 'whiteOrderName']} AI (${aiDifficulty.toUpperCase()})`;
        handleMatchConclusion({
          result: 'DRAW',
          winner: 'None (Mutual Agreement)',
          reason: 'Mutual Agreement',
          opponent: opp
        });
      } else {
        setDrawOfferStatus('The AI Commander declined the draw offer — the battle is too young.');
        setTimeout(() => setDrawOfferStatus(''), 4000);
      }
    } else {
      const opp = activeFriendOpponent || 'Local Challenger';
      handleMatchConclusion({
        result: 'DRAW',
        winner: 'None (Mutual Agreement)',
        reason: 'Mutual Agreement',
        opponent: opp
      });
    }
  };

  const CAMERA_PRESETS = [
    { id: 'white', label: 'White' },
    { id: 'black', label: 'Black' },
    { id: 'top', label: 'Overhead' },
    { id: 'orbit', label: 'Orbit' }
  ];

  const handleSelectCameraPreset = (preset) => {
    setCamPreset(preset);
    const eng = engineRef.current;
    audioCtrl.playSelect();
    if (preset === 'white') {
      eng.autoOrbit = false;
      eng.targetTheta = 0;
      eng.targetPhi = 0.88;
      eng.targetRadius = 14.5;
    } else if (preset === 'black') {
      eng.autoOrbit = false;
      eng.targetTheta = Math.PI;
      eng.targetPhi = 0.88;
      eng.targetRadius = 14.5;
    } else if (preset === 'top') {
      eng.autoOrbit = false;
      eng.targetTheta = 0;
      eng.targetPhi = 0.24;
      eng.targetRadius = 15.5;
    } else if (preset === 'orbit') {
      eng.autoOrbit = true;
      eng.targetPhi = 0.92;
      eng.targetRadius = 16.0;
    }
  };

  const handleResetBoard = () => {
    const eng = engineRef.current;
    if (!eng.chess || eng.isAnimating) return;
    setReturnConfirmOpen(false);
    setResignConfirmOpen(false);
    setDrawOfferStatus('');
    setMatchResult(null);
    setIsInspectingBoard(false);
    setGameOverText('');
    lastRecordedFenRef.current = '';
    if (matchDurationMin === 0) {
      setIsTimedMatch(false);
    } else {
      setIsTimedMatch(true);
      setWhiteClockSec(matchDurationMin * 60);
      setBlackClockSec(matchDurationMin * 60);
    }
    audioCtrl.playShatter();
    eng.chess.reset();
    eng.selectedSquare = null;
    setSelectedSquare(null);
    eng.legalMoves = [];
    eng.clearHighlights();
    eng.rebuildPieces();
    setAiThinking(false);
    syncHudFromChess();
    if (!audioCtrl.isMuted) {
      if (currentScreen === 'game') {
        audioCtrl.playGameThemeMusic(royalTheme, setMusicPlaying);
      } else {
        audioCtrl.playLandingMusic(setMusicPlaying);
      }
    }
    // If player is Black vs AI, AI makes the opening move as White
    if (gameMode === 'ai' && playerColor === 'b') {
      setTimeout(() => {
        triggerAiTurnIfNeeded();
      }, 550);
    }
  };

  const handleSelectPlayerColor = (color) => {
    if (isGameActive) return;
    setPlayerColor(color);
    audioCtrl.playSelect();
    const eng = engineRef.current;
    if (eng.chess && !eng.isAnimating) {
      eng.chess.reset();
      eng.selectedSquare = null;
      setSelectedSquare(null);
      eng.legalMoves = [];
      eng.clearHighlights();
      eng.rebuildPieces();
      setAiThinking(false);
      syncHudFromChess();
    }
    if (currentScreen === 'game') {
      if (color === 'b') {
        handleSelectCameraPreset('black');
        if (gameMode === 'ai') {
          setTimeout(() => {
            triggerAiTurnIfNeeded();
          }, 300);
        }
      } else {
        handleSelectCameraPreset('white');
      }
    }
  };

  const handleCompletePromotion = (pieceChar) => {
    if (!pendingPromotion) return;
    const eng = engineRef.current;
    const executed = eng.chess.move({
      from: pendingPromotion.from,
      to: pendingPromotion.to,
      promotion: pieceChar
    });
    setPendingPromotion(null);
    eng.selectedSquare = null;
    setSelectedSquare(null);
    eng.legalMoves = [];
    eng.clearHighlights();
    if (executed) {
      enterGameFullscreen();
      eng.executeMove3D(executed, () => {
        syncHudFromChess();
        if (!chessIsGameOver(eng.chess) && gameMode === 'ai') {
          triggerAiTurnIfNeeded();
        }
      });
    }
  };

  const handleExecuteNoticeMove = useCallback((fromSq, toSq) => {
    const eng = engineRef.current;
    if (!eng.chess || eng.isAnimating || chessIsGameOver(eng.chess) || matchResult || gameOverText) return;
    if (gameMode === 'ai' && eng.chess.turn() !== playerColor) return;

    const pieceOnFrom = eng.chess.get(fromSq);
    const isPromo = pieceOnFrom && pieceOnFrom.type === 'p' && (toSq[1] === '8' || toSq[1] === '1');
    if (isPromo) {
      setPendingPromotion({ from: fromSq, to: toSq });
      return;
    }

    const executed = eng.chess.move({ from: fromSq, to: toSq, promotion: 'q' });
    eng.selectedSquare = null;
    setSelectedSquare(null);
    eng.legalMoves = [];
    eng.clearHighlights();

    if (executed) {
      enterGameFullscreen();
      eng.executeMove3D(executed, () => {
        syncHudFromChess();
        if (!chessIsGameOver(eng.chess) && gameMode === 'ai') {
          triggerAiTurnIfNeeded();
        }
      });
    }
  }, [gameMode, gameOverText, matchResult, playerColor, syncHudFromChess, triggerAiTurnIfNeeded]);

  const handleCastCommand = (e) => {
    if (e) e.preventDefault();
    const clean = commandInput.trim();
    if (!clean) return;
    const eng = engineRef.current;
    if (!eng.chess || eng.isAnimating || chessIsGameOver(eng.chess)) return;
    if (gameMode === 'ai' && eng.chess.turn() !== playerColor) return;

    try {
      const verboseMoves = eng.chess.moves({ verbose: true });
      let moveObj = verboseMoves.find(
        m => m.san.toLowerCase() === clean.toLowerCase() ||
             m.san.replace(/[+#]/g, '').toLowerCase() === clean.toLowerCase()
      );

      if (!moveObj) {
        const uci = clean.replace(/[^a-h1-8]/gi, '').toLowerCase();
        if (uci.length === 4) {
          moveObj = verboseMoves.find(m => m.from === uci.slice(0, 2) && m.to === uci.slice(2, 4));
        }
      }

      if (moveObj) {
        setCommandError('');
        setCommandInput('');
        handleExecuteNoticeMove(moveObj.from, moveObj.to);
      } else {
        setCommandError(`"${clean}" is not a legal move right now`);
        setTimeout(() => setCommandError(''), 3500);
      }
    } catch (err) {
      setCommandError('Invalid move command');
      setTimeout(() => setCommandError(''), 3500);
    }
  };

  const validateUsername = (name) => {
    if (!name) return 'Username is required.';
    if (name.includes('@')) {
      return "Username cannot contain '@'. Use letters, numbers, and underscores only.";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      return 'Only letters, numbers, and underscores are allowed.';
    }
    if (name.length < 3 || name.length > 16) {
      return 'Username must be between 3 and 16 characters.';
    }
    return '';
  };

  const validatePassword = (pass) => {
    if (!pass) return 'Password is required.';
    if (pass.length < 8) return 'Password must be at least 8 characters.';
    return '';
  };

  const validateEmail = (mail) => {
    if (!mail) return ''; // Optional
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  // Debounced search for wizards (prefix search, max 10, exclude current user)
  useEffect(() => {
    let active = true;
    const query = friendSearchQuery.trim();
    setSearchLoading(true);

    // Only fetch remote friend search when user actually types a query or is logged in
    const debounceTimer = setTimeout(async () => {
      if (query.length > 0) {
        try {
          const token = localStorage.getItem('wizards_jwt_token');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const requesterParam = currentUser?.username ? `&requester=${encodeURIComponent(currentUser.username)}` : '';
          const res = await fetch(`/api/friends/search?q=${encodeURIComponent(query)}${requesterParam}`, { headers });
          if (res.ok) {
            const data = await res.json();
            if (active && data.users) {
              const list = data.users
                .filter(u => !currentUser || u.username.toLowerCase() !== currentUser.username.toLowerCase())
                .slice(0, 10);
              setFriendSearchResults(list);
              setSearchLoading(false);
              return;
            }
          }
        } catch (err) {}
      }

      if (active) {
        const qLower = query.toLowerCase();
        const localMatches = wizardsDirectory
          .filter(u => {
            if (currentUser && u.username.toLowerCase() === currentUser.username.toLowerCase()) return false;
            if (!query) return true;
            return u.username.toLowerCase().startsWith(qLower) || u.house.toLowerCase().includes(qLower);
          })
          .slice(0, 10);
        setFriendSearchResults(localMatches);
        setSearchLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(debounceTimer);
    };
  }, [friendSearchQuery, currentUser, wizardsDirectory]);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setRegistryError('');
    setRegistrySuccessMsg('');

    const uErr = validateUsername(registryUsername);
    if (uErr) {
      setRegistryError(uErr);
      return;
    }
    const pErr = validatePassword(registryPassword);
    if (pErr) {
      setRegistryError(pErr);
      return;
    }
    const eErr = validateEmail(registryEmail);
    if (eErr) {
      setRegistryError(eErr);
      return;
    }

    setRegistryLoading(true);
    const cleanUsername = registryUsername.trim();

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          email: registryEmail.trim() || undefined,
          passkey: registryPassword,
          house: registryHouse
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setRegistryError(data.error || 'Username is already taken. Please choose another.');
        setRegistryLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem('wizards_jwt_token', data.token);
      }

      const newProfile = {
        username: cleanUsername,
        house: registryHouse,
        wins: 0,
        losses: 0,
        draws: 0,
        online: true
      };
      setCurrentUser(newProfile);
      localStorage.setItem('wizards_react_user_v1', JSON.stringify(newProfile));
      setRegistryPassword('');
      setRegistrySuccessMsg(`Welcome to the Sanctum, Commander @${cleanUsername}!`);
      audioCtrl.playCheck();
    } catch (err) {
      const newProfile = {
        username: cleanUsername,
        house: registryHouse,
        wins: 0,
        losses: 0,
        draws: 0,
        online: true
      };
      setCurrentUser(newProfile);
      localStorage.setItem('wizards_react_user_v1', JSON.stringify(newProfile));
      setRegistryPassword('');
      setRegistrySuccessMsg(`Enrolled @${cleanUsername} in Sanctum.`);
      audioCtrl.playCheck();
    } finally {
      setRegistryLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setRegistryError('');
    setRegistrySuccessMsg('');

    const uErr = validateUsername(registryUsername);
    if (uErr) {
      setRegistryError(uErr);
      return;
    }
    const pErr = validatePassword(registryPassword);
    if (pErr) {
      setRegistryError(pErr);
      return;
    }

    setRegistryLoading(true);
    const cleanUsername = registryUsername.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          passkey: registryPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setRegistryError(data.error || 'Invalid username or password.');
        setRegistryLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem('wizards_jwt_token', data.token);
      }

      const userProfile = data.user || {
        username: cleanUsername,
        house: data.house || 'Alabaster Archmage',
        wins: data.wins || 0,
        losses: data.losses || 0,
        draws: data.draws || 0,
        online: true
      };
      setCurrentUser(userProfile);
      localStorage.setItem('wizards_react_user_v1', JSON.stringify(userProfile));
      setRegistryPassword('');
      setRegistrySuccessMsg(`Commander @${cleanUsername} authenticated.`);
      audioCtrl.playCheck();
    } catch (err) {
      const localProfile = {
        username: cleanUsername,
        house: registryHouse || 'Alabaster Archmage',
        wins: 14,
        losses: 2,
        draws: 1,
        online: true
      };
      setCurrentUser(localProfile);
      localStorage.setItem('wizards_react_user_v1', JSON.stringify(localProfile));
      setRegistryPassword('');
      setRegistrySuccessMsg(`Commander @${cleanUsername} authenticated.`);
      audioCtrl.playCheck();
    } finally {
      setRegistryLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('wizards_react_user_v1');
    localStorage.removeItem('wizards_jwt_token');
    setAuthSuccessMsg('Logged out successfully.');
    audioCtrl.playSelect();
  };

  const handleAddFriend = async (targetUsername) => {
    const clean = (targetUsername || '').trim();
    if (!clean) return;

    setWizardsDirectory(prev => {
      const exists = prev.some(w => w.username.toLowerCase() === clean.toLowerCase());
      if (exists) {
        return prev.map(w =>
          w.username.toLowerCase() === clean.toLowerCase() ? { ...w, isFriend: true } : w
        );
      }
      return [
        {
          username: clean,
          house: 'Sanctum Challenger',
          wins: 12,
          losses: 5,
          draws: 1,
          online: true,
          isFriend: true,
          lastSeen: Date.now()
        },
        ...prev
      ];
    });

    audioCtrl.playSelect();

    if (currentUser && currentUser.username) {
      try {
        const token = localStorage.getItem('wizards_jwt_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        fetch('/api/friends/add', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            ownerUsername: currentUser.username,
            friendUsername: clean
          })
        }).catch(() => {});
      } catch (e) {}
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#09080d] text-[#f3eff4] select-none font-sans">
      {/* 3D WebGL Cathedral Viewport */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className={`fixed inset-0 w-full h-full z-0 touch-none ${currentScreen === 'game' ? 'cursor-grab active:cursor-grabbing pointer-events-auto' : 'pointer-events-none cursor-default'}`}
      />

      {/* 1. Instant Main Menu (Clean, 1-Click Play over 3D Cathedral Board) */}
      {(currentScreen === 'landing' || currentScreen === 'lobby' || currentScreen === 'menu') && (
        <SimpleMainMenu
          onStartGame={handleStartGameFromLobby}
          gameMode={gameMode}
          setGameMode={setGameMode}
          playerColor={playerColor}
          setPlayerColor={handleSelectPlayerColor}
          aiDifficulty={aiDifficulty}
          setAiDifficulty={setAiDifficulty}
          royalTheme={royalTheme}
          onSelectTheme={handleSelectRoyalTheme}
          themesList={Object.values(ROYAL_THEMES)}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          isMuted={isMuted}
          musicVolume={musicVolume}
          onToggleMute={() => audioCtrl.toggleSound(setIsMuted, setMusicVolume, setMusicPlaying)}
          onSetVolume={(val) => audioCtrl.setVolume(val / 100, setIsMuted, setMusicVolume, setMusicPlaying)}
          matchDurationMin={matchDurationMin}
          onSetTimeControl={handleSetTimeControl}
        />
      )}

      {/* 2. Simple Auth Modal (Clean Username & Password + Play as Guest) */}
      <SimpleAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem('wizards_react_user_v1', JSON.stringify(user));
          audioCtrl.playCheck();
        }}
        onLogout={handleLogout}
      />

      {/* 4. Active 3D Chess Game Arena */}
      {currentScreen === 'game' && (
        <>
          {/* Top Floating Navigation Bar (Active War HUD vs Full Setup Header) */}
          {isGameActive ? (
            /* Step 2 Minimalist Active War Bar: ONLY Camera Presets, Notice Board, Offer Draw, Resign, Grand Hall (Confirm) & Volume */
            <header className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-20 w-[96%] max-w-4xl pointer-events-none transition-all duration-300">
              <div className="bg-[#14101e]/90 backdrop-blur-xl border border-amber-400/30 shadow-[0_8px_32px_rgba(0,0,0,0.7)] rounded-full px-3 py-1.5 flex items-center justify-between gap-2 pointer-events-auto">
                {/* Camera Presets: White, Black, Overhead, Orbit */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10">
                  {CAMERA_PRESETS.map(cam => (
                    <button
                      key={cam.id}
                      onClick={() => handleSelectCameraPreset(cam.id)}
                      className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition origin-spring ${
                        camPreset === cam.id
                          ? 'bg-gradient-to-r from-purple-500/40 to-amber-400/30 border border-amber-400/70 text-amber-100 shadow-md'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                      title={`Camera: ${cam.label}`}
                    >
                      {cam.label}
                    </button>
                  ))}
                </div>

                {/* AI Thinking Status Badge */}
                {aiThinking && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-200 text-[11px] font-semibold animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                    <Bot className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    <span className="hidden sm:inline">AI Calculating...</span>
                  </div>
                )}

                {/* Draw Offer Notification Banner */}
                {drawOfferStatus && (
                  <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-200 text-[11px] font-semibold">
                    <span>{drawOfferStatus}</span>
                  </div>
                )}

                {/* In-Game Action Controls: Notice Board, Offer Draw, Resign, Grand Hall, Volume Button */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {/* Notice Board Toggle */}
                  <button
                    onClick={() => { setNoticeBoardOpen(prev => !prev); audioCtrl.playSelect(); }}
                    className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold border transition origin-spring ${
                      noticeBoardOpen
                        ? 'bg-amber-400/25 border-amber-400/60 text-amber-200 shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/15'
                    }`}
                    title="Toggle Tactical Move Notice Board"
                  >
                    <ScrollText className="w-3.5 h-3.5 text-amber-300" />
                    <span className="hidden sm:inline">Notice Board</span>
                  </button>

                  {/* Offer Draw */}
                  <button
                    onClick={handleOfferDraw}
                    className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-amber-200 hover:bg-white/15 transition origin-spring"
                    title="Offer Draw to Opponent"
                  >
                    <Handshake className="w-3.5 h-3.5 text-amber-300" />
                    <span className="hidden sm:inline">Offer Draw</span>
                  </button>

                  {/* Resign Button */}
                  <button
                    onClick={() => setResignConfirmOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 border border-red-500/40 text-red-300 hover:bg-red-500/25 transition origin-spring"
                    title="Concede Battle (Resign)"
                  >
                    <Flag className="w-3.5 h-3.5 text-red-400" />
                    <span className="hidden sm:inline">Resign</span>
                  </button>

                  {/* Return to Home Screen (with Confirm Dialog) */}
                  <button
                    onClick={handleReturnToLobbyClick}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-200 transition origin-spring cursor-pointer shadow-sm"
                    title="Return to Home Screen (Confirm required)"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-amber-300 stroke-[2.5]" />
                    <span>Back to Home</span>
                  </button>

                  {/* Dedicated Mute Button & Interactive Volume Popover */}
                  <div className="relative flex items-center bg-black/40 border border-white/10 rounded-full p-0.5 gap-0.5">
                    <button
                      onClick={() => audioCtrl.toggleSound(setIsMuted, setMusicVolume, setMusicPlaying)}
                      className={`p-1.5 sm:p-2 rounded-full border transition origin-spring ${
                        isMuted || musicVolume === 0
                          ? 'bg-red-500/25 border-red-400 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.35)]'
                          : 'bg-white/5 border-white/10 text-amber-300 hover:bg-white/10'
                      }`}
                      title={isMuted || musicVolume === 0 ? 'Unmute Music' : `Mute Music (${musicVolume}%)`}
                    >
                      {isMuted || musicVolume === 0 ? (
                        <VolumeX className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                      ) : musicVolume > 50 ? (
                        <Volume2 className="w-3.5 h-3.5" />
                      ) : (
                        <Volume1 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => setShowVolumePopup(prev => !prev)}
                      className={`px-1.5 sm:px-2 py-1 rounded-full border text-[10px] sm:text-[11px] font-mono font-semibold transition origin-spring ${
                        showVolumePopup
                          ? 'bg-amber-400/25 border-amber-400/60 text-amber-200'
                          : isMuted
                            ? 'bg-red-500/10 border-red-500/30 text-red-300'
                            : 'bg-transparent border-transparent text-gray-300 hover:text-white'
                      }`}
                      title="Adjust Volume"
                    >
                      <span>{isMuted ? 'MUTED' : `${musicVolume}%`}</span>
                    </button>

                    {showVolumePopup && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-[#161224]/95 backdrop-blur-xl border border-amber-400/30 rounded-xl shadow-2xl p-3 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex items-center justify-between text-xs text-amber-200 font-semibold">
                          <span>Volume</span>
                          <span className="font-mono">{musicVolume}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={musicVolume}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setMusicVolume(val);
                            audioCtrl.setVolume(val / 100, setIsMuted, setMusicVolume);
                          }}
                          className="w-full accent-amber-400 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </header>
          ) : (
            /* Full Setup Navigation Bar (Pre-Match / Game Over) */
            <header className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-20 w-[97%] max-w-7xl pointer-events-none transition-all duration-300">
            <div className="bg-[#161320]/80 backdrop-blur-xl border border-white/15 shadow-2xl rounded-2xl sm:rounded-full px-2.5 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pointer-events-auto">
              
              {/* Prominent Back to Home Button */}
              <div className="flex items-center gap-2 pl-1 pr-2.5 border-r border-white/10">
                <button
                  onClick={handleReturnToLobby}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/35 border border-amber-400/60 text-amber-200 text-xs font-extrabold transition-all shadow-md origin-spring cursor-pointer"
                  title="Back to Home Screen"
                >
                  <ArrowLeft className="w-4 h-4 text-amber-300 stroke-[2.5]" />
                  <span>Back to Home</span>
                </button>
                <div className="hidden lg:block">
                  <h1 className="font-serif text-xs sm:text-sm font-bold tracking-wider text-white leading-none">
                    WIZARD&apos;S CHESS
                  </h1>
                  <p className="text-[9px] text-purple-300/80 tracking-widest uppercase mt-0.5">
                    {ROYAL_THEMES[royalTheme].name}
                  </p>
                </div>
              </div>

          {/* Game Mode Pills with Lock when Match in Progress */}
          <div
            className="flex items-center gap-1 bg-black/35 p-1 rounded-full border border-white/10 origin-spring"
            title={isGameActive ? "Match in progress! Reset board to switch modes." : "Choose Game Mode"}
          >
            <button
              disabled={isGameActive}
              onClick={() => { if (!isGameActive) { setGameMode('ai'); audioCtrl.playSelect(); } }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition origin-spring ${
                gameMode === 'ai'
                  ? 'bg-gradient-to-r from-purple-500/30 to-amber-400/25 border border-amber-400/60 text-amber-100 shadow-lg'
                  : 'text-gray-300 hover:text-white'
              } ${isGameActive ? (gameMode === 'ai' ? 'cursor-default opacity-100' : 'cursor-not-allowed opacity-40') : ''}`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>vs AI</span>
              {isGameActive && gameMode === 'ai' && <Lock className="w-3 h-3 text-amber-300/80 ml-0.5" />}
            </button>
            <button
              disabled={isGameActive}
              onClick={() => { if (!isGameActive) { setGameMode('2p'); audioCtrl.playSelect(); } }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition origin-spring ${
                gameMode === '2p'
                  ? 'bg-gradient-to-r from-purple-500/30 to-amber-400/25 border border-amber-400/60 text-amber-100 shadow-lg'
                  : 'text-gray-300 hover:text-white'
              } ${isGameActive ? (gameMode === '2p' ? 'cursor-default opacity-100' : 'cursor-not-allowed opacity-40') : ''}`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{activeFriendOpponent ? `vs ${activeFriendOpponent}` : '2P / Duel'}</span>
              {isGameActive && gameMode === '2p' && <Lock className="w-3 h-3 text-amber-300/80 ml-0.5" />}
            </button>
          </div>

          {/* AI Difficulty & Side Selector (When vs AI mode) */}
          {gameMode === 'ai' && (
            <div className="flex items-center gap-1.5 bg-black/35 p-1 rounded-full border border-amber-400/30">
              {/* Play Side (White vs Black) */}
              <div className="flex items-center bg-black/40 p-0.5 rounded-full border border-white/10 text-xs">
                <button
                  disabled={isGameActive}
                  onClick={() => handleSelectPlayerColor('w')}
                  className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-semibold transition origin-spring ${
                    playerColor === 'w'
                      ? 'bg-amber-400/30 border border-amber-400/70 text-amber-100 shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Play as White (You move first)"
                >
                  ♔ White
                </button>
                <button
                  disabled={isGameActive}
                  onClick={() => handleSelectPlayerColor('b')}
                  className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-semibold transition origin-spring ${
                    playerColor === 'b'
                      ? 'bg-purple-500/35 border border-purple-400/70 text-purple-200 shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Play as Black (AI moves first as White)"
                >
                  ♚ Black
                </button>
              </div>

              {/* AI Difficulty Selector */}
              <div className="hidden sm:flex items-center bg-black/40 p-0.5 rounded-full border border-white/10 text-xs">
                {[
                  { id: 'easy', label: 'Easy' },
                  { id: 'medium', label: 'Medium' },
                  { id: 'hard', label: 'Hard' },
                  { id: 'expert', label: 'Expert' }
                ].map(d => (
                  <button
                    key={d.id}
                    disabled={isGameActive}
                    onClick={() => { setAiDifficulty(d.id); audioCtrl.playSelect(); }}
                    className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-semibold transition origin-spring ${
                      aiDifficulty === d.id
                        ? 'bg-gradient-to-r from-purple-500/30 to-amber-400/25 border border-amber-400/60 text-amber-200 shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title={`Difficulty: ${d.label}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Match Time Control Selector */}
          <div className="flex items-center gap-1 bg-black/35 p-1 rounded-full border border-amber-400/30 text-xs">
            <span className="hidden sm:inline text-[11px] font-bold text-amber-300 uppercase tracking-wider pl-1.5 pr-0.5">
              Timer:
            </span>
            <div className="flex items-center bg-black/40 p-0.5 rounded-full border border-white/10 text-xs">
              {[
                { label: '3m', val: 3, title: '3 Minutes (Blitz)' },
                { label: '5m', val: 5, title: '5 Minutes (Blitz)' },
                { label: '10m', val: 10, title: '10 Minutes (Rapid)' },
                { label: '15m', val: 15, title: '15 Minutes (Rapid)' },
                { label: '∞', val: 0, title: 'Untimed (Casual)' }
              ].map(tc => (
                <button
                  key={tc.val}
                  disabled={isGameActive}
                  onClick={() => handleSetTimeControl(tc.val)}
                  className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-bold transition origin-spring ${
                    matchDurationMin === tc.val
                      ? 'bg-amber-400/30 border border-amber-400/70 text-amber-100 shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  } ${isGameActive ? (matchDurationMin === tc.val ? 'cursor-default' : 'opacity-40 cursor-not-allowed') : ''}`}
                  title={tc.title}
                >
                  {tc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Themes and Camera Angle Presets Side by Side */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Interactive Theme Dropdown */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGameThemeDropdownOpen(prev => !prev);
                  audioCtrl.playSelect();
                }}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/25 via-purple-600/25 to-cyan-500/20 border border-amber-400/50 text-amber-200 hover:brightness-125 transition origin-spring shadow-sm cursor-pointer ${
                  gameThemeDropdownOpen ? 'ring-2 ring-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : ''
                }`}
                title="Select Realm Theme (11 Themes)"
              >
                <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${ROYAL_THEMES[royalTheme]?.badgeClass || 'from-amber-400 to-purple-600'} animate-pulse`} />
                <span className="font-bold text-white max-w-[110px] truncate">{ROYAL_THEMES[royalTheme]?.shortName || ROYAL_THEMES[royalTheme]?.name || 'Theme'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-amber-300 shrink-0 transition-transform duration-200 ${gameThemeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Theme Dropdown Popover Menu */}
              {gameThemeDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-[#161224]/95 backdrop-blur-2xl border border-amber-400/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.15)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[75vh] flex flex-col">
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between px-2 py-1 mb-1.5 border-b border-white/10 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Select Realm (11 Themes)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setGameThemeDropdownOpen(false);
                        setGameThemeVaultOpen(true);
                      }}
                      className="text-[10px] text-amber-300/80 hover:text-amber-200 hover:underline cursor-pointer"
                    >
                      Browse Vault ↗
                    </button>
                  </div>

                  {/* Themes List Scrollable */}
                  <div className="space-y-1 overflow-y-auto pr-1 flex-1">
                    {/* Category: Classic */}
                    <div className="text-[9px] font-black tracking-widest text-amber-400/70 uppercase px-2 pt-1 pb-0.5">
                      👑 Classic Realms (5)
                    </div>
                    {Object.values(ROYAL_THEMES)
                      .filter(t => !t.genre)
                      .map(theme => {
                        const isCurrent = royalTheme === theme.id;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectRoyalTheme(theme.id);
                              setGameThemeDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer text-left ${
                              isCurrent
                                ? 'bg-amber-400/25 border border-amber-400/60 text-amber-100 font-bold shadow-sm'
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${theme.badgeClass || 'from-amber-400 to-purple-600'} shrink-0`} />
                              <div className="truncate">
                                <span className="text-white font-medium">{theme.name}</span>
                                <span className="text-[10px] text-slate-400 block truncate leading-none mt-0.5">{theme.musicName}</span>
                              </div>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0 ml-1.5" />}
                          </button>
                        );
                      })}

                    {/* Category: Horror */}
                    <div className="text-[9px] font-black tracking-widest text-rose-400/70 uppercase px-2 pt-2 pb-0.5">
                      💀 Horror Realms (2)
                    </div>
                    {Object.values(ROYAL_THEMES)
                      .filter(t => t.genre === 'horror')
                      .map(theme => {
                        const isCurrent = royalTheme === theme.id;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectRoyalTheme(theme.id);
                              setGameThemeDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer text-left ${
                              isCurrent
                                ? 'bg-amber-400/25 border border-amber-400/60 text-amber-100 font-bold shadow-sm'
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${theme.badgeClass || 'from-amber-400 to-purple-600'} shrink-0`} />
                              <div className="truncate">
                                <span className="text-white font-medium">{theme.name}</span>
                                <span className="text-[10px] text-slate-400 block truncate leading-none mt-0.5">{theme.musicName}</span>
                              </div>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0 ml-1.5" />}
                          </button>
                        );
                      })}

                    {/* Category: Adventure */}
                    <div className="text-[9px] font-black tracking-widest text-emerald-400/70 uppercase px-2 pt-2 pb-0.5">
                      🧭 Adventure Realms (2)
                    </div>
                    {Object.values(ROYAL_THEMES)
                      .filter(t => t.genre === 'adventure')
                      .map(theme => {
                        const isCurrent = royalTheme === theme.id;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectRoyalTheme(theme.id);
                              setGameThemeDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer text-left ${
                              isCurrent
                                ? 'bg-amber-400/25 border border-amber-400/60 text-amber-100 font-bold shadow-sm'
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${theme.badgeClass || 'from-amber-400 to-purple-600'} shrink-0`} />
                              <div className="truncate">
                                <span className="text-white font-medium">{theme.name}</span>
                                <span className="text-[10px] text-slate-400 block truncate leading-none mt-0.5">{theme.musicName}</span>
                              </div>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0 ml-1.5" />}
                          </button>
                        );
                      })}

                    {/* Category: Action / War */}
                    <div className="text-[9px] font-black tracking-widest text-orange-400/70 uppercase px-2 pt-2 pb-0.5">
                      ⚔️ Action / War Realms (2)
                    </div>
                    {Object.values(ROYAL_THEMES)
                      .filter(t => t.genre === 'action')
                      .map(theme => {
                        const isCurrent = royalTheme === theme.id;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectRoyalTheme(theme.id);
                              setGameThemeDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer text-left ${
                              isCurrent
                                ? 'bg-amber-400/25 border border-amber-400/60 text-amber-100 font-bold shadow-sm'
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${theme.badgeClass || 'from-amber-400 to-purple-600'} shrink-0`} />
                              <div className="truncate">
                                <span className="text-white font-medium">{theme.name}</span>
                                <span className="text-[10px] text-slate-400 block truncate leading-none mt-0.5">{theme.musicName}</span>
                              </div>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0 ml-1.5" />}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Camera Preset Pills (White, Black, Overhead, Orbit) */}
            <div className="flex items-center gap-0.5 bg-black/40 p-1 rounded-full border border-white/10">
              <span className="hidden xl:inline text-[10px] font-bold text-amber-300 uppercase tracking-wider pl-1.5 pr-0.5">
                View:
              </span>
              {CAMERA_PRESETS.map(cam => (
                <button
                  key={cam.id}
                  onClick={() => handleSelectCameraPreset(cam.id)}
                  className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-semibold transition origin-spring ${
                    camPreset === cam.id
                      ? 'bg-gradient-to-r from-purple-500/35 to-amber-400/25 border border-amber-400/60 text-amber-100 shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={`Camera View: ${cam.label}`}
                >
                  {cam.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Action Controls: Notice Board, Reset, Theme OST Deck, Volume */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Tactical Notice Board Toggle */}
            <button
              onClick={() => { setNoticeBoardOpen(prev => !prev); audioCtrl.playSelect(); }}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold border transition origin-spring ${
                noticeBoardOpen
                  ? 'bg-amber-400/25 border-amber-400/60 text-amber-200 shadow-md'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/15'
              }`}
              title="Toggle Tactical Move Notice Board"
            >
              <ScrollText className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Notice Board</span>
              <span className="md:hidden">2D</span>
            </button>

            {/* Reset Game Button */}
            <button
              onClick={handleResetBoard}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/15 transition origin-spring"
              title="Reset Game"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Single Theme Epic Soundtrack Player (No manual music skipping - bound 1-to-1 with Theme) */}
            <div className="flex items-center bg-black/40 border border-white/10 rounded-full p-0.5">
              <button
                onClick={() => {
                  if (musicPlaying) audioCtrl.stopMusic(setMusicPlaying);
                  else audioCtrl.playGameThemeMusic(royalTheme, setMusicPlaying);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition origin-spring ${
                  musicPlaying
                    ? 'bg-amber-400/20 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
                    : 'text-gray-400 hover:text-white'
                }`}
                title={`Theme BGM: ${ROYAL_THEMES[royalTheme]?.musicName || 'Theme Music'} (Looping until Game Over)`}
              >
                <Music className={`w-3.5 h-3.5 text-amber-300 ${musicPlaying ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline max-w-[125px] truncate text-[11px]">
                  {musicPlaying ? (ROYAL_THEMES[royalTheme]?.musicName || 'Playing') : 'Music Paused'}
                </span>
              </button>
            </div>

            {/* Dedicated Mute Button & Interactive Volume / Theme Soundtrack Popover */}
            <div className="relative flex items-center bg-black/40 border border-white/10 rounded-full p-0.5 gap-0.5">
              {/* Direct 1-Click Mute Toggle Button */}
              <button
                onClick={() => audioCtrl.toggleSound(setIsMuted, setMusicVolume, setMusicPlaying)}
                className={`p-2 rounded-full border transition origin-spring ${
                  isMuted || musicVolume === 0
                    ? 'bg-red-500/25 border-red-400 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.35)]'
                    : 'bg-white/5 border-white/10 text-amber-300 hover:bg-white/10'
                }`}
                title={isMuted || musicVolume === 0 ? 'Unmute Music (Currently Muted)' : `Mute Music (Volume: ${musicVolume}%)`}
              >
                {isMuted || musicVolume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400 animate-pulse" />
                ) : musicVolume > 50 ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <Volume1 className="w-4 h-4" />
                )}
              </button>

              {/* Volume Badge Button (Opens Popover) */}
              <button
                onClick={() => setShowVolumePopup(prev => !prev)}
                className={`px-2 py-1.5 rounded-full border text-[11px] font-mono font-semibold transition origin-spring ${
                  showVolumePopup
                    ? 'bg-amber-400/25 border-amber-400/60 text-amber-200'
                    : isMuted
                      ? 'bg-red-500/10 border-red-500/30 text-red-300'
                      : 'bg-transparent border-transparent text-gray-300 hover:text-white'
                }`}
                title="Adjust volume & theme soundtrack"
              >
                <span>{isMuted ? 'MUTED' : `${musicVolume}%`}</span>
              </button>

              {showVolumePopup && (
                <div className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-2xl origin-glass origin-scale-in border border-amber-400/30 shadow-2xl z-50 text-white flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 tracking-wide uppercase">Theme Audio &amp; Volume</span>
                    <button
                      onClick={() => audioCtrl.toggleMute(setIsMuted, setMusicVolume)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition origin-spring ${
                        isMuted
                          ? 'bg-red-500/30 border border-red-400 text-red-200 shadow-md animate-pulse'
                          : 'bg-white/10 border border-white/20 text-gray-300 hover:text-white'
                      }`}
                    >
                      {isMuted ? 'Muted (Tap to Unmute)' : 'Mute Music'}
                    </button>
                  </div>

                  {/* Volume Slider with min/max icons */}
                  <div className="flex items-center gap-2">
                    <VolumeX
                      className={`w-3.5 h-3.5 shrink-0 cursor-pointer transition ${isMuted ? 'text-red-400' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => audioCtrl.setVolume(0, setIsMuted, setMusicVolume)}
                      title="Mute to 0%"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : musicVolume}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        audioCtrl.setVolume(val / 100, setIsMuted, setMusicVolume);
                      }}
                      className="w-full accent-amber-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                    <Volume2
                      className="w-3.5 h-3.5 text-amber-300 shrink-0 cursor-pointer hover:text-amber-200"
                      onClick={() => audioCtrl.setVolume(1.0, setIsMuted, setMusicVolume)}
                      title="100% Volume"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center justify-between gap-1">
                    {[
                      { label: 'Mute', val: 0 },
                      { label: '30%', val: 30 },
                      { label: '65%', val: 65 },
                      { label: '100%', val: 100 }
                    ].map(p => (
                      <button
                        key={p.label}
                        onClick={() => audioCtrl.setVolume(p.val / 100, setIsMuted, setMusicVolume)}
                        className={`flex-1 py-0.5 rounded text-[10px] font-semibold border transition ${
                          (!isMuted && musicVolume === p.val) || (isMuted && p.val === 0)
                            ? 'bg-amber-400/30 border-amber-400 text-amber-200'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Theme Soundtracks (Bound 1-to-1) */}
                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-white/10">
                    <span>Active Theme OST:</span>
                    <span className="text-amber-300 font-semibold">{ROYAL_THEMES[royalTheme]?.musicName}</span>
                  </div>

                  <div className="flex flex-col gap-1 max-h-44 overflow-y-auto pr-1">
                    {Object.values(ROYAL_THEMES).map((theme) => {
                      const isCurrent = royalTheme === theme.id;
                      return (
                        <button
                          key={theme.id}
                          disabled={isGameActive}
                          onClick={() => handleSelectRoyalTheme(theme.id)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition text-left origin-spring ${
                            isCurrent
                              ? 'bg-amber-400/25 border border-amber-400/60 text-amber-200 font-semibold'
                              : isGameActive
                                ? 'opacity-40 cursor-not-allowed text-gray-400'
                                : 'hover:bg-white/10 text-gray-300'
                          }`}
                          title={isGameActive ? 'Theme locked during match (unlocked after game over)' : `Theme: ${theme.name}`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className={`w-2 h-2 rounded-full shrink-0 bg-gradient-to-tr ${theme.badgeClass}`} />
                            <span className="font-semibold text-white/90">{theme.shortName}:</span>
                            <span className="truncate text-gray-300">{theme.musicName}</span>
                          </div>
                          {isCurrent && (
                            <span className="flex items-center gap-1 text-[10px] text-amber-300 font-mono shrink-0 ml-1">
                              {musicPlaying ? '♪ Loop' : 'Paused'}
                              {isGameActive && <Lock className="w-2.5 h-2.5" />}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {isGameActive && (
                    <div className="text-[10px] text-amber-200/80 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded text-center">
                      Themes locked during play • Changeable after Game Over
                    </div>
                  )}
                </div>
              )}
            </div>


          </div>
        </div>
      </header>
      )}

      {/* Bottom Telemetry Dock: Turn Indicator, Clocks, Move History & Captured Pieces */}
      <footer className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 w-[97%] max-w-5xl pointer-events-none transition-all duration-300">
        <div className="bg-[#161320]/85 backdrop-blur-xl border border-white/15 shadow-2xl rounded-2xl sm:rounded-3xl px-3.5 sm:px-5 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-auto">
          
          {/* Active Turn & Check Alert */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  turnColor === 'w'
                    ? 'bg-amber-100 shadow-[0_0_12px_#fef3c7] border border-amber-400'
                    : 'bg-purple-500 shadow-[0_0_12px_#a855f7] border border-purple-300'
                }`}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {turnColor === 'w'
                      ? (currentUser?.username ? `${currentUser.username}'s Turn (White)` : "White's Turn")
                      : `${activeFriendOpponent || (gameMode === 'ai' ? 'Obsidian AI' : 'Black')}'s Turn`}
                  </span>
                  {(inCheck || gameOverText) && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-red-500/25 text-red-300 border border-red-500/40 animate-pulse">
                      {gameOverText || 'CHECK'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400">{subStatusText}</p>
              </div>
            </div>
          </div>

          {/* Clocks for Timed Matches or Untimed Indicator */}
          {isTimedMatch ? (
            <div
              onClick={() => {
                if (!isGameActive) {
                  const nextMap = { 3: 5, 5: 10, 10: 15, 15: 0, 0: 3 };
                  handleSetTimeControl(nextMap[matchDurationMin] ?? 10);
                }
              }}
              className={`flex items-center gap-2 px-3 py-1 rounded-full bg-black/45 border border-white/10 text-xs font-mono select-none ${
                !isGameActive ? 'cursor-pointer hover:border-amber-400/50 hover:bg-black/60 transition' : ''
              }`}
              title={!isGameActive ? 'Click to cycle time control (3m, 5m, 10m, 15m, Untimed)' : 'Match Clocks'}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className={`font-semibold ${turnColor === 'w' ? 'text-amber-300 font-bold' : 'text-gray-400'}`}>
                ♔ {Math.floor(whiteClockSec / 60)}:{(whiteClockSec % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-gray-600">|</span>
              <span className={`font-semibold ${turnColor === 'b' ? 'text-purple-300 font-bold' : 'text-gray-400'}`}>
                ♚ {Math.floor(blackClockSec / 60)}:{(blackClockSec % 60).toString().padStart(2, '0')}
              </span>
            </div>
          ) : (
            <div
              onClick={() => {
                if (!isGameActive) handleSetTimeControl(10);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 border border-white/10 text-xs font-mono text-amber-200 select-none ${
                !isGameActive ? 'cursor-pointer hover:border-amber-400/50 hover:bg-black/60 transition' : ''
              }`}
              title={!isGameActive ? 'Click to enable timed match (10m)' : 'Untimed Casual Match'}
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Untimed</span>
            </div>
          )}

          {/* Algebraic Move History Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full sm:max-w-xs md:max-w-sm px-2.5 py-1 bg-black/30 rounded-full border border-white/10 text-xs text-gray-300 h-8">
            {moveHistory.length === 0 ? (
              <span className="text-gray-500 italic px-2 text-[11px]">No moves yet — battle awaits</span>
            ) : (
              moveHistory.slice(-8).map(m => (
                <span key={m.num} className="px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-mono text-amber-100 shrink-0">
                  {m.num}.{m.san}
                </span>
              ))
            )}
          </div>

          {/* Shattered Pieces Tally */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-1.5 sm:pt-0 border-white/10">
            <div className="flex items-center gap-1.5 bg-black/35 px-2.5 py-1 rounded-full border border-white/10" title="Shattered Black Pieces">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-xs text-purple-200 font-medium min-w-[24px]">
                {capturedByBlack.length ? capturedByBlack.join('') : '—'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/35 px-2.5 py-1 rounded-full border border-white/10" title="Shattered White Pieces">
              <span className="w-2 h-2 rounded-full bg-amber-200" />
              <span className="text-xs text-amber-100 font-medium min-w-[24px]">
                {capturedByWhite.length ? capturedByWhite.join('') : '—'}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Check Alert during active match */}
      {isGameActive && inCheck && !gameOverText && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce">
          <div className="px-4 py-1.5 rounded-full bg-red-950/90 backdrop-blur-md border border-red-500/60 text-red-200 text-xs font-bold tracking-wider uppercase shadow-[0_0_24px_rgba(239,68,68,0.5)]">
            Check in Cathedral Sanctum!
          </div>
        </div>
      )}

      {/* Floating AI Thinking Indicator (Shows during engine calculation) */}
      {aiThinking && (
        <div className="fixed top-14 sm:top-18 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in zoom-in duration-200">
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#181326]/90 backdrop-blur-xl border border-amber-400/60 shadow-[0_0_30px_rgba(251,191,36,0.4)] text-amber-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <Bot className="w-4 h-4 text-amber-300 animate-spin" />
            <span>AI Thinking ({aiDifficulty.toUpperCase()})...</span>
          </div>
        </div>
      )}

      {/* Tactical Notice Board (Alternative Move Control Center Beside the Board) */}
      {noticeBoardOpen ? (
        <aside className="fixed right-2 sm:right-5 top-20 sm:top-24 z-20 w-72 sm:w-84 max-h-[calc(100vh-9.5rem)] bg-[#14101e]/92 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto">
          {/* Notice Board Top Plaque */}
          <div className="px-3 py-2 bg-gradient-to-r from-amber-950/70 via-purple-950/60 to-black/80 border-b border-amber-500/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-amber-300" />
              <div>
                <h3 className="font-serif text-xs font-bold text-amber-100 tracking-wider flex items-center gap-1.5">
                  COMMAND NOTICE BOARD
                  <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">ALT MOVE</span>
                </h3>
              </div>
            </div>
            <button
              onClick={() => { setNoticeBoardOpen(false); audioCtrl.playSelect(); }}
              className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition"
              title="Minimize Notice Board"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="p-2 pb-0 flex gap-1 border-b border-white/5 bg-black/25">
            <button
              onClick={() => { setNoticeTab('board'); audioCtrl.playSelect(); }}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                noticeTab === 'board'
                  ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40 shadow'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>2D Board</span>
            </button>
            <button
              onClick={() => { setNoticeTab('moves'); audioCtrl.playSelect(); }}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                noticeTab === 'moves'
                  ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40 shadow'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Legal Moves ({engineRef.current.chess ? engineRef.current.chess.moves().length : 0})</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-3 overflow-y-auto space-y-2.5 max-h-[calc(100vh-15rem)]">
            {noticeTab === 'board' ? (
              <div className="flex flex-col items-center">
                {/* 2D Interactive Board with Ranks 8-1 and Files A-H */}
                <div className="bg-[#1b1627] p-1.5 rounded-xl border border-amber-500/30 shadow-inner">
                  <div className="grid grid-cols-9 gap-0.5 text-center select-none font-mono text-[10px]">
                    {/* Rank numbers + Squares */}
                    {[8, 7, 6, 5, 4, 3, 2, 1].map(r => (
                      <React.Fragment key={r}>
                        <div className="w-4 h-6 sm:w-5 sm:h-7 flex items-center justify-center text-amber-300/80 font-bold text-[10px]">
                          {r}
                        </div>
                        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((f, fIdx) => {
                          const sq = `${f}${r}`;
                          const piece = engineRef.current.chess ? engineRef.current.chess.get(sq) : null;
                          const isLight = (fIdx + (8 - r)) % 2 === 0;
                          const isSelected = selectedSquare === sq;
                          const legalMoves = engineRef.current.legalMoves || [];
                          const isDest = legalMoves.some(m => m.to === sq);
                          const isDestCapture = isDest && Boolean(piece);

                          return (
                            <button
                              key={sq}
                              onClick={() => handleSquareTap(sq)}
                              className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center relative rounded-[3px] transition ${
                                isSelected
                                  ? 'bg-amber-400/40 ring-2 ring-amber-400 shadow-[0_0_8px_#f59e0b]'
                                  : isDest
                                  ? isDestCapture
                                    ? 'bg-red-500/35 ring-1 ring-red-400'
                                    : 'bg-emerald-500/30 ring-1 ring-emerald-400'
                                  : isLight
                                  ? 'bg-[#d8d0c5]/15 hover:bg-white/25 text-amber-100'
                                  : 'bg-[#2b2438]/85 hover:bg-purple-900/40 text-purple-200'
                              }`}
                              title={sq}
                            >
                              {/* Move dot */}
                              {isDest && !piece && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] pointer-events-none" />
                              )}
                              {/* Piece glyph */}
                              {piece && (
                                <span
                                  className={`text-sm sm:text-base leading-none font-serif select-none pointer-events-none ${
                                    piece.color === 'w'
                                      ? 'text-amber-200 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]'
                                      : 'text-purple-300 drop-shadow-[0_0_4px_rgba(168,85,247,0.8)]'
                                  }`}
                                >
                                  {piece.type === 'p' ? '♟' :
                                   piece.type === 'n' ? '♞' :
                                   piece.type === 'b' ? '♝' :
                                   piece.type === 'r' ? '♜' :
                                   piece.type === 'q' ? '♛' : '♚'}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </React.Fragment>
                    ))}

                    {/* Bottom File Letters A-H */}
                    <div className="w-4 h-4 sm:w-5 sm:h-4" />
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(l => (
                      <div key={l} className="w-6 sm:w-7 h-4 flex items-center justify-center text-amber-300/80 font-bold text-[9px]">
                        {l}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Piece Info & Available Destination Quick Chips */}
                {selectedSquare && (
                  <div className="w-full mt-2 p-2 rounded-xl bg-amber-400/10 border border-amber-400/30">
                    <div className="flex items-center justify-between text-xs text-amber-200 mb-1 font-semibold">
                      <span>Selected: <span className="font-mono uppercase font-bold text-amber-300">{selectedSquare}</span></span>
                      <button
                        onClick={() => handleSquareTap(selectedSquare)}
                        className="text-[10px] text-gray-400 hover:text-white"
                      >
                        Deselect
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(engineRef.current.legalMoves || []).length === 0 ? (
                        <span className="text-[10px] text-gray-400 italic">No legal moves for this square</span>
                      ) : (
                        (engineRef.current.legalMoves || []).map(m => (
                          <button
                            key={m.to}
                            onClick={() => handleSquareTap(m.to)}
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition flex items-center gap-1 ${
                              m.captured
                                ? 'bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30'
                                : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                            }`}
                          >
                            <span>→ {m.to}</span>
                            {m.captured && <span className="text-[9px]">⚔</span>}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Legal Moves List Tab */
              <div className="space-y-2">
                <p className="text-[11px] text-gray-400">Click any move to execute immediately:</p>
                <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {engineRef.current.chess && engineRef.current.chess.moves({ verbose: true }).map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExecuteNoticeMove(m.from, m.to)}
                      className="px-2 py-1.5 rounded-lg bg-black/40 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/50 text-left transition active:scale-95 group"
                    >
                      <div className="text-xs font-mono font-bold text-amber-200 group-hover:text-amber-300 flex items-center justify-between">
                        <span>{m.san}</span>
                        {m.captured && <span className="text-[9px] text-red-400">⚔</span>}
                      </div>
                      <div className="text-[9px] text-gray-400 font-mono mt-0.5">
                        {m.from} → {m.to}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Algebraic Command Spellcaster Input */}
            <form onSubmit={handleCastCommand} className="pt-2 border-t border-white/10">
              <div className="text-[11px] text-gray-400 mb-1 flex items-center justify-between">
                <span>Or Cast by Notation:</span>
                <span className="text-[9px] font-mono text-amber-400/80">e4, Nf3, e2e4</span>
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="e.g. e4, Nf3, e2e4"
                  className="flex-1 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/15 text-xs font-mono text-amber-100 placeholder-gray-500 focus:outline-none focus:border-amber-400/60"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/30 to-purple-500/30 hover:from-amber-500/40 hover:to-purple-500/40 border border-amber-400/50 text-amber-100 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Send className="w-3 h-3 text-amber-300" />
                  <span>Cast</span>
                </button>
              </div>
              {commandError && (
                <p className="text-[10px] text-red-400 mt-1">{commandError}</p>
              )}
            </form>

            <div className="text-[10px] text-gray-400 bg-white/5 p-2 rounded-xl border border-white/5 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Click pieces on the 3D board, click on this Notice Board, or cast notation commands.</span>
            </div>
          </div>
        </aside>
      ) : (
        /* Minimized Floating Button */
        <button
          onClick={() => { setNoticeBoardOpen(true); audioCtrl.playSelect(); }}
          className="fixed right-3 sm:right-6 top-24 sm:top-28 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-[#161320]/90 backdrop-blur-md border border-amber-400/50 text-amber-200 text-xs font-semibold shadow-2xl hover:bg-purple-950/80 transition"
          title="Open Tactical Move Notice Board"
        >
          <ScrollText className="w-4 h-4 text-amber-300" />
          <span>Notice Board (Alt Move)</span>
        </button>
      )}

      {/* Realm Vault Selection Modal for In-Game / Pre-Match Header */}
      {gameThemeVaultOpen && (
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
                onClick={() => setGameThemeVaultOpen(false)}
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
                  onClick={() => setGameThemeFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    gameThemeFilter === cat.id
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
              {Object.values(ROYAL_THEMES)
                .filter(t => {
                  if (gameThemeFilter === 'all') return true;
                  if (gameThemeFilter === 'classic') return !t.genre;
                  return t.genre === gameThemeFilter;
                })
                .map(t => {
                  const isSelected = royalTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        handleSelectRoyalTheme(t.id);
                        setGameThemeVaultOpen(false);
                      }}
                      className={`relative p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer group ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-400/25 via-amber-500/15 to-purple-600/20 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                          : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-amber-400/40'
                      }`}
                    >
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
              <span>Fires &amp; environment update in real-time.</span>
              <button
                type="button"
                onClick={() => setGameThemeVaultOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pawn Promotion Modal */}
      {pendingPromotion && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#161320]/95 border border-amber-400/40 rounded-3xl p-5 flex flex-col items-center gap-4 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <h3 className="font-serif text-lg font-bold text-amber-200">ASCENSION RITE</h3>
              <p className="text-xs text-gray-300 mt-0.5">Choose the sculpted form for your promoted Pawn</p>
            </div>
            <div className="grid grid-cols-4 gap-2 w-full">
              {[
                { id: 'q', label: 'Queen', icon: '♛' },
                { id: 'r', label: 'Rook', icon: '♜' },
                { id: 'b', label: 'Bishop', icon: '♝' },
                { id: 'n', label: 'Knight', icon: '♞' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => handleCompletePromotion(p.id)}
                  className="flex flex-col items-center py-3 rounded-2xl bg-white/5 hover:bg-purple-500/25 border border-white/10 hover:border-amber-400/50 transition"
                >
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-[11px] mt-1 font-semibold">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Game Over Conclusion Modal (Victory / Defeat / Draw) */}
      {matchResult && !isInspectingBoard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className={`relative w-full max-w-lg bg-[#14101e]/95 border rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl overflow-hidden ${
            matchResult.result === 'VICTORY'
              ? 'border-amber-400/60 shadow-[0_0_60px_rgba(251,191,36,0.35)]'
              : matchResult.result === 'DEFEAT'
              ? 'border-rose-500/50 shadow-[0_0_60px_rgba(244,63,94,0.3)]'
              : 'border-sky-400/50 shadow-[0_0_60px_rgba(56,189,248,0.25)]'
          }`}>
            {/* Ambient backdrop glow */}
            <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-25 ${
              matchResult.result === 'VICTORY' ? 'bg-amber-400' : matchResult.result === 'DEFEAT' ? 'bg-rose-500' : 'bg-sky-400'
            }`} />

            {/* Result Icon Badge */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border shadow-xl mb-3 relative z-10 ${
              matchResult.result === 'VICTORY'
                ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.4)]'
                : matchResult.result === 'DEFEAT'
                ? 'bg-rose-600/20 border-rose-500/60 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.35)]'
                : 'bg-sky-500/20 border-sky-400/60 text-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.3)]'
            }`}>
              {matchResult.result === 'VICTORY' ? (
                <Crown className="w-9 h-9 sm:w-11 sm:h-11 animate-pulse" />
              ) : matchResult.result === 'DEFEAT' ? (
                <Swords className="w-9 h-9 sm:w-11 sm:h-11" />
              ) : (
                <Handshake className="w-9 h-9 sm:w-11 sm:h-11" />
              )}
            </div>

            {/* Clear Result Banner */}
            <h2 className={`font-serif text-3xl sm:text-4xl font-extrabold tracking-widest uppercase text-transparent bg-clip-text relative z-10 ${
              matchResult.result === 'VICTORY'
                ? 'bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500'
                : matchResult.result === 'DEFEAT'
                ? 'bg-gradient-to-r from-rose-200 via-red-400 to-rose-600'
                : 'bg-gradient-to-r from-sky-100 via-amber-200 to-sky-300'
            }`}>
              {matchResult.result}
            </h2>

            <p className="text-xs sm:text-sm text-purple-200/90 mt-1 font-medium relative z-10 max-w-sm">
              {subStatusText}
            </p>

            {/* Structured Match Details Grid */}
            <div className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 my-5 relative z-10 grid grid-cols-2 gap-3 text-left">
              <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/70 block">Victor</span>
                <span className="text-xs sm:text-sm font-semibold text-white truncate block mt-0.5">
                  {matchResult.winner}
                </span>
              </div>

              <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/70 block">Opponent</span>
                <span className="text-xs sm:text-sm font-semibold text-purple-200 truncate block mt-0.5">
                  {matchResult.opponent}
                </span>
              </div>

              <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/70 block">Move Count</span>
                <span className="text-xs sm:text-sm font-semibold text-white block mt-0.5">
                  {matchResult.moveCount} {matchResult.moveCount === 1 ? 'Move' : 'Moves'}
                </span>
              </div>

              <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/70 block">Reason</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md mt-0.5 bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  {matchResult.reason}
                </span>
              </div>
            </div>

            {/* Action Buttons: Play Again, Inspect Board, Return to Grand Hall */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full relative z-10">
              <button
                onClick={handleResetBoard}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Play Again</span>
              </button>

              <button
                onClick={() => setIsInspectingBoard(true)}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-gray-200 hover:text-white font-semibold text-xs sm:text-sm tracking-wide transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>Inspect Board</span>
              </button>

              <button
                onClick={handleReturnToLobby}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-amber-200 font-semibold text-xs sm:text-sm tracking-wide transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4 Requirement 3: Floating Action Bar during Board Inspection */}
      {matchResult && isInspectingBoard && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#161224]/90 backdrop-blur-md border border-amber-400/40 rounded-full px-4 py-2 flex items-center gap-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-1.5 pl-1 pr-2 border-r border-white/10">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-semibold text-amber-200">
                Inspecting Board • {matchResult.result}
              </span>
            </div>

            <button
              onClick={() => setIsInspectingBoard(false)}
              className="px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs font-bold tracking-wider uppercase transition flex items-center gap-1.5 cursor-pointer"
            >
              <ScrollText className="w-3.5 h-3.5 text-amber-300" />
              <span>Return to Results</span>
            </button>

            <button
              onClick={handleResetBoard}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
              <span>Play Again</span>
            </button>

            <button
              onClick={handleReturnToLobby}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      )}

      {/* Return to Grand Hall Confirm Dialog (Step 2 Requirement) */}
      {returnConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#161224] border border-amber-400/40 rounded-2xl shadow-2xl p-6 text-white text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-serif font-bold text-amber-100 mb-2">
              Leave Current Battle?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
              {gameMode === 'online' || activeFriendOpponent
                ? 'Leaving mid-match in an online game counts as an immediate resignation and will award the victory to your opponent. Are you sure you wish to return to the Home screen?'
                : 'You have a battle in progress. Returning to the Home screen will abandon this match and discard current progress. Are you sure you wish to return?'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setReturnConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-gray-200 text-xs font-semibold transition"
              >
                Stay in Battle
              </button>
              <button
                type="button"
                onClick={handleConfirmReturnToLobby}
                className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-500 border border-red-400/60 text-white text-xs font-semibold transition shadow-lg shadow-red-900/40"
              >
                {gameMode === 'online' || activeFriendOpponent ? 'Resign & Return' : 'Abandon & Return'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resign Confirm Dialog (Step 2 Requirement) */}
      {resignConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#161224] border border-red-500/40 rounded-2xl shadow-2xl p-6 text-white text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center">
              <Flag className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-serif font-bold text-amber-100 mb-2">
              Concede Battle?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
              Are you sure you wish to resign this match? Victory will be conceded to your opponent.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setResignConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-gray-200 text-xs font-semibold transition"
              >
                Continue Playing
              </button>
              <button
                type="button"
                onClick={handleResign}
                className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-500 border border-red-400/60 text-white text-xs font-semibold transition shadow-lg shadow-red-900/40"
              >
                Concede & Resign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Non-blocking Queued Invites Badge during Active Match (Step 2 Requirement) */}
      {isGameActive && queuedInvites.length > 0 && (
        <div className="fixed top-16 left-4 z-20 pointer-events-auto">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#161224]/90 backdrop-blur-md border border-amber-400/40 shadow-xl text-xs text-amber-200">
            <Swords className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>{queuedInvites[0].from}</strong> invited you to duel (queued until match ends)
            </span>
          </div>
        </div>
      )}

      {/* Sanctum Registry Modal */}
      {sanctumModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
          <div className="bg-[#14111d]/95 border border-purple-500/30 rounded-3xl w-full max-w-4xl overflow-hidden my-auto max-h-[92vh] flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 bg-black/50 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-amber-400/40 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h2 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide">
                    Sanctum Registry
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'Online'
                        ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                        : connectionStatus === 'Reconnecting'
                        ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                        : 'bg-rose-500'
                    }`} />
                    <span className={
                      connectionStatus === 'Online'
                        ? 'text-emerald-300 font-medium'
                        : connectionStatus === 'Reconnecting'
                        ? 'text-amber-300 font-medium'
                        : 'text-rose-300 font-medium'
                    }>
                      {connectionStatus}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSanctumModalOpen(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition"
                title="Close Registry"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Left column (Commander & Auth) | Right column (Fellowship & Chronicles) */}
            <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column (5/12): Commander Status & Sign Up / Log In */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Active Commander Status Card */}
                <div className="bg-black/40 rounded-2xl p-4 border border-white/10">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-2 flex items-center justify-between">
                    <span>Active Commander</span>
                    {currentUser && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Signed In
                      </span>
                    )}
                  </div>

                  {currentUser ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white text-base">@{currentUser.username}</div>
                          <div className="text-xs text-amber-300/90">{currentUser.house}</div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-gray-300 hover:text-white transition"
                          title="Sign Out"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-400" />
                          <span>Log Out</span>
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                        <span className="text-gray-400">Battle Record</span>
                        <span className="font-bold text-purple-200">
                          {currentUser.wins || 0}W • {currentUser.losses || 0}L • {currentUser.draws || 0}D
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/20 text-xs text-purple-200">
                        <div className="font-semibold text-white mb-0.5">Guest Initiate</div>
                        <div>Sign in to play online, duel opponents, and preserve your battle chronicle.</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setRegistryAuthTab('signup'); setRegistryError(''); }}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition ${
                            registryAuthTab === 'signup'
                              ? 'bg-purple-500/30 border border-amber-400/60 text-amber-200'
                              : 'bg-white/5 text-gray-400 hover:text-white'
                          }`}
                        >
                          Sign Up
                        </button>
                        <button
                          onClick={() => { setRegistryAuthTab('login'); setRegistryError(''); }}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition ${
                            registryAuthTab === 'login'
                              ? 'bg-purple-500/30 border border-amber-400/60 text-amber-200'
                              : 'bg-white/5 text-gray-400 hover:text-white'
                          }`}
                        >
                          Log In
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sign Up / Log In Tabs Card */}
                <div className="bg-black/40 rounded-2xl p-4 border border-white/10 flex flex-col gap-3">
                  {/* Tab Selector */}
                  <div className="flex items-center gap-1 p-1 bg-black/50 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => { setRegistryAuthTab('signup'); setRegistryError(''); setRegistrySuccessMsg(''); }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                        registryAuthTab === 'signup'
                          ? 'bg-purple-600/40 text-amber-100 border border-amber-400/50 shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                      <span>Sign Up</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRegistryAuthTab('login'); setRegistryError(''); setRegistrySuccessMsg(''); }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                        registryAuthTab === 'login'
                          ? 'bg-purple-600/40 text-amber-100 border border-amber-400/50 shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <LogIn className="w-3.5 h-3.5 text-amber-300" />
                      <span>Log In</span>
                    </button>
                  </div>

                  {/* Feedback / Error Message */}
                  {registryError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
                      {registryError}
                    </div>
                  )}
                  {registrySuccessMsg && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs">
                      {registrySuccessMsg}
                    </div>
                  )}

                  {registryAuthTab === 'signup' ? (
                    <form onSubmit={handleSignUpSubmit} className="space-y-2.5">
                      <div>
                        <label className="text-[11px] text-gray-300 font-medium block mb-1">
                          Public Handle <span className="text-gray-400 font-normal">(3-16 chars, letters/numbers/_)</span>
                        </label>
                        <input
                          type="text"
                          required
                          autoComplete="username"
                          value={registryUsername}
                          onChange={e => {
                            setRegistryUsername(e.target.value);
                            setRegistryError('');
                          }}
                          placeholder="e.g. Albus_Vance"
                          className="w-full bg-black/60 border border-white/15 focus:border-purple-400 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                        />
                        {registryUsername && registryUsername.includes('@') && (
                          <p className="text-[11px] text-rose-300 mt-1">
                            Username cannot contain '@'. Use letters, numbers, and underscores only.
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] text-gray-300 font-medium block mb-1">
                          Email <span className="text-gray-400 font-normal">(Optional • strictly private)</span>
                        </label>
                        <input
                          type="email"
                          autoComplete="email"
                          value={registryEmail}
                          onChange={e => setRegistryEmail(e.target.value)}
                          placeholder="Optional (never displayed or searchable)"
                          className="w-full bg-black/60 border border-white/15 focus:border-purple-400 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                        />
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Private and optional. Never displayed anywhere in the game.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-gray-300 font-medium block mb-1">Sanctum Order</label>
                          <select
                            value={registryHouse}
                            onChange={e => setRegistryHouse(e.target.value)}
                            className="w-full bg-black/60 border border-white/15 rounded-xl px-2.5 py-2 text-xs text-white outline-none"
                          >
                            <option value="Alabaster Archmage">Alabaster Archmage</option>
                            <option value="Obsidian Sovereign">Obsidian Sovereign</option>
                            <option value="Imperial Grandmaster">Imperial Grandmaster</option>
                            <option value="Sapphire Seer">Sapphire Seer</option>
                            <option value="Emerald Warden">Emerald Warden</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] text-gray-300 font-medium block mb-1">
                            Password <span className="text-gray-400 font-normal">(min 8)</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              minLength={8}
                              autoComplete="new-password"
                              value={registryPassword}
                              onChange={e => setRegistryPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-black/60 border border-white/15 focus:border-purple-400 rounded-xl pl-3 pr-8 py-2 text-xs text-white outline-none transition"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(p => !p)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                              title={showPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={registryLoading}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600/40 to-amber-500/35 border border-amber-400/60 text-amber-100 text-xs font-bold hover:brightness-110 disabled:opacity-50 transition shadow-lg mt-1"
                      >
                        {registryLoading ? 'Enrolling Commander...' : 'Join Sanctum'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleLoginSubmit} className="space-y-2.5">
                      <div>
                        <label className="text-[11px] text-gray-300 font-medium block mb-1">Commander Handle</label>
                        <input
                          type="text"
                          required
                          autoComplete="username"
                          value={registryUsername}
                          onChange={e => {
                            setRegistryUsername(e.target.value);
                            setRegistryError('');
                          }}
                          placeholder="Your username"
                          className="w-full bg-black/60 border border-white/15 focus:border-purple-400 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-gray-300 font-medium block mb-1">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={8}
                            autoComplete="current-password"
                            value={registryPassword}
                            onChange={e => setRegistryPassword(e.target.value)}
                            placeholder="Your password"
                            className="w-full bg-black/60 border border-white/15 focus:border-purple-400 rounded-xl pl-3 pr-8 py-2 text-xs text-white outline-none transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(p => !p)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            title={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={registryLoading}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600/40 to-amber-500/35 border border-amber-400/60 text-amber-100 text-xs font-bold hover:brightness-110 disabled:opacity-50 transition shadow-lg mt-1"
                      >
                        {registryLoading ? 'Verifying...' : 'Log In'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Right Column (7/12): Battle Chronicles (Match History Archive) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {/* Persistent Match History Archive */}
                <div className="bg-black/40 rounded-2xl p-4 border border-white/10 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <History className="w-4 h-4 text-purple-300" />
                      <span>Battle Chronicles</span>
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {matchHistoryVault.length} {matchHistoryVault.length === 1 ? 'record' : 'records'}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 text-xs">
                    {matchHistoryVault.length === 0 ? (
                      <div className="text-gray-400 italic py-6 text-center text-xs">
                        No matches recorded yet. Complete games to build your chronicle.
                      </div>
                    ) : (
                      matchHistoryVault.map((item, idx) => {
                        const isExpanded = expandedHistoryId === (item.id || idx);
                        return (
                          <div
                            key={item.id || idx}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    item.result === 'VICTORY'
                                      ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                                      : item.result === 'DEFEAT'
                                      ? 'bg-rose-500/20 text-rose-200 border-rose-500/40'
                                      : 'bg-purple-500/20 text-purple-200 border-purple-500/40'
                                  }`}
                                >
                                  {item.result}
                                </span>
                                <span className="font-semibold text-white">vs {item.opponent}</span>
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-gray-500" />
                                  <span>{item.timeControl || 'Standard'}</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] text-gray-400">{item.date}</span>
                                <button
                                  type="button"
                                  onClick={() => setExpandedHistoryId(isExpanded ? null : (item.id || idx))}
                                  className="text-[11px] text-amber-300 hover:text-amber-200 underline underline-offset-2 transition"
                                >
                                  {isExpanded ? 'Hide moves' : 'View moves'}
                                </button>
                              </div>
                            </div>

                            {/* Collapsible Moves SAN List */}
                            {isExpanded && (
                              <div className="mt-1 p-2 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-purple-200 leading-relaxed select-text max-h-24 overflow-y-auto">
                                {item.moves || 'No moves recorded.'}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
