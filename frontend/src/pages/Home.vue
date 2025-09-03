<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="landing-page flex flex-col min-h-screen">
    <section class="flex-1 flex flex-col justify-center items-center text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6">
      <h1 class="text-5xl md:text-6xl font-bold mb-4">PRAXXYS BACKEND EXAM</h1>
      <p class="text-lg md:text-xl mb-8 max-w-2xl">
        Product CRUD
      </p>
      <button 
        @click="goToLogin"
        class="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
      >
        Log In
      </button>
    </section>

    <!-- Footer Section -->
    <footer class="bg-gray-800 text-white py-6 text-center">
      <p> By: Kyle Bryan D. Basco</p>
    </footer>
  </div>
</template>

<style scoped>
.landing-page {
  font-family: 'Inter', sans-serif;
}
</style>
