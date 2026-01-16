<script setup lang="ts">
defineProps<{
  htmlCode?: string
}>();
</script>

<template>
  <div class="result-container">
    <iframe 
      v-if="htmlCode" 
      :srcdoc="htmlCode" 
      frameborder="0" 
      class="geometry-iframe"
    ></iframe>
    <div v-else class="placeholder">
      <p>No code to render.</p> 
    </div>
  </div>
</template>

<style scoped>
.result-container {
  width: 100%;
  height: 100vh;
  background: white;
}
.geometry-iframe {
  width: 100%;
  height: 100%;
  display: block;
  border: none;
}
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 1.2rem;
}
</style>