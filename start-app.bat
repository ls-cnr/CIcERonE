@echo off
echo Avvio dell'applicazione...

echo Avvio del backend...
start cmd /k "cd backend && npm start"

echo Avvio del frontend...
start cmd /k "cd frontend && npm run dev"

echo Avvio di FlaskRAG...
start cmd /k "cd flaskRAG && venv\Scripts\activate && python app.py"

echo Tutte le componenti sono state avviate!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:3000
echo FlaskRAG API: http://localhost:5000
