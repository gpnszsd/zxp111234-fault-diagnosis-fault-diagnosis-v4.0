<template>
  <div class="NavMenu">
    <!--<el-radio-group v-model="isCollapse" style="margin-left: -33%">
      <el-radio-button icon="el-icon-s-unfold" :label="false"></el-radio-button>
      <el-radio-button icon="el-icon-s-fold" :label="true"></el-radio-button>
    </el-radio-group>-->
    <el-menu
      :collapse="isCollapse"
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      background-color="rgb(32,64,108)"
      text-color="#fff"
      active-text-color="rgb(64,158,255)"
      @select="handleSelect"
      router
      style="height: 100%;"
    >
      <el-menu-item index='/faultWarnings' style="text-align: left;">
        <i class="el-icon-s-opportunity"></i>
        <span slot="title">预警</span>
      </el-menu-item>
      <el-menu-item index='/effOpt' style="text-align: left;">
        <i class="el-icon-s-data"></i>
        <span slot="title">优化</span>
      </el-menu-item>

      <!--<el-menu-item index='/predict' style="text-align: left">
        <i class="el-icon-s-home"></i>
        <span>预测</span>
      </el-menu-item>-->
      <!--<el-menu-item index="/faultWarning" style="text-align: left">
        <template slot="title">
          <i class="el-icon-bell"></i>
          <span>故障预警</span>
        </template>
      </el-menu-item>-->
      <!--<el-menu-item index="/test" style="text-align: left">
        <template slot="title">
          <i class="el-icon-bell"></i>
          <span>test</span>
        </template>
      </el-menu-item>-->
      <!--得分环组件测试-->
      <!--<el-menu-item index="/ringGaugeChart" style="text-align: left">
        <template slot="title">
          <i class="el-icon-bell"></i>
          <span>testChart</span>
        </template>
      </el-menu-item>-->
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: "Menu",
    data() {
      return {
        //isCollapse: true,//导航栏展开/折叠
      }
    },
    props: ['isCollapse'],
    methods: {
      handleSelect(index) {
      },
      /*changeState(){
        this.isCollapse !== this.isCollapse;
      }*/
    }
  }
</script>

<style scoped>
  .NavMenu {

  }

  .el-menu-vertical-demo {
    position: fixed;
    z-index: 1000;

  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 150px;

  }
</style>
