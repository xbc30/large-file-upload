<template>
  <div id="app">
    <Upload />
  </div>
</template>

<script>
import Upload from "./components/upload.vue";

export default {
  name: "App",
  components: {
    Upload,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
* {
  margin: 0;
  padding: 0;
}
</style>
