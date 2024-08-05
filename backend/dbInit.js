const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '../.env' });

async function initDatabase() {
  let connection;
  let isNewDatabase = false;
  try {
    // Connessione iniziale senza specificare un database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log('Connessione al server MySQL stabilita.');

    // Controlla se il database esiste
    const [rows] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);
    if (rows.length === 0) {
      console.log(`Il database ${process.env.DB_NAME} non esiste. Creazione in corso...`);
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      isNewDatabase = true;
    }

    // Usa il database
    await connection.query(`USE ${process.env.DB_NAME}`);
    console.log(`Utilizzando il database ${process.env.DB_NAME}`);

    // Array di file SQL da eseguire in ordine
    const sqlFiles = ['users.sql', 'projects.sql', 'files.sql'];

    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, 'db', file);
      const sqlContent = await fs.readFile(filePath, 'utf8');
      await connection.query(sqlContent);
      console.log(`Eseguito ${file}`);
    }

    if (isNewDatabase) {
      console.log('Database e tabelle inizializzati per la prima volta');
    } else {
      console.log('Database e tabelle già esistenti, schema aggiornato se necessario');
    }
  } catch (error) {
    console.error('Errore nell\'inizializzazione del database:', error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
  return isNewDatabase;
}

module.exports = initDatabase;