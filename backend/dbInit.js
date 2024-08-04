const { pool } = require('./db');
const fs = require('fs').promises;
const path = require('path');

async function initDatabase() {
  let isNewDatabase = false;
  try {
    // Check if database exists
    const [rows] = await pool.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);
    if (rows.length === 0) {
      console.log(`Creating new database: ${process.env.DB_NAME}`);
      await pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      isNewDatabase = true;
    }

    // Use the database
    await pool.query(`USE ${process.env.DB_NAME}`);

    // Array of SQL files to execute in order
    const sqlFiles = ['users.sql', 'projects.sql', 'files.sql'];

    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, 'db', file);
      const sqlContent = await fs.readFile(filePath, 'utf8');
      await pool.query(sqlContent);
      console.log(`Executed ${file}`);
    }

    if (isNewDatabase) {
      console.log('Database and tables initialized for the first time');
    } else {
      console.log('Database and tables already exist, schema updated if necessary');
    }
  } catch (error) {
    console.error('Error in database initialization:', error);
    throw error;
  }
  return isNewDatabase;
}

module.exports = initDatabase;