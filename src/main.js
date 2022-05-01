// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index';

//全局变量
import global_ from "./utils/global";
Vue.prototype.GLOBAL = global_;


//****iview****
import VueRouter from 'vue-router';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

import axios from "axios";

Vue.prototype.$axios = axios;
//回调地址，线上发布需要改成和利时的正式域名
window.$rdUrl = 'http://localhost:8080'
// window.$rdUrl = 'http://fault-diagnosis-web-xianchuang123-xcyw.xcgfcloud.com.cn'
// window.$rdUrl = 'http://fault-diagnosis-web-xianchuang123-xcyw.xcgfcloud.com.cn/#/login?'
Vue.use(VueRouter);
Vue.use(ViewUI);

import $ from 'jquery';
// 将data-v自动注册所有组件为全局组件
import dataV from '@jiaminghi/data-view'

Vue.use(dataV)

//element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI, {
    size: 'mini'
});
//动态设置title
import VueWechatTitle from 'vue-wechat-title'

Vue.use(VueWechatTitle)

Vue.config.productionTip = false

//引入echart
import * as echarts from 'echarts';

Vue.use(echarts)
Vue.prototype.$echarts = echarts; //在很多组件里用到，但是不想污染全局作用域


new Vue({
    router: router.router,
    render: h => h(App) ,
    store
}).$mount('#app')

/* eslint-disable no-new */
/*new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})*/


// The routing configuration(iview)
/*const RouterConfig = {
  routes: Routers
};*/

//const router = new VueRouter(RouterConfig);
/*new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});*/

/*new Vue({
  el: '#app',
  render: h => h(App)
});*/
