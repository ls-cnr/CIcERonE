<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Mental Space Latice',
  computed: {
    showNavigation() {
      // Mostra la navigazione solo nelle pagine di login e registrazione
      return ['Login', 'Register'].includes(this.$route.name);
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

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
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>