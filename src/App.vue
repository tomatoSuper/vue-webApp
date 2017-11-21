<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  #app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .3s linear;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
  .transform-enter-active, .transform-leave-active {
    transition: all .3s linear;
  }
  .transform-enter, .transform-leave-active {
    opacity: 0;
    -webkit-transform: translate(-100%,0);
    -moz-transform: translate(-100%,0);
    -ms-transform: translate(-100%,0);
    -o-transform: translate(-100%,0);
    transform: translate(-100%,0);
  }
</style>
