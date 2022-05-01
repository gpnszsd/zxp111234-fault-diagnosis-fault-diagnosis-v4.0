import Vue from 'vue'

import Vuex from 'vuex'

import persistedState from 'vuex-persistedstate'


import { register , getToken ,    getUser ,logout} from "../api/faultWarning";

Vue.use(Vuex)

function clearAllCookie () {
    let date=new Date();
    date.setTime(date.getTime()-10000);
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    console.log("需要删除的cookie名字："+keys);
    if (keys) {
        for (let i =  keys.length; i--;)
          document.cookie=keys[i]+"=0; expire="+date.toGMTString()+"; path=/";
    }
}

export default new Vuex.Store({

    state: {

        //这里放全局参数

        SysData : {

        },
        UserData : null
    },

    mutations: {
        CHANGE_SYSDATA(state , data){

            state.SysData = data

        },
        CHANGE_USER_DATA(state , data){

            state.UserData = data

        },
        CLEAR_ALL(state , ){
            state.UserData = {}
            state.SysData = {}
        }
    },

    actions: {

        // 获取客户端ssdi

      getToken({commit  }, code) {
            console.log(code)
            return new Promise((resolve,reject) => {
            let postData = {
              grant_type: 'authorization_code',
              client_id: 'GLYFX',
              client_secret: '9ddfd71b-1afe-11a2-9321-b03c30700485',
              code: code,
              redirect_uri: window.$rdUrl
            }

            // try{
              // let tokenData =await getToken(postData)
              getToken(postData).then(res=> {
                commit( 'CHANGE_SYSDATA' , res.data)

                resolve(res.data)
              }).catch( err => {
                window.location = `http://xianchuang123-holli-iam-login-xianchuang123-default.xcgfcloud.com.cn/oauth/authorize?response_type=code&client_id=GLYFX&redirect_uri=${window.$rdUrl}`
                reject(err)
              })
              // commit( 'CHANGE_SYSDATA' , tokenData.data)
              // window.location.href = "/#/faultWarnings"

            // }catch(e){
            //   debugger
            //   console.log("获取token异常 ",e);
            //   // window.location = `http://xianchuang123-holli-iam-login-xianchuang123-default.xcgfcloud.com.cn/oauth/authorize?response_type=code&client_id=GLYFX&redirect_uri=${window.$rdUrl}`
            // }
          })

        },
         getUser({commit , state}){
           return new Promise((resolve,reject) => {
             ///获取用户信息，获取不到的话跳转到平台登录页面进行oauth登录认证
             let t = state.SysData.token_type + ' '+ state.SysData.access_token
             // try{
             getUser(t).then(res => {
               commit('CHANGE_USER_DATA' ,res.data.results)
               resolve(res)
             }).catch(err =>{
               console.log("没有登录，跳转登录页。。。",err)
               debugger
               window.location = `http://xianchuang123-holli-iam-login-xianchuang123-default.xcgfcloud.com.cn/oauth/authorize?response_type=code&client_id=GLYFX&redirect_uri=${window.$rdUrl}`
             })
             // }catch(e){
             //
             // }
           })

        },
        async clearAll ({commit , state}){
            clearAllCookie()
            let t = state.SysData.token_type + ' '+ state.SysData.access_token

            commit("CLEAR_ALL" )
            logout(t).then(res =>{

            }).catch(err =>{
              window.location = `http://xianchuang123-holli-iam-login-xianchuang123-default.xcgfcloud.com.cn/oauth/authorize?response_type=code&client_id=GLYFX&redirect_uri=${window.$rdUrl}`
            })

        }

    },

    modules: {


    },
  getters: {
    user:state =>state.UserData
  },
    plugins: [persistedState()]

})


