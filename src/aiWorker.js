// ============================================================================
// FILE: src/aiWorker.js
// Dedicated Web Worker for Non-Blocking Chess AI Calculation
// Runs minimax search on background thread so the 60fps 3D UI never drops frames.
// ============================================================================

import { Chess } from 'chess.js';
import { findBestAiMove } from './chessAi.js';

self.onmessage = (e) => {
  const { fen, difficulty, aiColor, history } = e.data || {};
  try {
    const chess = new Chess(fen);
    const bestMove = findBestAiMove(chess, difficulty || 'medium', aiColor);
    self.postMessage({ success: true, move: bestMove });
  } catch (err) {
    self.postMessage({ success: false, error: err.message });
  }
};
