<template>
  <div id="app">
    <Mandelbrot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Mandelbrot from '@/components/Mandelbrot/Mandelbrot.vue';

@Component({
  components: {
    Mandelbrot
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
body {
  margin: 0;
  overflow: hidden;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
