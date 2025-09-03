<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const links = [
  { name: 'Dashboard', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Create Product', path: '/products-create' },
  { name: 'Videos', path: '/videos' },
]

const isActive = (path) => route.path === path
</script>

<template>
  <aside class="w-64 bg-gray-800 min-h-screen text-white flex flex-col">
    <div class="p-6 text-2xl font-bold border-b border-gray-700">
      Admin Panel
    </div>

    <nav class="flex-1 p-4 flex flex-col gap-2">
      <button
        v-for="link in links"
        :key="link.path"
        @click="router.push(link.path)"
        :class="[
          'text-left px-4 py-2 rounded hover:bg-gray-700',
          isActive(link.path) ? 'bg-gray-700 font-semibold' : ''
        ]"
      >
        {{ link.name }}
      </button>
    </nav>
  </aside>
</template>

<style scoped>
button:focus {
  outline: none;
}
</style>
