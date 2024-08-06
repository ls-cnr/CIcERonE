<template>
  <div class="dashboard">
    <header class="header">
      <h1>{{ toolName }}</h1>
    </header>

    <div class="main-content">
      <aside class="sidebar">
        <nav>
          <div class="upper-nav">
            <button @click="$router.push('/new-project')" class="new-project-btn">
              <span class="material-icons">add_circle</span>
              New Project
            </button>
          </div>
          <div class="lower-nav">
            <router-link to="/profile" class="nav-link">
              <span class="material-icons">person</span>
              User Profile
            </router-link>
            <a href="#" @click.prevent="logout" class="nav-link">
              <span class="material-icons">exit_to_app</span>
              Logout
            </a>
          </div>
        </nav>
      </aside>

      <main class="project-list">
        <h2>Your Projects</h2>
        <ul v-if="projects.length">
          <li v-for="project in projects" :key="project.id" class="project-item">
            <router-link :to="'/project/' + project.id" class="project-info">
              <span class="project-title">{{ project.title }}</span>
              <span class="project-description">{{ truncateDescription(project.description) }}</span>
            </router-link>
            <button @click="deleteProject(project.id)" class="delete-btn" aria-label="Delete project">
              <span class="material-icons">delete</span>
            </button>
          </li>
        </ul>
        <p v-else class="no-projects">You haven't created any projects yet.</p>
      </main>
    </div>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import axios from 'axios';

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter();
    const toolName = ref('Mental Space Tool');
    const projects = ref([]);

    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        projects.value = response.data;
      } catch (error) {
        console.error('Error fetching projects:', error);
        if (error.response && error.response.status === 401) {
          router.push('/login');
        }
      }
    };

    const deleteProject = async (projectId) => {
      if (confirm('Are you sure you want to delete this project?')) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${import.meta.env.VITE_API_URL}/projects/${projectId}`, {
            headers: {'Authorization': `Bearer ${token}`}
          });
          projects.value = projects.value.filter(project => project.id !== projectId);
        } catch (error) {
          console.error('Error deleting project:', error);
          alert('Error deleting project. Please try again later.');
        }
      }
    };

    const logout = () => {
      localStorage.removeItem('token');
      router.push('/login');
    };

    const truncateDescription = (description) => {
      return description.length > 50 ? description.substring(0, 47) + '...' : description;
    };

    onMounted(fetchProjects);

    return {
      toolName,
      projects,
      deleteProject,
      logout,
      truncateDescription
    };
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background-color: #f1f1f1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
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
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.new-project-btn:hover {
  background-color: #45a049;
}

.new-project-btn .material-icons {
  margin-right: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  text-decoration: none;
  color: #333;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #e0e0e0;
}

.nav-link .material-icons {
  margin-right: 0.5rem;
}

.project-list {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.project-item:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.project-info {
  flex-grow: 1;
  text-decoration: none;
  color: #333;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.project-title {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.project-description {
  font-size: 0.9rem;
  color: #666;
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
  margin-right: 0.75rem;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.no-projects {
  text-align: center;
  color: #666;
  margin-top: 2rem;
}
</style>