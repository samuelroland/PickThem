<template>
<div class="p-5">
  <Pick />
  </div>
</template>

<script>
import Pick from './components/Pick.vue'

export default {
  name: 'App',
  components: {
    Pick
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
  margin-top: 60px;
}
</style>
