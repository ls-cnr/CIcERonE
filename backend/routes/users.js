const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const authenticateToken = require('../middleware/authenticateToken');

// Configurazione del pool di connessioni MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET route per ottenere il profilo dell'utente
router.get('/profile', authenticateToken, async (req, res) => {
  console.log('Richiesta profilo ricevuta');
  console.log('User ID dalla richiesta:', req.user.id);
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email FROM users WHERE id = ?',
      [req.user.id]
    );

    console.log('Risultato query:', rows);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Utente non trovato' });
    }
  } catch (error) {
    console.error('Errore nel recupero del profilo utente:', error);
    res.status(500).json({ message: 'Errore del server nel recupero del profilo utente' });
  }
});

module.exports = router;
