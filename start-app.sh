#!/bin/bash

echo "Avvio dell'applicazione..."

echo "Avvio di FlaskRAG..."
osascript -e 'tell app "Terminal" to do script "cd '"`pwd`"'/flaskRAG && source venv/bin/activate && python app.py"'

echo "Attendere l'avvio di FlaskRAG..."
sleep 5

echo "Avvio del backend..."
osascript -e 'tell app "Terminal" to do script "cd '"`pwd`"'/backend && npm start"'

echo "Attendere l'avvio del backend..."
sleep 5

echo "Avvio del frontend..."
osascript -e 'tell app "Terminal" to do script "cd '"`pwd`"'/frontend && npm run dev"'

echo "Tutte le componenti sono state avviate!"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:3000"
echo "FlaskRAG API: http://localhost:5000"