<script setup>
import Sidebar from '@/components/Sidebar.vue'
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content -->
    <main class="flex-1 bg-gray-100 p-6">
      <router-view />
    </main>
  </div>
</template>