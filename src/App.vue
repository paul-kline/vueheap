<template>
  <div id="app" class="container bg-black">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your ssssVue.js + TypeScript App"/> -->
    <Heap/>
    <HeapCanvas style="background-color: black; width:100%; height: 5em;"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import Heap from "./components/Heap.vue";
import HeapCanvas from "./components/HeapCanvas.vue";
@Component({
  components: {
    HelloWorld,
    Heap,
    HeapCanvas
  }
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
