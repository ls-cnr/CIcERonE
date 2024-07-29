const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  let connection;
  let isNewDatabase = false;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // Check if database exists
    const [rows] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);
    if (rows.length === 0) {
      await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      isNewDatabase = true;
    }

    await connection.query(`USE ${process.env.DB_NAME}`);

    // Array of SQL files to execute in order
    const sqlFiles = ['users.sql', 'projects.sql', 'files.sql'];

    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, 'db', file);
      const sqlContent = await fs.readFile(filePath, 'utf8');
      await connection.query(sqlContent);
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
  } finally {
    if (connection) await connection.end();
  }
  return isNewDatabase;
}

module.exports = initDatabase;
