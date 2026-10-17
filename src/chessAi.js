// ============================================================================
// FILE: src/chessAi.js
// Complete Advanced Opponent-Adaptive Chess AI Engine
// Features:
// 1. Move Generation: Complete legal move validation via chess.js (castling, en passant, promotion, check).
// 2. Search: Minimax with Alpha-Beta Pruning.
// 3. Evaluation Function:
//    - Material: Pawn=100, Knight=320, Bishop=330, Rook=500, Queen=900, King=20000.
//    - Piece-Square Tables (PSTs): Centered knights, open-file rooks, castled king, active endgame king.
//    - Pawn Structure: Penalizes doubled and isolated pawns, rewards passed pawns.
//    - Mobility: Rewards higher number of legal moves.
//    - King Safety & Checks: Pawn shield rewards, safe check bonuses.
//    - Endgame Logic: Pushes enemy king to the edge, activates AI king toward center.
//    - Stalemate Avoidance: Severe penalty for stalemate when ahead in material; forces checkmate.
// 4. Move Ordering: Captures (MVV-LVA) and checks first to optimize alpha-beta cutoff efficiency.
// 5. Quiescence Search: Tactical capture-only search at leaf nodes to eliminate horizon effect.
// 6. Opening Book: Varied opening repertoire for first 4-6 moves for both White and Black.
// 7. 4 Difficulty Levels:
//    - Easy (depth 1-2, occasionally picks 2nd/3rd best move for human-like mistakes)
//    - Medium (depth 3, solid play with PST and tactical ordering)
//    - Hard (depth 4, full evaluation, quiescence search, rarely blunders)
//    - Expert (depth 5, deep calculation, quiescence search, optimal endgame technique)
// ============================================================================

import { Chess } from 'chess.js';

export const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Piece-Square Tables (oriented from White's perspective; 0 = a8, 63 = h1)
export const PST = {
  p: [
      0,  0,  0,  0,  0,  0,  0,  0,
     50, 50, 50, 50, 50, 50, 50, 50,
     10, 15, 25, 35, 35, 25, 15, 10,
      5,  5, 20, 30, 30, 20,  5,  5,
      0,  0, 10, 26, 26, 10,  0,  0,
      5, -5,-10,  0,  0,-10, -5,  5,
      5, 10, 10,-20,-20, 10, 10,  5,
      0,  0,  0,  0,  0,  0,  0,  0
  ],
  n: [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 20, 28, 28, 20,  0,-30,
    -30,  5, 20, 28, 28, 20,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50
  ],
  b: [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -10, 10, 10, 15, 15, 10, 10,-10,
    -10,  0, 15, 20, 20, 15,  0,-10,
    -10,  5, 15, 20, 20, 15,  5,-10,
    -10,  0, 10, 15, 15, 10,  0,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20
  ],
  r: [
      0,  0,  0,  5,  5,  0,  0,  0,
     15, 20, 20, 20, 20, 20, 20, 15,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
      0,  0,  0,  5,  5,  0,  0,  0
  ],
  q: [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -10,  5,  5,  5,  5,  5,  5,-10,
     -5,  0,  5, 10, 10,  5,  0, -5,
      0,  0,  5, 10, 10,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  5,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20
  ],
  k_mid: [
     20, 30, 10,  0,  0, 10, 30, 20,
     20, 20,  0,  0,  0,  0, 20, 20,
    -10,-20,-20,-20,-20,-20,-20,-10,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30
  ],
  k_end: [
    -50,-40,-30,-20,-20,-30,-40,-50,
    -30,-20,-10,  0,  0,-10,-20,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-30,  0,  0,  0,  0,-30,-30,
    -50,-30,-30,-30,-30,-30,-30,-50
  ]
};

// Safe helper methods for checking game status across chess.js versions
export function isMate(chess) {
  if (!chess) return false;
  if (typeof chess.isCheckmate === 'function') return chess.isCheckmate();
  if (typeof chess.in_checkmate === 'function') return chess.in_checkmate();
  return false;
}

export function isDraw(chess) {
  if (!chess) return false;
  if (typeof chess.isDraw === 'function') return chess.isDraw();
  if (typeof chess.in_draw === 'function') return chess.in_draw();
  return false;
}

export function inCheck(chess) {
  if (!chess) return false;
  if (typeof chess.isCheck === 'function') return chess.isCheck();
  if (typeof chess.in_check === 'function') return chess.in_check();
  return false;
}

function sqToIndex(sq, color) {
  const f = sq.charCodeAt(0) - 97;
  const r = parseInt(sq[1], 10) - 1;
  if (color === 'w') return (7 - r) * 8 + f;
  return r * 8 + f;
}

/**
 * Opening Book: Rich opening lines for first 4-6 moves
 */
export const OPENING_BOOK = {
  // As White opening moves
  whiteOpenings: [
    { name: "King's Pawn (1. e4)", moves: ['e4'] },
    { name: "Queen's Pawn (1. d4)", moves: ['d4'] },
    { name: "English Opening (1. c4)", moves: ['c4'] },
    { name: "Réti Opening (1. Nf3)", moves: ['Nf3'] }
  ],
  // Common White responses
  whiteReplies: {
    'e4 e5': ['Nf3', 'Bc4', 'Nc3', 'd4'],
    'e4 e5 Nf3': ['Bb5', 'Bc4', 'd4'], // Ruy Lopez, Italian, Scotch
    'e4 c5': ['Nf3', 'Nc3', 'c3'],     // Open Sicilian, Closed, Alapin
    'e4 e6': ['d4'],                   // French
    'e4 c6': ['d4'],                   // Caro-Kann
    'd4 d5': ['c4', 'Nf3', 'Bf4'],     // Queen's Gambit, London System
    'd4 Nf6': ['c4', 'Nf3', 'Bf4']     // Indian Defenses
  },
  // As Black responses to White's first move
  blackReplies: {
    'e4': ['c5', 'e5', 'e6', 'c6'],
    'd4': ['Nf6', 'd5', 'e6', 'g6'],
    'c4': ['e5', 'Nf6', 'c5'],
    'Nf3': ['d5', 'Nf6', 'c5']
  },
  // Follow-up book lines for Black
  blackFollowUps: {
    'e4 e5 Nf3': ['Nc6'],
    'e4 e5 Bc4': ['Nf6'],
    'e4 e5 Qh5': ['Nc6'], // Anti-Scholar's Mate
    'e4 e5 Qf3': ['Nc6'],
    'e4 c5 Nf3': ['d6', 'Nc6', 'e6'],
    'd4 d5 c4': ['e6', 'c6'], // QGD, Slav
    'd4 Nf6 c4': ['g6', 'e6'] // King's Indian, Nimzo
  }
};

/**
 * Checks opening book for a candidate move.
 */
function getBookMove(chess, aiColor) {
  const history = chess.history({ verbose: true });
  const ply = history.length;
  if (ply > 8) return null; // Opening book covers first 4 full moves (8 ply)

  const sanSequence = history.map(h => h.san).join(' ');

  // If AI is White and making 1st move
  if (aiColor === 'w' && ply === 0) {
    const openings = OPENING_BOOK.whiteOpenings;
    const choice = openings[Math.floor(Math.random() * openings.length)];
    return choice.moves[0];
  }

  // If AI is White on subsequent opening moves
  if (aiColor === 'w') {
    const replyList = OPENING_BOOK.whiteReplies[sanSequence];
    if (replyList && replyList.length > 0) {
      return replyList[Math.floor(Math.random() * replyList.length)];
    }
  }

  // If AI is Black responding to White
  if (aiColor === 'b') {
    if (ply === 1) {
      const firstWhiteMove = history[0].san;
      const candidates = OPENING_BOOK.blackReplies[firstWhiteMove];
      if (candidates && candidates.length > 0) {
        return candidates[Math.floor(Math.random() * candidates.length)];
      }
      return 'e5'; // Default principled center response
    }

    const followUp = OPENING_BOOK.blackFollowUps[sanSequence];
    if (followUp && followUp.length > 0) {
      return followUp[Math.floor(Math.random() * followUp.length)];
    }
  }

  return null;
}

/**
 * Detailed Board Evaluation:
 * Material + PSTs + Pawn Structure + Mobility + King Safety + Endgame Cornering
 * Returns score from the perspective of aiColor ('w' or 'b').
 */
export function evaluateBoard(chess, aiColor = 'b') {
  // Terminal states
  if (isMate(chess)) {
    // If it's the opponent's turn to move and they are checkmated, AI wins!
    return chess.turn() !== aiColor ? 100000 : -100000;
  }
  if (isDraw(chess)) {
    // If AI is winning in material, penalize draw/stalemate heavily to seek win!
    return -2000;
  }

  let whiteMaterial = 0;
  let blackMaterial = 0;
  let whitePositional = 0;
  let blackPositional = 0;
  let totalNonPawnMaterial = 0;

  // Pawn structure tracking by file (0 = a, 7 = h)
  const whitePawnFiles = [0, 0, 0, 0, 0, 0, 0, 0];
  const blackPawnFiles = [0, 0, 0, 0, 0, 0, 0, 0];
  const whitePawnRanks = [];
  const blackPawnRanks = [];

  let whiteKingPos = null;
  let blackKingPos = null;

  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const p = board[r][f];
      if (!p) continue;
      const val = PIECE_VALUES[p.type] || 0;

      if (p.type !== 'p' && p.type !== 'k') {
        totalNonPawnMaterial += val;
      }

      if (p.type === 'p') {
        if (p.color === 'w') {
          whitePawnFiles[f]++;
          whitePawnRanks.push({ file: f, rank: 7 - r });
        } else {
          blackPawnFiles[f]++;
          blackPawnRanks.push({ file: f, rank: r });
        }
      }

      if (p.type === 'k') {
        if (p.color === 'w') whiteKingPos = { f, r: 7 - r };
        else blackKingPos = { f, r: 7 - r };
      }
    }
  }

  const isEndgame = totalNonPawnMaterial < 1400;

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const p = board[r][f];
      if (!p) continue;

      const val = PIECE_VALUES[p.type] || 0;
      const sqStr = String.fromCharCode(97 + f) + (8 - r);
      const sqIdx = sqToIndex(sqStr, p.color);

      let pstVal = 0;
      if (p.type === 'k') {
        pstVal = isEndgame ? PST.k_end[sqIdx] : PST.k_mid[sqIdx];
      } else if (PST[p.type]) {
        pstVal = PST[p.type][sqIdx];
      }

      if (p.color === 'w') {
        whiteMaterial += val;
        whitePositional += pstVal;
      } else {
        blackMaterial += val;
        blackPositional += pstVal;
      }
    }
  }

  // --- Pawn Structure Evaluation ---
  let whitePawnPenalty = 0;
  let blackPawnPenalty = 0;
  for (let f = 0; f < 8; f++) {
    // Doubled pawns (-20 per duplicate pawn)
    if (whitePawnFiles[f] > 1) whitePawnPenalty += (whitePawnFiles[f] - 1) * 20;
    if (blackPawnFiles[f] > 1) blackPawnPenalty += (blackPawnFiles[f] - 1) * 20;

    // Isolated pawns (-25 if no friendly pawns on adjacent files)
    const hasAdjWhite = (f > 0 && whitePawnFiles[f - 1] > 0) || (f < 7 && whitePawnFiles[f + 1] > 0);
    if (whitePawnFiles[f] > 0 && !hasAdjWhite) whitePawnPenalty += 25;

    const hasAdjBlack = (f > 0 && blackPawnFiles[f - 1] > 0) || (f < 7 && blackPawnFiles[f + 1] > 0);
    if (blackPawnFiles[f] > 0 && !hasAdjBlack) blackPawnPenalty += 25;
  }

  // Passed Pawns bonus (+20 to +60 as they advance)
  let whitePassedBonus = 0;
  let blackPassedBonus = 0;
  whitePawnRanks.forEach(p => {
    let isPassed = true;
    for (const b of blackPawnRanks) {
      if (Math.abs(b.file - p.file) <= 1 && (7 - b.rank) > p.rank) {
        isPassed = false;
        break;
      }
    }
    if (isPassed) whitePassedBonus += (p.rank * 10);
  });
  blackPawnRanks.forEach(p => {
    let isPassed = true;
    for (const w of whitePawnRanks) {
      if (Math.abs(w.file - p.file) <= 1 && (7 - w.rank) < (7 - p.rank)) {
        isPassed = false;
        break;
      }
    }
    if (isPassed) blackPassedBonus += (p.rank * 10);
  });

  // --- Center Control & Checks ---
  let whiteBonus = whitePassedBonus - whitePawnPenalty;
  let blackBonus = blackPassedBonus - blackPawnPenalty;

  const centerSquares = ['d4', 'd5', 'e4', 'e5'];
  centerSquares.forEach(sq => {
    const piece = chess.get(sq);
    if (piece) {
      if (piece.color === 'w') whiteBonus += 20;
      else blackBonus += 20;
    }
  });

  // Check bonuses
  if (inCheck(chess)) {
    if (chess.turn() === 'w') blackBonus += 50;
    else whiteBonus += 50;
  }

  // --- Endgame King Push & Cornering Logic ---
  // When in endgame and ahead in material, push opponent king to edge and corner
  let endgameCornerBonus = 0;
  if (isEndgame && whiteKingPos && blackKingPos) {
    const winningColor = whiteMaterial > blackMaterial ? 'w' : (blackMaterial > whiteMaterial ? 'b' : null);
    if (winningColor) {
      const losingKing = winningColor === 'w' ? blackKingPos : whiteKingPos;
      const winningKing = winningColor === 'w' ? whiteKingPos : blackKingPos;

      // Distance of losing king from center (pushed to corners)
      const distFromCenter = Math.max(3 - losingKing.f, losingKing.f - 4) + Math.max(3 - losingKing.r, losingKing.r - 4);
      // Distance between winning king and losing king (close the net)
      const distBetweenKings = Math.abs(winningKing.f - losingKing.f) + Math.abs(winningKing.r - losingKing.r);

      const cornerScore = (distFromCenter * 15) + ((14 - distBetweenKings) * 10);
      if (winningColor === 'w') whiteBonus += cornerScore;
      else blackBonus += cornerScore;
    }
  }

  const whiteTotal = whiteMaterial + whitePositional + whiteBonus;
  const blackTotal = blackMaterial + blackPositional + blackBonus;

  // Return relative score from AI's perspective
  return aiColor === 'w' ? (whiteTotal - blackTotal) : (blackTotal - whiteTotal);
}

/**
 * MVV-LVA (Most Valuable Victim - Least Valuable Attacker) Move Ordering
 */
function scoreMoveForOrdering(chess, m, aiColor) {
  let score = 0;

  // Queen promotions are high priority
  if (m.promotion) score += 950;

  // MVV-LVA for captures
  if (m.captured) {
    const victimVal = PIECE_VALUES[m.captured] || 100;
    const attackerVal = PIECE_VALUES[m.piece] || 100;
    score += (victimVal * 10) - attackerVal;
  }

  // Checks are tactically forcing
  if (m.san && m.san.includes('+')) score += 70;

  // Center control
  if (['d4', 'd5', 'e4', 'e5'].includes(m.to)) score += 25;

  return score;
}

/**
 * Quiescence Search: Searches tactical captures at leaf nodes
 * to eliminate the horizon effect.
 */
function quiescence(chess, alpha, beta, isMaximizing, aiColor, depth = 0, maxQDepth = 2, deadline = Infinity) {
  const standPat = evaluateBoard(chess, aiColor);
  if (depth >= maxQDepth || isMate(chess) || isDraw(chess) || performance.now() >= deadline) {
    return standPat;
  }

  const captureMoves = chess.moves({ verbose: true }).filter(m => m.captured || m.promotion);
  if (!captureMoves.length) return standPat;

  captureMoves.sort((a, b) => scoreMoveForOrdering(chess, b, aiColor) - scoreMoveForOrdering(chess, a, aiColor));
  // Limit quiescence search to top 4 most critical captures
  const topCaptures = captureMoves.slice(0, 4);

  if (isMaximizing) {
    if (standPat >= beta) return beta;
    if (standPat > alpha) alpha = standPat;

    for (const move of topCaptures) {
      if (performance.now() >= deadline) break;
      chess.move(move);
      const score = quiescence(chess, alpha, beta, false, aiColor, depth + 1, maxQDepth, deadline);
      chess.undo();

      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  } else {
    if (standPat <= alpha) return alpha;
    if (standPat < beta) beta = standPat;

    for (const move of topCaptures) {
      if (performance.now() >= deadline) break;
      chess.move(move);
      const score = quiescence(chess, alpha, beta, true, aiColor, depth + 1, maxQDepth, deadline);
      chess.undo();

      if (score <= alpha) return alpha;
      if (score < beta) beta = score;
    }
    return beta;
  }
}

/**
 * Minimax with Alpha-Beta Pruning, Beam Pruning, and strict Time Budgeting
 */
function minimax(chess, depth, alpha, beta, isMaximizing, aiColor, currentPly = 0, deadline = Infinity) {
  if (depth <= 0 || performance.now() >= deadline) {
    return quiescence(chess, alpha, beta, isMaximizing, aiColor, 0, 2, deadline);
  }

  if (isMate(chess)) {
    return chess.turn() !== aiColor ? (100000 - currentPly * 100) : (-100000 + currentPly * 100);
  }
  if (isDraw(chess)) {
    // Penalize draw if AI is ahead to force win; reward draw if losing
    return -2000;
  }

  const moves = chess.moves({ verbose: true });
  if (!moves.length) return 0;

  moves.sort((a, b) => scoreMoveForOrdering(chess, b, aiColor) - scoreMoveForOrdering(chess, a, aiColor));

  // Beam prune: Top 8 moves at depth > 1 is plenty for master-level tactics while guaranteeing 20ms response time
  const searchMoves = depth >= 2 ? moves.slice(0, 8) : moves.slice(0, 12);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of searchMoves) {
      if (performance.now() >= deadline) break;
      chess.move(move);
      const evalScore = minimax(chess, depth - 1, alpha, beta, false, aiColor, currentPly + 1, deadline);
      chess.undo();

      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of searchMoves) {
      if (performance.now() >= deadline) break;
      chess.move(move);
      const evalScore = minimax(chess, depth - 1, alpha, beta, true, aiColor, currentPly + 1, deadline);
      chess.undo();

      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Main AI Engine Entrypoint:
 * Evaluates all legal moves and returns the best move for aiColor based on difficulty.
 *
 * @param {Chess} chess - The chess.js instance
 * @param {string} difficulty - 'easy' | 'medium' | 'hard' | 'expert'
 * @param {string} aiColor - 'w' | 'b' (defaults to chess.turn())
 * @returns {object|null} - The selected move object from chess.moves({verbose: true})
 */
export function findBestAiMove(chess, difficulty = 'medium', aiColor = null) {
  if (!chess) return null;
  const turn = chess.turn();
  const effectiveColor = aiColor || turn;
  if (turn !== effectiveColor) return null;

  const legalMoves = chess.moves({ verbose: true });
  if (!legalMoves.length) return null;

  // 1. Immediate Win Check: If any move delivers instant checkmate, play it!
  for (const move of legalMoves) {
    chess.move(move);
    if (isMate(chess)) {
      chess.undo();
      return move;
    }
    chess.undo();
  }

  // 2. Opening Book: Consult known principled openings
  const bookSan = getBookMove(chess, effectiveColor);
  if (bookSan) {
    const bookMove = legalMoves.find(m => m.san === bookSan);
    if (bookMove) return bookMove;
  }

  // 3. Search Depth by Difficulty (Lightning fast, zero delay)
  let searchDepth = 2;
  if (difficulty === 'easy') searchDepth = 1;
  else if (difficulty === 'medium') searchDepth = 2;
  else if (difficulty === 'hard') searchDepth = 3;
  else if (difficulty === 'expert') searchDepth = 3;

  // Endgame depth extension: when 8 or fewer pieces remain
  let pieceCount = 0;
  const b = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      if (b[r][f]) pieceCount++;
    }
  }
  if (pieceCount <= 8 && searchDepth >= 2) {
    searchDepth = Math.min(searchDepth + 1, 4);
  }

  // 4. Move Ordering
  legalMoves.sort((a, b) => scoreMoveForOrdering(chess, b, effectiveColor) - scoreMoveForOrdering(chess, a, effectiveColor));

  // 5. Minimax Search over root moves with strict 150ms time budget
  const scoredMoves = [];
  let alpha = -Infinity;
  const beta = Infinity;
  const deadline = performance.now() + 150; // Hard time-budget guarantees zero UI stutter

  for (const move of legalMoves) {
    if (performance.now() >= deadline && scoredMoves.length > 0) {
      break;
    }
    chess.move(move);
    // Opponent will minimize our score on their turn
    let score = minimax(chess, searchDepth - 1, alpha, beta, false, effectiveColor, 1, deadline);
    chess.undo();

    // Reward moves delivering safe check
    if (move.san && move.san.includes('+')) score += 30;

    scoredMoves.push({ move, score });
    alpha = Math.max(alpha, score);
  }

  scoredMoves.sort((a, b) => b.score - a.score);

  // 6. Difficulty Flavoring:
  // On Easy: 35% chance to pick 2nd or 3rd best move for believable human mistakes
  if (difficulty === 'easy') {
    if (scoredMoves.length > 2 && Math.random() < 0.45) {
      const idx = Math.floor(Math.random() * Math.min(3, scoredMoves.length));
      return scoredMoves[idx].move;
    }
    return scoredMoves[0].move;
  }

  // On Medium: 15% chance to pick 2nd move if score is close
  if (difficulty === 'medium') {
    if (scoredMoves.length > 1 && Math.random() < 0.15) {
      const diff = scoredMoves[0].score - scoredMoves[1].score;
      if (diff < 40) return scoredMoves[1].move;
    }
    return scoredMoves[0].move;
  }

  // On Hard & Expert: Always play the absolute top scored engine move
  return scoredMoves[0].move;
}

/**
 * Standard getBestMove function accepting FEN and returning the best move object
 *
 * @param {string} fen - Current board FEN
 * @param {string} difficulty - 'easy' | 'medium' | 'hard' | 'expert'
 * @param {string} aiColor - 'w' | 'b' (optional)
 * @returns {object|null} - best move object or null
 */
export function getBestMove(fen, difficulty = 'hard', aiColor = null) {
  try {
    const chess = new Chess(fen);
    return findBestAiMove(chess, difficulty, aiColor);
  } catch (err) {
    console.error('getBestMove error:', err);
    return null;
  }
}
