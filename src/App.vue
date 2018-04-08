<template>
  <div id="app">
    <tree-demo/>
  </div>
</template>

<script>
import TreeDemo from './components/'

export default {
  name: 'App',
  components: {
    TreeDemo
  }
}
</script>

<style lang="stylus">
body
  font 12px/1.5 'Avenir', Helvetica, Arial, sans-serif;
  color #2c3e50;
  background #fff
  color #2c3e50;
#app
  margin-top 60px;
</style>
