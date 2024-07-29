<template>
  <div class="home">
    <h1>Welcome to the Home Page</h1>
    <nav>
      <router-link to="/register">Register</router-link> |
      <router-link to="/login">Login</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
