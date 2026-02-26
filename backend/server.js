const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({ origin: '*' }));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()').then(() => console.log('PostgreSQL OK')).catch(e => console.error('DB error', e));

// Multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user;
    next();
  });
};

// Test
app.get('/api/test', (req, res) => res.json({ status: 'Backend OK' }));

// Register
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'Champs manquants' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashed]);
    res.status(201).json({ message: 'Compte créé' });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ message: 'Email/pseudo déjà utilisé' });
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, xp: user.xp, level: user.level }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Connecté', token, user: { id: user.id, username: user.username, xp: user.xp, level: user.level } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Summarize
app.post('/api/summarize', authenticateToken, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Aucun PDF' });

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text || '';

    if (text.length < 10) return res.status(400).json({ message: 'PDF vide' });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(`Résume en français, clair, structuré, max 800 mots :\n\n${text.substring(0, 30000)}`);
    const summary = result.response.text();

    const dbRes = await pool.query(
      'INSERT INTO summaries (user_id, title, original_text, summary_text) VALUES ($1, $2, $3, $4) RETURNING id',
      [req.user.id, req.file.originalname || 'Cours', text, summary]
    );

    fs.unlinkSync(req.file.path);
    res.json({ success: true, summary_id: dbRes.rows[0].id, summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur résumé', details: error.message });
  }
});

// Les autres routes (generate-quiz, save-quiz-result, classement, youtube-search) restent les mêmes que dans le code précédent

app.listen(PORT, () => {
  console.log(`Serveur sur port ${PORT}`);
});