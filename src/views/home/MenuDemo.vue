<template>
  <div>
    <el-container>
      <el-header height="40px" style="background: rgb(28,56,94);">
        <el-row style="margin-top: 0.6%;">
          <el-col :span="1">
            <el-button class="button" @click="changeCollapse" v-show="showOpen" icon="el-icon-circle-plus">

            </el-button>
            <el-button class="button" @click="changeCollapse" v-show="showClose" icon="el-icon-remove">

            </el-button>
          </el-col>
          <el-col :span="3" :offset="20">
            <p style="color: #DCDFE6;text-align: left">
              <span class="hidVer">3.9.1</span>
              欢迎您：{{name}} 修改密码 <span class="logoutCs" @click="exit">退出</span></p>
          </el-col>
        </el-row>
      </el-header>
      <!--<el-aside width="200px" style="margin-top: -1px;">
        <aside-menu :is-collapse="isCollapse"></aside-menu>
      </el-aside>-->
      <!--<el-container class="con1">
      </el-container>-->
      <!--<aside-menu :is-collapse="isCollapse"></aside-menu>-->
      <!--<el-container class="con2">
        <router-view/>
      </el-container>-->
      <el-container>
        <el-menu
          :collapse-transition="true"
          :collapse="isCollapse"
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="rgb(32,64,108)"
          text-color="#fff"
          active-text-color="rgb(64,158,255)"
          @select="handleSelect"
          router
          style="height: auto;min-width: 65px;max-width: 120px"
        >
          <el-menu-item index='/faultWarnings' style="text-align: left;">
            <i class="el-icon-s-opportunity"></i>
            <span slot="title">预警</span>
          </el-menu-item>
<!--          <el-menu-item index='/effOpt' style="text-align: left;">-->
<!--            <i class="el-icon-s-data"></i>-->
<!--            <span slot="title">优化</span>-->
<!--          </el-menu-item>-->
          <el-menu-item index='/newEffOpt' style="text-align: left;">
            <i class="el-icon-s-data"></i>
            <span slot="title">优化</span>
          </el-menu-item>
          <el-menu-item index='/bigData' style="text-align: left;">
            <i class="el-icon-s-marketing"></i>
            <span slot="title">统计</span>
          </el-menu-item>
          <el-menu-item index='/health' style="text-align: left;">
            <i class="el-icon-s-management"></i>
            <span slot="title">健康</span>
          </el-menu-item>

        </el-menu>
        <el-container>
          <router-view/>
        </el-container>
      </el-container>

      <!--<el-main class="el-main" >
      <router-view/>
      </el-main>-->
    </el-container>
  </div>
</template>

<script>
  //import asideMenu from "../../components/menu/Menu"
import store from '../../store/index'
  export default {
    name: "MenuDemo",
    components: {
      //asideMenu
    },
    mounted() {

    },
    data() {
      return {
        showOpen: true,
        showClose: false,
        isCollapse: true
      }
    },
    computed:{
      name(){
        let u =this.$store.state.UserData
        if(u){
          return u.realName?u.realName:''
        }
        return ''
        // return this.$store.state.UserData.realName
      }
    },
    methods: {
      handleSelect(index) {
      },
      exit(){

        store.dispatch('clearAll')
        window.close()
      },
      changeCollapse() {
        if (this.showOpen === true) {
          this.showOpen = false;
          this.showClose = true;
          this.isCollapse = false
          //this.changeState();
        } else {
          this.showClose = false;
          this.showOpen = true;
          this.isCollapse = true
          //this.changeState();
        }
      }
    }
  }
</script>

<style scoped>
  .el-header {


  }

  /*展开*/
  /* .el-main {
     position: absolute;
     top: 35px;
     left: 150px;
     right: 0;
     bottom: 0;
     overflow-y: scroll;
   }*/

  /* .el-aside {
     display: block;
     position: absolute;
     top: 35px;
     bottom: 0;
   }*/

  .button {
    margin-left: -55%;
    margin-top: -15%;
    color: #e5e5e5;
    background-color: rgb(28, 56, 94);
    border: 0;

  }
  .hidVer{
    display: none;
  }
  .logoutCs{
    cursor: pointer;
    text-decoration: underline;
  }
  .logoutCs:hover{

  }
  .el-menu-vertical-demo {


  }

  /*展开*/
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 150px;
  }

  /* .con1 {
     position: relative;
   }
   .con2 {
     position: relative;
   }*/
</style>
