const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authenticateToken = require('../middleware/authenticateToken');
const fs = require('fs').promises;
const path = require('path');

async function readConfig() {
  const configPath = path.join(__dirname, '..', '..', 'model.config.json');
  const configFile = await fs.readFile(configPath, 'utf8');
  return JSON.parse(configFile);
}

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



//GET route per recuperare un progetto specifico
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
  const { title, description, chat_model_id, llm_model_id, api_key } = req.body;

  try {
    const query = `
      UPDATE projects 
      SET title = ?, description = ?, chat_model_id = ?, llm_model_id = ?, api_key = ?
      WHERE id = ? AND user_id = ?
    `;

    const [result] = await pool.query(query, [
      title,
      description,
      chat_model_id,
      llm_model_id,
      api_key,
      projectId,
      userId
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found or not authorized' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project', details: error.message });
  }
});


// // PUT route per aggiornare un progetto specifico
// router.put('/:id', authenticateToken, async (req, res) => {
//   const projectId = req.params.id;
//   const userId = req.user.id;
//   const { title, description, analysis, generate_analysis } = req.body;
//
//   try {
//     let updateFields = [];
//     let updateValues = [];
//
//     if (title !== undefined && title !== null && title.trim() !== '') {
//       updateFields.push('title = ?');
//       updateValues.push(title);
//     }
//
//     if (description !== undefined && description !== null) {
//       updateFields.push('description = ?');
//       updateValues.push(description);
//     }
//
//     if (analysis !== undefined) {
//       updateFields.push('analysis = ?');
//       updateValues.push(analysis);
//     }
//
//     if (generate_analysis !== undefined) {
//       updateFields.push('generate_analysis = ?');
//       updateValues.push(generate_analysis);
//     }
//
//     if (updateFields.length === 0) {
//       return res.status(400).json({ message: 'No valid fields to update' });
//     }
//
//     const query = `UPDATE projects SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`;
//     updateValues.push(projectId, userId);
//
//     const [result] = await pool.query(query, updateValues);
//
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Project not found or not authorized' });
//     }
//
//     res.json({ message: 'Project updated successfully' });
//   } catch (error) {
//     console.error('Error updating project:', error);
//     res.status(500).json({ message: 'Error updating project', details: error.message });
//   }
// });

// POST route per creare un nuovo progetto
router.post('/', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;
  const mental_space_lattice = "Empty mental space";
  const analysis = "Analysis not yet available";
  const generate_analysis = false;

  try {
    const config = await readConfig();
    const defaultChatModel = config.chatModels.find(model => model.isDefault);
    const defaultLLMModel = defaultChatModel.llmModels[0];

    const chat_model_id = defaultChatModel.id;
    const llm_model_id = defaultLLMModel.id;
    const api_key = defaultChatModel.requiresAPIKey ? null : 'NO_KEY';

    const [result] = await pool.query(
      'INSERT INTO projects (user_id, title, description, mental_space_lattice, analysis, generate_analysis, chat_model_id, llm_model_id, api_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, title, description, mental_space_lattice, analysis, generate_analysis, chat_model_id, llm_model_id, api_key]
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