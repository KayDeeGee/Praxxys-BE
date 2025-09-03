<script setup lang="ts">
import { ref } from 'vue'
import VideoPlayer from '@/components/VideoPlayer.vue'

// Example video URLs stored in `public/videos`
const videos = [
  '/videos/video1.mp4',
  '/videos/video2.mp4',
  '/videos/video3.mp4',
]

const currentVideo = ref(videos[0])

const selectVideo = (url: string) => {
  currentVideo.value = url
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Video Library</h1>
    
    <VideoPlayer :url="currentVideo" />
    
    <div class="mt-4 flex gap-2">
      <button
        v-for="video in videos"
        :key="video"
        @click="selectVideo(video)"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {{ video.split('/').pop() }}
      </button>
    </div>
  </div>
</template>
