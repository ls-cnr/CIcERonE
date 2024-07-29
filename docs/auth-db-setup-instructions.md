# Configurazione del database di autenticazione

## 1. Preparazione dell'ambiente

1.1. Assicurati di avere MySQL installato e in esecuzione sul tuo sistema.

1.2. Installa le dipendenze necessarie nella cartella `backend`:

```bash
cd backend
npm install mysql2 dotenv
```

## 2. Creazione dei file di configurazione

2.1. Crea un file `.env` nella cartella `backend`:

```bash
touch .env
```

2.2. Aggiungi le seguenti variabili d'ambiente al file `.env`:

```
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=auth_db
```

2.3. Crea un file `schema.sql` nella cartella `backend`:

```bash
touch schema.sql
```

2.4. Aggiungi il seguente schema SQL al file `schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Implementazione della logica di inizializzazione del database

3.1. Crea un file `dbInit.js` nella cartella `backend`:

```bash
touch dbInit.js
```

3.2. Aggiungi il seguente codice al file `dbInit.js`:

```javascript
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
require('dotenv').config();

async function initDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Read and execute schema.sql
    const schema = await fs.readFile('schema.sql', 'utf8');
    await connection.query(schema);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

module.exports = initDatabase;
```

## 4. Modifica del server.js

4.1. Modifica il file `server.js` per includere l'inizializzazione del database:

```javascript
const express = require('express');
const initDatabase = require('./dbInit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Database initialization
let dbInitialized = false;

app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      return res.status(500).json({ error: 'Database initialization failed' });
    }
  }
  next();
});

app.get('/', (req, res) => {
  if (dbInitialized) {
    res.json({ message: 'Welcome! Database is accessible and initialized.' });
  } else {
    res.status(500).json({ error: 'Database is not accessible or initialized.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## 5. Test della funzionalità

5.1. Avvia il server:

```bash
node server.js
```

5.2. Apri un browser o usa un tool come curl per testare l'endpoint:

```bash
curl http://localhost:3000
```

Se tutto funziona correttamente, dovresti vedere un messaggio che indica che il database è accessibile e inizializzato.

## 6. Risoluzione dei problemi

- Se ricevi un errore di connessione al database, verifica che MySQL sia in esecuzione e che le credenziali nel file `.env` siano corrette.
- Se la tabella non viene creata, controlla che il file `schema.sql` sia nella posizione corretta e che il suo contenuto sia corretto.
- Se il server non si avvia, verifica che tutte le dipendenze siano installate correttamente.

