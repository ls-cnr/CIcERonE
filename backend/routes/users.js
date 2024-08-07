const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

// GET route per ottenere il profilo dell'utente
router.get('/profile', authenticateToken, async (req, res) => {
  //console.log('Richiesta profilo ricevuta');
  //console.log('User ID dalla richiesta:', req.user.id);
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email FROM users WHERE id = ?',
      [req.user.id]
    );

    //console.log('Risultato query:', rows);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Utente non trovato' });
    }
  } catch (error) {
    console.error('Errore nel recupero del profilo utente:', error);
    res.status(500).json({
      message: 'Errore del server nel recupero del profilo utente',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;