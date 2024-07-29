<template>
  <div id="app">
    <!-- Barra di navigazione condizionale -->
    <nav v-if="showNavigation">
      <template v-if="isAuthenticated">
        <router-link to="/dashboard">Dashboard</router-link> |
        <router-link to="/profile">Profilo</router-link> |
        <a href="#" @click.prevent="logout">Logout</a>
      </template>
      <template v-else>
        <router-link to="/login">Login</router-link> |
        <router-link to="/register">Register</router-link>
      </template>
    </nav>

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token');
    },
    showNavigation() {
      // Non mostrare la navigazione nelle pagine di Dashboard, Profile e NewProject
      const hideNavRoutes = ['/dashboard', '/profile', '/new-project'];
      return !hideNavRoutes.includes(this.$route.path);
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
