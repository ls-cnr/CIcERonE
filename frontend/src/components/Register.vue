<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="username" type="text" placeholder="Username" required>
      <input v-model="email" type="email" placeholder="Email" required>
      <input v-model="password" type="password" placeholder="Password" required>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import '../styles/Login.css';

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
        // Redirect to login page after successful registration
        this.$router.push('/login');
      } catch (error) {
        console.error(error);
        // Show error message to the user
        alert('Registration failed. Please try again.');
      }
    }
  }
}
</script>
