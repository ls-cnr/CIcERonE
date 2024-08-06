<template>
  <div class="login">
    <h2>Login</h2>

    <!-- Messaggio di errore -->
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required>
      <input v-model="password" type="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
    <p>Don’t you have an account? <router-link to="/register">Register</router-link></p>

    <!-- Link per accesso rapido -->
    <p>
      <a href="#" @click.prevent="quickLogin">Quick Login (Demo)</a>
    </p>
  </div>
</template>

<script>
import axios from 'axios';
//import '../styles/Login.css';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async login() {
      try {
        this.errorMessage = ''; // Resetta il messaggio di errore
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
          email: this.email,
          password: this.password
        });
        console.log('Login successful', response.data);
        localStorage.setItem('token', response.data.token);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Login failed', error);
        this.errorMessage = 'Login failed. Wrong username or password: retry.';
      }
    },
    quickLogin() {
      this.email = 'lsabatucci@gmail.com';
      this.password = 'p1p1n0';
      this.login();
    }
  }
}
</script>

<style scoped>
.login {
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

.error-message {
  color: red;
  font-weight: bold;
  margin-bottom: 15px;
}

a {
  color: #42b983;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>