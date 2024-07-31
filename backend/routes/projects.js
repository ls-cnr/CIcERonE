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

// GET route per recuperare un progetto specifico
router.get('/:id', authenticateToken, async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?',
      [projectId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Progetto non trovato' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Errore nel recupero del progetto:', error);
    res.status(500).json({ message: 'Errore del server nel recupero del progetto' });
  }
});


// POST route per creare un nuovo progetto
router.post('/', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;
  const mental_space_lattice = "Empty mental space"; // Valore predefinito

  try {
    const [result] = await pool.query(
      'INSERT INTO projects (user_id, title, description, mental_space_lattice) VALUES (?, ?, ?, ?)',
      [userId, title, description, mental_space_lattice]
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

// DELETE route per eliminare un progetto
router.delete('/:id', authenticateToken, async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      'DELETE FROM projects WHERE id = ? AND user_id = ?',
      [projectId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Progetto non trovato o non autorizzato' });
    }

    res.json({ message: 'Progetto eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione del progetto:', error);
    res.status(500).json({ message: 'Errore del server nell\'eliminazione del progetto' });
  }
});

module.exports = router;
