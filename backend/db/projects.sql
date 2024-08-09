CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  chat_model_id VARCHAR(50) DEFAULT 'local_ollama',
  llm_model_id VARCHAR(50) DEFAULT 'llama3',
  api_key VARCHAR(255) DEFAULT 'NO_KEY',
  mental_space_lattice MEDIUMTEXT,
  analysis MEDIUMTEXT,
  generate_analysis BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);