import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-router'
import Vuex from 'vuex';
// import Home from '../views/home/Home.vue'
// import Predict from '../views/predict/Predict'
import createPersistedState from 'vuex-persistedstate'
/*const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}*/

//Vue.use(Router)
Vue.use(VueRouter)
Vue.use(Vuex)

/*export default new Router({})*/


const routes = [{
  path: '/',
  name: 'menuDemo',
  redirect: '/faultWarnings',
  // redirect: '/login',
  component: () =>
  import ('../views/home/MenuDemo.vue'),
  children: [{
    path: '/faultWarnings',
    name: 'FaultWarnings',
    component: () =>
      import ('../views/faultalarm/FaultWarnings'),
    meta: {title: '预警'}
  },
    {
      path: '/effOpt',
      name: 'EffOpt',
      component: () =>
        import ('../views/optimization/EffOpt.vue'),
      meta: {title: '优化'}
    },
    {
      path: '/newEffOpt',
      name: 'newEffOpt',
      component: () =>
        import ('../views/optimization/NewEffOpt.vue'),
      meta: {title: '优化', keepAlive: true}
    },
    {
      path: '/bigData',
      name: 'BigData',
      component: () =>
        import ('../views/analysis/bigDataAnalysis.vue'),
      meta: {title: '分析'}
    },
    {
      path : '/login',
      name : "Login",
      component : ()=>import("../views/login/index.vue")
    },
    {
      path : '/health',
      name : "Health",
      component : ()=>import("../views/health/HealthManage.vue")
    },
    /*{
      path: '/predict',
      name: 'Predict',
      component: Predict,
      meta: {title: '预测'}
    },*/
    /*{
      path: '/faultDiagnosis',
      name: 'FaultDiagnosis',
      component: () => import('../views/faultdiagnosis/FaultDiagnosis.vue'),
      meta: {title: '故障诊断与分析'}
    },*/
    /*{
      path: '/faultWarning',
      name: 'FaultWarning',
      component: () => import('../views/faultwarning/FaultWarning'),
      meta: {title: '故障预警'}
    },*/
    // {
    //   path: '/faultAlarm',
    //   name: 'FaultAlarm',
    //   component: () => import('../views/faultalarm/FaultAlarm'),
    //   meta: {title: '故障报警'}
    // },
    /*{
      path: '/maintenanceAdvice',
      name: 'MaintenanceAdvice',
      component: () => import('../views/maintenanceadvice/MaintenanceAdvice'),
      meta: {title: '维护建议'}
    },*/
    /*{
      path: '/test',
      name: 'test',
      component: () => import('../views/faultwarning/TestTree.vue'),
      meta: {title: 'test'}
    },*/
    //得分环组件测试
    /*{
      path: '/ringGaugeChart',
      name: 'ringGaugeChart',
      component: () => import('../components/optimization/RingGaugeChart1.vue'),
      meta: {title: 'ringGaugeChart'}
    },*/
  ]
}]

const router = new VueRouter({
  routes
})

export default {router, routes}
