<template>
  <div class="dashboard">
    <!-- Barra del titolo -->
    <header class="header">
      <h1>{{ toolName }}</h1>
    </header>

    <div class="main-content">
      <!-- Barra laterale -->
      <aside class="sidebar">
        <nav>
          <div class="upper-nav">
            <button @click="$router.push('/new-project')" class="new-project-btn">Nuovo Progetto</button>
          </div>
          <div class="lower-nav">
            <router-link to="/profile" class="nav-link">Profilo Utente</router-link>
            <a href="#" @click.prevent="logout" class="nav-link">Logout</a>
          </div>
        </nav>
      </aside>

      <!-- Lista dei progetti -->
      <main class="project-list">
        <h2>I tuoi progetti</h2>
        <ul v-if="projects.length">
          <li v-for="project in projects" :key="project.id" class="project-item">
            <router-link :to="'/project/' + project.id" class="project-name">
              {{ project.title }}
            </router-link>
            <button @click="deleteProject(project.id)" class="delete-btn">Elimina</button>
          </li>
        </ul>
        <p v-else>Non hai ancora creato nessun progetto.</p>
      </main>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Dashboard',
  data() {
    return {
      toolName: 'Mental Space Tool',
      projects: []
    };
  },
  created() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        this.projects = response.data;
      } catch (error) {
        console.error('Errore nel recupero dei progetti:', error);
        if (error.response && error.response.status === 401) {
          // Token non valido o scaduto, reindirizza al login
          this.$router.push('/login');
        }
      }
    },
    async deleteProject(projectId) {
      if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${import.meta.env.VITE_API_URL}/projects/${projectId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          this.projects = this.projects.filter(project => project.id !== projectId);
        } catch (error) {
          console.error('Errore nell\'eliminazione del progetto:', error);
        }
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  background-color: #4CAF50;
  color: white;
  padding: 1rem;
  text-align: center;
}

.main-content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 200px;
  background-color: #f1f1f1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.upper-nav {
  margin-bottom: 2rem;
}

.lower-nav {
  margin-top: auto;
}

.new-project-btn {
  width: 100%;
  padding: 0.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.nav-link {
  display: block;
  padding: 0.5rem 0;
  text-decoration: none;
  color: #333;
}

.project-list {
  flex: 1;
  padding: 1rem;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.project-name {
  text-decoration: none;
  color: #333;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
