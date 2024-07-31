<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required>
      <input v-model="password" type="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import '../styles/Login.css';

export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
          email: this.email,
          password: this.password
        });
        console.log('Login successful', response.data);
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        // Redirect to dashboard
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Login failed', error);
        alert('Login failed. Please check your credentials and try again.');
      }
    }
  }
}
</script>
