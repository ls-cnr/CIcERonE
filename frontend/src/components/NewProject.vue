<template>
  <div class="new-project">
    <h2>Create a new Project</h2>
    <form @submit.prevent="createProject">
      <div class="form-group">
        <label for="title">Project's title:</label>
        <textarea id="title" v-model="project.title" required class="title-input"></textarea>
      </div>
      <div class="form-group">
        <label for="description">Project's description:</label>
        <textarea id="description" v-model="project.description" class="description-input"></textarea>
      </div>
      <button type="submit">Create</button>
    </form>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';
//import '../styles/NewProject.css';

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

<style scoped>
.new-project {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}

.title-input {
  height: 3rem;
  resize: vertical;
}

.description-input {
  min-height: 150px;
  resize: vertical;
}

button {
  padding: 0.75rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>