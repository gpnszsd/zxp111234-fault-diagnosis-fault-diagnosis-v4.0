<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>



<script>
  import asideMenu from './components/menu/Menu'

  import store from './store/index'
  export default {
    name: 'home',
    components: {
      asideMenu
    },
    data(){
      return {

      }
    }
    ,
    created(){


    },
    methods : {

    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

    /*margin-top: 60px;*/

  }
  .el-card__header {
    background: rgb(245,247,249);
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 7px;
  }
    ::-webkit-scrollbar-thumb {
      background-color: #eaecf1;
      border-radius: 3px;
    }
</style>
