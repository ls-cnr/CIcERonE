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
import '../styles/Profile.css';

export default {
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

