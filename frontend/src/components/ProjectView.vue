<template>
  <div class="project-view">
    <h2>{{ project.title }}</h2>
    <p>{{ project.description }}</p>
    <h3>Mental Space Lattice</h3>
    <p>{{ project.mental_space_lattice }}</p>
    <button @click="$router.push('/dashboard')">Torna alla Dashboard</button>
  </div>
</template>

<script>
import axios from 'axios';
import '../styles/ProjectView.css';
export default {
  name: 'ProjectView',
  data() {
    return {
      project: {
        title: '',
        description: '',
        mental_space_lattice: ''
      }
    };
  },
  created() {
    this.fetchProjectDetails();
  },
  methods: {
    async fetchProjectDetails() {
      try {
        const projectId = this.$route.params.id;
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.project = response.data;
      } catch (error) {
        console.error('Errore nel recupero dei dettagli del progetto:', error);
        // Gestisci l'errore, magari reindirizzando alla dashboard o mostrando un messaggio di errore
      }
    }
  }
};
</script>

