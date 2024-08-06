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
            <button @click="$router.push('/new-project')" class="new-project-btn">New Project</button>
          </div>
          <div class="lower-nav">
            <router-link to="/profile" class="nav-link">User Profile</router-link>
            <a href="#" @click.prevent="logout" class="nav-link">Logout</a>
          </div>
        </nav>
      </aside>

      <!-- Lista dei progetti -->
      <main class="project-list">
        <h2>Your Projects</h2>
        <ul v-if="projects.length">
          <li v-for="project in projects" :key="project.id" class="project-item">
            <router-link :to="'/project/' + project.id" class="project-info">
              {{ truncateProjectInfo(project.title, project.description) }}
            </router-link>
            <button @click="deleteProject(project.id)" class="delete-btn" aria-label="Delete project">
              <span class="material-icons">delete</span>
            </button>
          </li>
        </ul>
        <p v-else>You haven’t created any projects yet.</p>
      </main>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
//import '../styles/Dashboard.css';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
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
            headers: { 'Authorization': `Bearer ${token}` }
          });
          this.projects = this.projects.filter(project => project.id !== projectId);
        } catch (error) {
          console.error('Errore nell\'eliminazione del progetto:', error);
          alert('Errore nell\'eliminazione del progetto. Riprova più tardi.');
        }
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
    truncateProjectInfo(title, description) {
      const combined = `${title}: ${description}`;
      if (combined.length <= 70) return combined;
      return combined.substring(0, 67) + '...';
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
  padding: 0;  /* Rimuoviamo il padding qui */
  background-color: #f9f9f9;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  height: 50px;  /* Altezza fissa per ogni elemento della lista */
}

.project-item:hover {
  background-color: rgba(76, 175, 80, 0.1);
}

.project-info {
  text-decoration: none !important;
  color: #333;
  flex-grow: 1;
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1rem;  /* Spostiamo il padding qui */
  margin: 0;  /* Rimuoviamo qualsiasi margin */
  text-align: left;
}

.project-info:hover,
.project-info:focus,
.project-info:active {
  text-decoration: none !important;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
  margin-right: 0.5rem;  /* Aggiungiamo un po' di margine a destra */
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.delete-btn .material-icons {
  font-size: 20px;
}
</style>