<template>
  <div id="app">
    <Start/>
  </div>
</template>

<script>

  import Start from './components/Start.vue'

  export default {
    name: 'App',
    components: {
      Start
    }
  }
</script>

<style>

  #app{
    padding: 40px;
  }

  button {
    margin: 20px; 
    padding: 10px; 
    font-family: 'Courier New', Courier, monospace;
    background-color: paleturquoise ;
    font-size: 24px;
  }

  .submitButton {
    font-size: 16px;
    background-color: lightgray;
  }

</style>