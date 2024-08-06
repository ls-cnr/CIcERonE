<template>
  <div class="profile">
    <h2>Profilo Utente</h2>
    <div class="profile-info">
      <div class="info-item">
        <label>Username:</label>
        <span>{{ user.username }}</span>
      </div>
      <div class="info-item">
        <label>Email:</label>
        <span>{{ user.email }}</span>
      </div>
    </div>
    <button @click="$router.push('/dashboard')" class="back-btn">Torna alla Dashboard</button>
  </div>
</template>

<script>
import axios from 'axios';
//import '../styles/Profile.css';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Profile',
  data() {
    return {
      user: {
        username: '',
        email: ''
      }
    };
  },
  created() {
    this.fetchUserProfile();
  },
  methods: {
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        this.user = response.data;
      } catch (error) {
        console.error('Errore nel recupero del profilo:', error);
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        } else {
          alert('Errore nel caricamento del profilo. Riprova più tardi.');
        }
      }
    }
  }
};
</script>

<style scoped>
.profile {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-info {
  background-color: #f5f5f5;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.info-item {
  margin-bottom: 0.5rem;
}

label {
  font-weight: bold;
  margin-right: 0.5rem;
}

.back-btn {
  display: block;
  width: 100%;
  padding: 0.5rem;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.back-btn:hover {
  background-color: #0b7dda;
}
</style>
