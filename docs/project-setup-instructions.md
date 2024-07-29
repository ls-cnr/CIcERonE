# Istruzioni per la configurazione del progetto web

## 1. Creazione della struttura del progetto

```bash
mkdir web-tool-project
cd web-tool-project
mkdir frontend backend flaskRAG docs
```

## 2. Inizializzazione del repository Git

```bash
git init
echo "node_modules/" > .gitignore
echo "venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
git add .
git commit -m "Inizializzazione struttura del progetto"
```

## 3. Configurazione del frontend (Vue.js)

```bash
cd frontend
npm init vue@latest
# Segui le istruzioni per configurare il progetto Vue.js
cd ..
```

Quando esegui npm init vue@latest, ti verranno poste una serie di domande. Ecco come suggerisco di rispondere:

Project name: frontend
(Questo manterrà coerenza con la struttura del progetto che abbiamo già definito)
Add TypeScript? No
(A meno che tu non abbia familiarità con TypeScript e voglia usarlo)
Add JSX Support? No
(Non è necessario per un progetto Vue standard)
Add Vue Router for Single Page Application development? Yes
(Questo sarà utile per gestire le diverse pagine della tua applicazione)
Add Pinia for state management? Yes
(Pinia è il gestore di stato raccomandato per Vue 3, sarà utile per gestire lo stato dell'applicazione)
Add Vitest for Unit Testing? Yes
(È sempre una buona idea avere un framework di test)
Add an End-to-End Testing Solution? No
(Puoi sempre aggiungerlo in seguito se necessario)
Add ESLint for code quality? Yes
(Aiuta a mantenere la qualità e la coerenza del codice)
Add Prettier for code formatting? Yes
(Aiuta a mantenere uno stile di codice coerente)


## 4. Configurazione del backend (Node.js)

```bash
cd backend
npm init -y
npm install express jsonwebtoken mysql2 bcrypt cors dotenv
touch server.js
touch .env
```

Crea uno script `setup-db.js` per inizializzare il database:

```javascript
// setup-db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
  await connection.query(`USE ${process.env.DB_NAME}`);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database setup completed');
  await connection.end();
}

setupDatabase().catch(console.error);
```

## 5. Configurazione di FlaskRAG (Python, Flask, LangChain)

```bash
cd flaskRAG
python3 -m venv venv
source venv/bin/activate
pip install flask langchain python-dotenv
touch app.py
touch .env
deactivate
cd ..
```

## 6. Creazione dei file di configurazione

Nel file `backend/.env`:

```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=web_tool_db
JWT_SECRET=your_jwt_secret
```

Nel file `flaskRAG/.env`:

```
OPENAI_API_KEY=your_openai_api_key
```

## 7. Primi test delle componenti

### Frontend (Vue.js)

```bash
cd frontend
npm install
npm run dev
```

Visita `http://localhost:5173` nel tuo browser per verificare che l'app Vue.js sia in esecuzione.

### Backend (Node.js)

Crea un file `server.js` di base:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Avvia il server:

```bash
cd backend
node server.js
```

### FlaskRAG (Flask)

Crea un file `app.py` di base:

```python
# app.py
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify({"message": "FlaskRAG server is running!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

Avvia il server Flask:

```bash
cd flaskRAG
source venv/bin/activate
python app.py
```

## 8. Consigli per l'evoluzione del progetto

1. **Gestione delle dipendenze**: Usa `package.json` per il frontend e il backend, e `requirements.txt` per FlaskRAG.

2. **Containerizzazione**: Considera l'uso di Docker per containerizzare ciascun componente, facilitando il deployment e la scalabilità.

3. **Testing**: Implementa test unitari e di integrazione per ciascun componente.

4. **CI/CD**: Configura un pipeline CI/CD per automatizzare il testing e il deployment.

5. **Documentazione**: Mantieni aggiornata la documentazione nella cartella `docs`, includendo istruzioni di setup, API endpoints, e architettura del progetto.

6. **Sicurezza**: Implementa best practices di sicurezza, come la sanitizzazione degli input e la protezione contro attacchi comuni.

7. **Logging e Monitoraggio**: Implementa un sistema di logging robusto e considera l'uso di strumenti di monitoraggio.

8. **Scalabilità**: Progetta l'architettura pensando alla scalabilità futura, considerando l'uso di code di messaggi o architetture serverless.

9. **Gestione degli errori**: Implementa una gestione degli errori consistente e informativa in tutti i componenti.

10. **Versionamento API**: Prepara il backend per il versionamento delle API per facilitare future modifiche senza interrompere i client esistenti.
