const express = require('express');
const cors = require('cors');
const initDatabase = require('./dbInit');
const authRoutes = require('./routes/auth');
const projectsRoutes = require('./routes/projects');
const usersRoutes = require('./routes/users');
const axios = require('axios');
const authenticateToken = require('./middleware/authenticateToken');
const { testConnection } = require('./db');
const listEndpoints = require('express-list-endpoints');

const fs = require('fs').promises;

const path = require('path');
//const fs = require('fs');
const dotenv = require('dotenv');


//console.log('Current directory:', __dirname);
//console.log('Parent directory contents:', fs.readdirSync(path.resolve(__dirname, '..')));

// Carica le variabili d'ambiente dal file .env nella root del progetto
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Aggiungi questo log per debug
// console.log('Loaded environment variables:', {
//   DB_HOST: process.env.DB_HOST,
//   DB_USER: process.env.DB_USER,
//   DB_NAME: process.env.DB_NAME,
//   // Non loggare la password per motivi di sicurezza
// });


const app = express();
const NODE_PORT = process.env.PORT || 3000;
const FLASK_PORT = process.env.FLASK_PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/debug/routes', (req, res) => {
  const routes = listEndpoints(app);
  res.json(routes);
});


async function checkFlaskHealth() {
  try {
    const response = await axios.get(`http://127.0.0.1:${FLASK_PORT}/health`);
    if (response.data.status === 'ok') {
      console.log('Flask server is up and running');
      return true;
    } else {
      console.error('Flask server health check failed');
      return false;
    }
  } catch (error) {
    console.error('Error checking Flask server health:', error.message);
    return false;
  }
}

async function startServer() {
  try {
    await testConnection();
    // ... resto del codice per avviare il server
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}


async function startServer() {
  try {
    // Test della connessione al database
    await testConnection();
    console.log('Database connection successful');

    // Controllo dello stato del server Flask
    const isFlaskHealthy = await checkFlaskHealth();
    if (!isFlaskHealthy) {
      console.error('Flask server is not healthy. Terminating Node.js server.');
      process.exit(1);
    }

    // Inizializzazione del database
    console.log('Checking database status...');
    const isNewDatabase = await initDatabase();
    if (isNewDatabase) {
      console.log('Database was newly initialized');
    } else {
      console.log('Connected to existing database');
    }

    // Avvio del server Node.js
    app.listen(NODE_PORT, () => {
      console.log(`Node.js server running on port ${NODE_PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

app.use('/auth', authRoutes);
app.use('/projects', projectsRoutes);
app.use('/user', usersRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome! Database is accessible and initialized.' });
});

app.get('/flask-health', async (req, res) => {
  const isHealthy = await checkFlaskHealth();
  if (isHealthy) {
    res.json({ status: 'ok', message: 'Flask server is healthy' });
  } else {
    res.status(500).json({ error: 'Flask server is not responding' });
  }
});

app.post('/projects/:id/update-mental-space', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { source, interview } = req.body;

    if (!source || !interview) {
      return res.status(400).json({ success: false, error: 'Source and interview data are required' });
    }

    const response = await axios.post(`http://127.0.0.1:${FLASK_PORT}/update_mental_space`, {
      project_id: projectId,
      source,
      interview
    });

    if (response.data.success) {
      res.json({ success: true, message: 'Mental space lattice updated successfully' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update mental space lattice' });
    }
  } catch (error) {
    console.error('Error updating mental space lattice:', error);

    // Gestione specifica dell'errore di connessione
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'Unable to connect to the Flask server. The service may be down or unreachable.'
      });
    }

    // Gestione generica degli errori
    res.status(500).json({
      success: false,
      error: 'An error occurred while updating the mental space lattice',
      details: error.message
    });
  }
});

app.post('/projects/:id/query-implicit-knowledge', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;

    const response = await axios.post(`http://127.0.0.1:${FLASK_PORT}/query_implicit_knowledge`, {
      project_id: projectId
    });

    if (response.data && response.data.response) {
      res.json({
        success: true,
        message: 'Analysis generated successfully',
        data: response.data.response
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to generate analysis'
      });
    }
  } catch (error) {
    console.error('Error querying implicit knowledge:', error);

    // Gestione specifica dell'errore di connessione
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'Unable to connect to the Flask server. The service may be down or unreachable.'
      });
    }

    // Gestione generica degli errori
    res.status(500).json({
      success: false,
      error: 'An error occurred while generating the analysis',
      details: error.message
    });
  }
});

// GET route per ottenere tutti i modelli chat e LLM associati

app.get('/chat-llm-models', authenticateToken, async (req, res) => {
  //console.log('Received request for /chat-llm-models');
  try {
    const configPath = path.join(__dirname, '..',  'model.config.json');
    //console.log('Attempting to read config file from:', configPath);
    const configFile = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configFile);
    //console.log('Successfully read and parsed config file');

    res.json(config);
  } catch (error) {
    console.error('Error reading model configuration:', error);
    res.status(500).json({ message: 'Error fetching models configuration', error: error.message });
  }
});


startServer();

module.exports = app;