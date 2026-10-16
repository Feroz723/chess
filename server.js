// ============================================================================
// FILE: server.js (Node.js + Express + Neon Serverless PostgreSQL / Local Fallback)
// Secured with bcryptjs password hashing, JWT authentication, and rate limiting
// ============================================================================
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'wizards_cathedral_jwt_secret_vault_2026';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({
  origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(',').map(s => s.trim()),
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// In-Memory Rate Limiting Helper
const rateLimitBuckets = new Map();
function rateLimiter({ windowMs = 60000, maxRequests = 30 } = {}) {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const clientRecord = rateLimitBuckets.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > clientRecord.resetTime) {
      clientRecord.count = 1;
      clientRecord.resetTime = now + windowMs;
    } else {
      clientRecord.count++;
    }
    rateLimitBuckets.set(ip, clientRecord);

    if (clientRecord.count > maxRequests) {
      return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
    }
    next();
  };
}

// JWT Authentication Middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Session expired or invalid credentials.' });
    }
    req.user = decoded;
    next();
  });
}

// Optional Auth (passes user info if token provided, but doesn't hard block guest)
function optionalJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err) req.user = decoded;
      next();
    });
  } else {
    next();
  }
}

// Input sanitizer & validator helpers
function sanitizeUsername(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/\s+/g, '_');
}

function isValidUsername(username) {
  return /^[A-Za-z0-9_]{3,16}$/.test(username) && !username.includes('@');
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

// Pre-hashed default password for initial seed accounts
const SEED_PASS_HASH = bcrypt.hashSync('sanctum', 10);

// In-Memory / Local Storage Fallback when DATABASE_URL is not provided
const localVault = {
  users: [
    { username: 'Morgana_LeFay', house: 'Obsidian Sovereign', passkey: SEED_PASS_HASH, wins: 42, losses: 11, draws: 4, last_seen: Date.now() },
    { username: 'Cedric_Storm', house: 'Imperial Grandmaster', passkey: SEED_PASS_HASH, wins: 29, losses: 14, draws: 3, last_seen: Date.now() },
    { username: 'Aurelia_Crown', house: 'Sapphire Seer', passkey: SEED_PASS_HASH, wins: 19, losses: 8, draws: 5, last_seen: Date.now() - 600000 },
    { username: 'Balthazar_Rune', house: 'Emerald Warden', passkey: SEED_PASS_HASH, wins: 34, losses: 19, draws: 2, last_seen: Date.now() },
    { username: 'Seraphina_Vale', house: 'Alabaster Archmage', passkey: SEED_PASS_HASH, wins: 51, losses: 9, draws: 6, last_seen: Date.now() }
  ],
  friends: [
    { owner_username: 'Guest_Initiate', friend_username: 'Morgana_LeFay' },
    { owner_username: 'Guest_Initiate', friend_username: 'Cedric_Storm' }
  ],
  history: []
};

let sql = null;
let useNeon = false;

if (process.env.DATABASE_URL) {
  try {
    const { neon } = await import('@neondatabase/serverless');
    sql = neon(process.env.DATABASE_URL);
    useNeon = true;
    console.log('[Sanctum API] Initializing Neon PostgreSQL connection...');
  } catch (err) {
    console.warn('[Sanctum API] Could not connect to Neon PostgreSQL. Falling back to local vault.', err.message);
  }
}

// 1. Provision Neon PostgreSQL Tables with Indexes on Startup
async function initDatabase() {
  if (useNeon && sql) {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS wizard_users (
          username TEXT PRIMARY KEY,
          house TEXT DEFAULT 'Alabaster Archmage',
          passkey TEXT NOT NULL,
          wins INT DEFAULT 0,
          losses INT DEFAULT 0,
          draws INT DEFAULT 0,
          last_seen BIGINT DEFAULT 0
        );
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_wizard_users_username ON wizard_users (username);
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS wizard_friends (
          owner_username TEXT,
          friend_username TEXT,
          PRIMARY KEY (owner_username, friend_username)
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS wizard_match_history (
          id SERIAL PRIMARY KEY,
          player_username TEXT,
          opponent_name TEXT,
          result TEXT,
          moves_san TEXT,
          theme TEXT,
          played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log('[Sanctum API] Neon PostgreSQL Cathedral Schema & Indexes Ready.');
    } catch (err) {
      console.error('[Sanctum API] Error initializing Neon DB schema:', err.message);
      useNeon = false;
    }
  } else {
    console.log('[Sanctum API] Running with built-in Local Sanctum Vault.');
  }
}

initDatabase().catch(console.error);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 2. Sign Up Endpoint (Fails if username exists; never overwrites)
app.post('/api/auth/signup', rateLimiter({ windowMs: 60000, maxRequests: 20 }), async (req, res) => {
  try {
    const { username, house, passkey } = req.body;
    const cleanUser = sanitizeUsername(username);

    if (!isValidUsername(cleanUser)) {
      return res.status(400).json({ error: 'Username must be 3-16 characters and contain only letters, numbers, or underscore.' });
    }
    if (!isValidPassword(passkey)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters in length.' });
    }

    const cleanHouse = (house && typeof house === 'string' && house.length <= 40) ? house.trim() : 'Alabaster Archmage';
    const now = Date.now();
    const hashedPasskey = await bcrypt.hash(passkey, 10);

    if (useNeon && sql) {
      // Check if user already exists
      const existing = await sql`
        SELECT username FROM wizard_users WHERE LOWER(username) = LOWER(${cleanUser}) LIMIT 1;
      `;
      if (existing && existing.length > 0) {
        return res.status(409).json({ error: 'Commander handle is already registered. Please choose another or log in.' });
      }

      const rows = await sql`
        INSERT INTO wizard_users (username, house, passkey, last_seen)
        VALUES (${cleanUser}, ${cleanHouse}, ${hashedPasskey}, ${now})
        RETURNING username, house, wins, losses, draws, last_seen;
      `;
      const user = rows[0];
      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({ user, token });
    }

    // Local Vault fallback
    const existing = localVault.users.find(u => u.username.toLowerCase() === cleanUser.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'Commander handle is already registered. Please choose another or log in.' });
    }

    const newUser = {
      username: cleanUser,
      house: cleanHouse,
      passkey: hashedPasskey,
      wins: 0,
      losses: 0,
      draws: 0,
      last_seen: now
    };
    localVault.users.push(newUser);

    const token = jwt.sign({ username: cleanUser }, JWT_SECRET, { expiresIn: '7d' });
    const { passkey: _, ...safeUser } = newUser;
    return res.status(201).json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// 3. Log In Endpoint (Verifies bcrypt hash and issues JWT)
app.post('/api/auth/login', rateLimiter({ windowMs: 60000, maxRequests: 25 }), async (req, res) => {
  try {
    const { username, passkey } = req.body;
    const cleanUser = sanitizeUsername(username);

    if (!cleanUser || !passkey) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const now = Date.now();

    if (useNeon && sql) {
      const rows = await sql`
        SELECT username, house, passkey, wins, losses, draws, last_seen
        FROM wizard_users
        WHERE LOWER(username) = LOWER(${cleanUser}) LIMIT 1;
      `;
      if (!rows || rows.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(passkey, user.passkey);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }

      // Update last_seen
      await sql`
        UPDATE wizard_users SET last_seen = ${now} WHERE username = ${user.username};
      `;

      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '7d' });
      const { passkey: _, ...safeUser } = user;
      safeUser.last_seen = now;
      return res.json({ user: safeUser, token });
    }

    // Local Vault fallback
    const user = localVault.users.find(u => u.username.toLowerCase() === cleanUser.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    let passwordMatch = false;
    if (user.passkey.startsWith('$2a$') || user.passkey.startsWith('$2b$')) {
      passwordMatch = await bcrypt.compare(passkey, user.passkey);
    } else {
      // Legacy plaintext migration check
      passwordMatch = (passkey === user.passkey);
      if (passwordMatch) {
        user.passkey = await bcrypt.hash(passkey, 10);
      }
    }

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    user.last_seen = now;
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    const { passkey: _, ...safeUser } = user;
    return res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
});

// 4. Case-Insensitive Prefix Search for Wizards (Limit 10, excludes requester, no emails or sensitive data)
app.get('/api/friends/search', rateLimiter({ windowMs: 60000, maxRequests: 60 }), optionalJWT, async (req, res) => {
  try {
    const rawQuery = (req.query.q || '').trim();
    const requester = req.user?.username || (req.query.requester || '').trim();
    const now = Date.now();

    if (useNeon && sql) {
      const prefix = `${rawQuery}%`;
      const rows = requester
        ? await sql`
            SELECT username, house, wins, losses, draws, last_seen
            FROM wizard_users
            WHERE username ILIKE ${prefix} AND LOWER(username) != LOWER(${requester})
            ORDER BY last_seen DESC LIMIT 10;
          `
        : await sql`
            SELECT username, house, wins, losses, draws, last_seen
            FROM wizard_users
            WHERE username ILIKE ${prefix}
            ORDER BY last_seen DESC LIMIT 10;
          `;
      return res.json({
        users: rows.map(u => ({
          username: u.username,
          house: u.house,
          wins: u.wins || 0,
          losses: u.losses || 0,
          draws: u.draws || 0,
          online: now - Number(u.last_seen || 0) < 120000
        }))
      });
    }

    // Local Vault fallback
    const queryLower = rawQuery.toLowerCase();
    const requesterLower = requester.toLowerCase();

    const matched = localVault.users
      .filter(u => {
        if (requesterLower && u.username.toLowerCase() === requesterLower) return false;
        if (!queryLower) return true;
        return u.username.toLowerCase().startsWith(queryLower);
      })
      .slice(0, 10)
      .map(u => ({
        username: u.username,
        house: u.house,
        wins: u.wins || 0,
        losses: u.losses || 0,
        draws: u.draws || 0,
        online: now - Number(u.last_seen || 0) < 120000
      }));

    res.json({ users: matched });
  } catch (err) {
    res.status(500).json({ error: 'Search failed.' });
  }
});

// 5. Add Friend by Username
app.post('/api/friends/add', optionalJWT, async (req, res) => {
  try {
    const ownerUsername = sanitizeUsername(req.user?.username || req.body.ownerUsername);
    const friendUsername = sanitizeUsername(req.body.friendUsername);

    if (!ownerUsername || !friendUsername) {
      return res.status(400).json({ error: 'Both owner and friend handles are required.' });
    }
    if (ownerUsername.toLowerCase() === friendUsername.toLowerCase()) {
      return res.status(400).json({ error: 'Cannot add yourself as a friend.' });
    }

    if (useNeon && sql) {
      await sql`
        INSERT INTO wizard_friends (owner_username, friend_username)
        VALUES (${ownerUsername}, ${friendUsername})
        ON CONFLICT DO NOTHING;
      `;
      return res.json({ success: true });
    }

    // Local Vault fallback
    const exists = localVault.friends.some(
      f => f.owner_username.toLowerCase() === ownerUsername.toLowerCase() &&
           f.friend_username.toLowerCase() === friendUsername.toLowerCase()
    );
    if (!exists) {
      localVault.friends.push({ owner_username: ownerUsername, friend_username: friendUsername });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add friend.' });
  }
});

// 6. Record & Fetch Match History
app.post('/api/history', optionalJWT, async (req, res) => {
  try {
    const playerUsername = sanitizeUsername(req.user?.username || req.body.playerUsername);
    const opponentName = (req.body.opponentName || 'Challenger').substring(0, 40);
    const result = ['VICTORY', 'DEFEAT', 'DRAW'].includes(req.body.result) ? req.body.result : 'DRAW';
    const movesSan = typeof req.body.movesSan === 'string' ? req.body.movesSan.substring(0, 2000) : '';
    const theme = typeof req.body.theme === 'string' ? req.body.theme.substring(0, 40) : 'Sanctum Cathedral';

    if (!playerUsername) {
      return res.status(400).json({ error: 'Player handle is required to record battle chronicle.' });
    }

    if (useNeon && sql) {
      await sql`
        INSERT INTO wizard_match_history (player_username, opponent_name, result, moves_san, theme)
        VALUES (${playerUsername}, ${opponentName}, ${result}, ${movesSan}, ${theme});
      `;
      // Update win/loss/draw counter in database
      if (result === 'VICTORY') {
        await sql`UPDATE wizard_users SET wins = wins + 1 WHERE username = ${playerUsername};`;
      } else if (result === 'DEFEAT') {
        await sql`UPDATE wizard_users SET losses = losses + 1 WHERE username = ${playerUsername};`;
      } else {
        await sql`UPDATE wizard_users SET draws = draws + 1 WHERE username = ${playerUsername};`;
      }
      return res.json({ success: true });
    }

    // Local Vault fallback
    const now = new Date();
    localVault.history.unshift({
      playerUsername,
      opponentName,
      result,
      movesSan,
      theme,
      playedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    const user = localVault.users.find(u => u.username.toLowerCase() === playerUsername.toLowerCase());
    if (user) {
      if (result === 'VICTORY') user.wins = (user.wins || 0) + 1;
      else if (result === 'DEFEAT') user.losses = (user.losses || 0) + 1;
      else if (result === 'DRAW') user.draws = (user.draws || 0) + 1;
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record battle chronicle.' });
  }
});

app.get('/api/history', optionalJWT, async (req, res) => {
  try {
    const player = sanitizeUsername(req.user?.username || req.query.player);
    if (useNeon && sql) {
      const rows = player
        ? await sql`SELECT * FROM wizard_match_history WHERE LOWER(player_username) = LOWER(${player}) ORDER BY id DESC LIMIT 50;`
        : await sql`SELECT * FROM wizard_match_history ORDER BY id DESC LIMIT 50;`;
      return res.json({ history: rows });
    }

    const rows = player
      ? localVault.history.filter(h => h.playerUsername.toLowerCase() === player.toLowerCase())
      : localVault.history;
    res.json({ history: rows.slice(0, 50) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load chronicles.' });
  }
});

// Serve frontend dist build if present
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

export default app;

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`[Sanctum API] Listening on port ${PORT}`);
  });
}
