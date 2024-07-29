const express = require('express');
const cors = require('cors');
const initDatabase = require('./dbInit');
const authRoutes = require('./routes/auth');
const projectsRoutes = require('./routes/projects');
const usersRoutes = require('./routes/users');  // Aggiungi questa linea
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inizializzazione del database
(async () => {
  try {
    console.log('Checking database status...');
    const isNewDatabase = await initDatabase();
    if (isNewDatabase) {
      console.log('Database was newly initialized');
    } else {
      console.log('Connected to existing database');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
})();

app.use('/auth', authRoutes);
app.use('/projects', projectsRoutes);
app.use('/user', usersRoutes);  // Aggiungi questa linea

app.get('/', (req, res) => {
  res.json({ message: 'Welcome! Database is accessible and initialized.' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
