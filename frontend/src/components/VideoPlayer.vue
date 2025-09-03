<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})

const videoRef = ref(null)
let player = null

onMounted(() => {
  if (videoRef.value) {
    player = videojs(videoRef.value, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: true, 
      sources: [{ src: props.url, type: 'video/mp4' }],
    })
  }
})

watch(() => props.url, (newUrl) => {
  if (player) {
    player.src({ src: newUrl, type: 'video/mp4' })
    player.load()
    player.play()
  }
})

onBeforeUnmount(() => {
  if (player) {
    player.dispose()
  }
})
</script>

<template>
  <div>
    <video ref="videoRef" class="video-js vjs-big-play-centered"></video>
  </div>
</template>

<style scoped>
.video-js {
  width: 100%;
  max-height: 500px;
}
</style>
