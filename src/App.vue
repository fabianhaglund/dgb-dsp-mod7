<template>
  <div id="app">
    <h2>MongoDB demo</h2>
    <h4>Select action below</h4>
    <Start />
  </div>
</template>

<script>
import Start from "./components/Start.vue";

export default {
  name: "App",
  components: {
    Start
  }
};
</script>

<style>

#app {
  font-family: 'Courier New', Courier, monospace;
  padding: 40px;
}

h2 h4 {
  padding: 10px; 
  margin: 20px; 
}

.menuButton{
  margin: 20px;
  padding: 10px;
  font-family: "Courier New", Courier, monospace;
  background-color: white;
  font-size: 24px;
}

.actionButton {
  margin: 20px;
  padding: 10px;
  font-size: 16px;
  font-family: "Courier New", Courier, monospace;
  background-color: lightgray;
}
</style>
