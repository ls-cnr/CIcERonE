#!/bin/bash

echo "Avvio dell'applicazione..."

echo "Avvio del backend..."
osascript -e 'tell app "Terminal" to do script "cd '"`pwd`"'/backend && npm start"'

echo "Avvio del frontend..."
osascript -e 'tell app "Terminal" to do script "cd '"`pwd`"'/frontend && npm run dev"'

echo "Avvio di FlaskRAG..."
osascript -e 'tell app "Terminal" to do script "cd '"`pwd`"'/flaskRAG && source venv/bin/activate && python app.py"'

echo "Tutte le componenti sono state avviate!"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:3000"
echo "FlaskRAG API: http://localhost:5000"
