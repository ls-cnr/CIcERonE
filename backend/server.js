const express = require('express');
const cors = require('cors');
const initDatabase = require('./dbInit');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Immediately invoke database initialization
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
    process.exit(1);  // Exit the process if database initialization fails
  }
})();

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome! Database is accessible and initialized.' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
