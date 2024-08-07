<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          required
          @input="validateForm"
        >
      </div>
      <div class="form-group">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          @input="validateForm"
        >
        <span v-if="!isEmailValid && email" class="error-message">Please enter a valid email address</span>
        <span v-if="emailError" class="error-message">{{ emailError }}</span>
      </div>
      <div class="form-group">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          @input="validateForm"
        >
      </div>
      <button type="submit" :disabled="!isFormValid">Register</button>
    </form>
    <p>Do you already have an account?
      <router-link to="/login">Login</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      isEmailValid: true,
      isFormValid: false,
      emailError: ''
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
        if (error.response && error.response.data && error.response.data.error === 'Email already registered') {
          this.emailError = 'This email is already registered';
        } else {
          alert('Registration failed. Please try again.');
        }
      }
    },
    validateForm() {
      this.isEmailValid = this.validateEmail(this.email);
      this.isFormValid = this.username.trim() !== '' &&
          this.isEmailValid &&
          this.email.trim() !== '' &&
          this.password.trim() !== '';
      this.emailError = ''; // Clear email error when form is being edited
    },
    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  }
};
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

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
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

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  margin-top: 0.2rem;
}
</style>