<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="username" type="text" placeholder="Username" required>
      <input v-model="email" type="email" placeholder="Email" required>
      <input v-model="password" type="password" placeholder="Password" required>
      <button type="submit">Register</button>
    </form>
    <p>Do you already have an account? <router-link to="/login">Login</router-link></p>
  </div>
</template>

<script>
import axios from 'axios';
//import '../styles/Register.css';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: ''
    }
  },
  methods: {
    async register() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
          username: this.username,
          email: this.email,
          password: this.password
        });
        console.log(response.data);
        this.$router.push('/login');
      } catch (error) {
        console.error(error);
        alert('Registration failed. Please try again.');
      }
    }
  }
}
</script>

<style scoped>
.register {
  max-width: 300px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
}

input {
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

button:hover {
  background-color: #45a049;
}
</style>