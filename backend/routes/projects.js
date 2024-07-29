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

// GET route per recuperare tutti i progetti di un utente
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects WHERE user_id = ?',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Errore nel recupero dei progetti:', error);
    res.status(500).json({ message: 'Errore del server nel recupero dei progetti' });
  }
});

// POST route per creare un nuovo progetto
router.post('/', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      'INSERT INTO projects (user_id, title, description) VALUES (?, ?, ?)',
      [userId, title, description]
    );

    res.status(201).json({
      message: 'Progetto creato con successo',
      projectId: result.insertId
    });
  } catch (error) {
    console.error('Errore nella creazione del progetto:', error);
    res.status(500).json({ message: 'Errore del server nella creazione del progetto' });
  }
});

module.exports = router;
