<template>
  <div class="new-project">
    <h2>Crea Nuovo Progetto</h2>
    <form @submit.prevent="createProject">
      <div class="form-group">
        <label for="title">Titolo del Progetto:</label>
        <textarea id="title" v-model="project.title" required class="title-input"></textarea>
      </div>
      <div class="form-group">
        <label for="description">Descrizione:</label>
        <textarea id="description" v-model="project.description" class="description-input"></textarea>
      </div>
      <button type="submit">Crea Progetto</button>
    </form>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import '../styles/NewProject.css';

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
        // Reindirizza alla pagina del progetto appena creato
        this.$router.push(`/project/${response.data.projectId}`);
      } catch (error) {
        console.error('Errore nella creazione del progetto:', error);
        this.error = 'Errore nella creazione del progetto. Riprova più tardi.';
      }
    }
  }
};
</script>