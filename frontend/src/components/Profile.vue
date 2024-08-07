<template>
  <div class="profile">
    <h2>User Profile</h2>
    <div class="profile-info">
      <div class="info-item">
        <label>Username:</label>
        <span class="info-value">{{ user.username }}</span>
      </div>
      <div class="info-item">
        <label>Email:</label>
        <span class="info-value">{{ user.email }}</span>
      </div>
    </div>
    <div class="button-group">
      <button @click="goToDashboard" class="btn back-btn">
        <span class="material-icons">arrow_back</span>
        Back to Dashboard
      </button>
    </div>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import axios from 'axios';

export default {
  name: 'Profile',
  setup() {
    const router = useRouter();
    const user = ref({username: '', email: ''});

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        user.value = response.data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error.response && error.response.status === 401) {
          router.push('/login');
        } else {
          alert('Error loading profile. Please try again later.');
        }
      }
    };

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    onMounted(fetchUserProfile);

    return {
      user,
      goToDashboard
    };
  }
};
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.profile-info {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-item {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.info-item:last-child {
  margin-bottom: 0;
}

label {
  font-weight: bold;
  color: #555;
  width: 100px;
  margin-right: 1rem;
}

.info-value {
  color: #333;
  flex-grow: 1;
}

.button-group {
  display: flex;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn {
  background-color: #4CAF50;
  color: white;
}

.back-btn:hover {
  background-color: #45a049;
}

.material-icons {
  font-size: 1.25rem;
}
</style>