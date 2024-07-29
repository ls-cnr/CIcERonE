<template>
  <div class="new-project">
    <h2>Crea Nuovo Progetto</h2>
    <form @submit.prevent="createProject">
      <div>
        <label for="title">Titolo del Progetto:</label>
        <input id="title" v-model="project.title" type="text" required>
      </div>
      <div>
        <label for="description">Descrizione:</label>
        <textarea id="description" v-model="project.description"></textarea>
      </div>
      <button type="submit">Crea Progetto</button>
    </form>
    <button @click="$router.push('/dashboard')" class="back-btn">Torna alla Dashboard</button>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NewProject',
  data() {
    return {
      project: {
        title: '',
        description: ''
      },
      error: null
    };
  },
  methods: {
    async createProject() {
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/projects`, this.project, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Progetto creato:', response.data);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Errore nella creazione del progetto:', error);
        this.error = 'Errore nella creazione del progetto. Riprova più tardi.';
      }
    }
  }
};
</script>

<style scoped>
.new-project {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

form {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

label {
  margin-bottom: 0.5rem;
}

input, textarea {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.back-btn {
  background-color: #2196F3;
  margin-top: 1rem;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
