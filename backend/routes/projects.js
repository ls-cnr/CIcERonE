const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

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
    res.status(500).json({
      message: 'Errore del server nel recupero dei progetti',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
    res.status(500).json({
      message: 'Errore del server nel recupero del progetto',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT route per aggiornare un progetto specifico
router.put('/:id', authenticateToken, async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.id;
  const { title, description } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE projects SET title = ?, description = ? WHERE id = ? AND user_id = ?',
      [title, description, projectId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Progetto non trovato o non autorizzato' });
    }

    res.json({ message: 'Progetto aggiornato con successo' });
  } catch (error) {
    console.error('Errore nell\'aggiornamento del progetto:', error);
    res.status(500).json({ message: 'Errore del server nell\'aggiornamento del progetto' });
  }
});

// POST route per creare un nuovo progetto
router.post('/', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;
  const mental_space_lattice = "Empty mental space"; // Valore predefinito
  const analysis = "Analysis not yet available"; // Nuovo valore predefinito
  const generate_analysis = false; // Nuovo valore predefinito

  try {
    const [result] = await pool.query(
      'INSERT INTO projects (user_id, title, description, mental_space_lattice, analysis, generate_analysis) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, title, description, mental_space_lattice, analysis, generate_analysis]
    );

    res.status(201).json({
      message: 'Progetto creato con successo',
      projectId: result.insertId
    });
  } catch (error) {
    console.error('Errore nella creazione del progetto:', error);
    res.status(500).json({
      message: 'Errore del server nella creazione del progetto',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
    res.status(500).json({
      message: 'Errore del server nell\'eliminazione del progetto',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;