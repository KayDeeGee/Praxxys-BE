<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  console.log('Navigating to login...')
  router.push('/login')
}
</script>

<template>
  <div class="home-page">
    <h1>You did it!</h1>
    <p>
      Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
      documentation
    </p>
    
    <router-link to="/login">
      <button>Login (Router Link)</button>
    </router-link>
    
    <button @click="goToLogin">Login (Function)</button>
  </div>
</template>

<style scoped>
.home-page {
  padding: 2rem;
  text-align: center;
}

button {
  padding: 10px 20px;
  margin: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>