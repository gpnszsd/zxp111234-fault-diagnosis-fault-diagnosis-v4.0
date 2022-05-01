'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // http://dataquery-xianchuang123-xcyw.xcgfcloud.com.cn/aggquery/v2/query/v2/queryHistoryRawValueByUri

    proxyTable: {
      // 查询历史报警代理
      '/v1': {
        target: 'https://eventdb-xianchuang123-xcyw.xcgfcloud.com.cn/v1',//查询实时数据
        ws: false, //如果要代理websockets
        secure: false, // 使用的是http协议则设置为false，https协议则设置为true
        changeOrigin: true, //将选项changeOrigin设置true为基于名称的虚拟托管站点。
        pathRewrite: {  //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/v1': ''
        }
      },

      // 查询当前数据代理
      '/aggquery': {
        target: 'https://dataquery-xianchuang123-xcyw.xcgfcloud.com.cn/aggquery',//查询实时数据
        ws: false, //如果要代理websockets
        secure: false, // 使用的是http协议则设置为false，https协议则设置为true
        changeOrigin: true, //将选项changeOrigin设置true为基于名称的虚拟托管站点。
        pathRewrite: {  //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/aggquery': ''
        }
      },
      '/query': {
        target: 'https://dataquery-xianchuang123-xcyw.xcgfcloud.com.cn',//查询实时数据
        ws: false, //如果要代理websockets
        secure: false, // 使用的是http协议则设置为false，https协议则设置为true
        changeOrigin: true, //将选项changeOrigin设置true为基于名称的虚拟托管站点。
        pathRewrite: {  //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/query': ''
        }
      },
      '/apis': {
        // target: 'http://10.35.174.8:8000',//向后台请求统一接口
        //  target: 'http://10.7.27.201:8000',
        // target: 'http://fault-diagnosis-server-xianchuang123-xcyw.xcgfcloud.com.cn/',
        target: 'http://127.0.0.1:8000',
        // target: 'http://42397308rf.zicp.vip:48575',
        ws: false, //如果要代理websockets
        secure: false, // 使用的是http协议则设置为false，https协议则设置为true
        changeOrigin: true, //将选项changeOrigin设置true为基于名称的虚拟托管站点。
        pathRewrite: {  //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/apis': ''
        }
      },
      //令牌代理
      '/register': {
        target: 'https://xianchuang123-holli-iam-iam-xianchuang123-default.xcgfcloud.com.cn/sts/oauth/token',//向先创请求用户令牌
        ws: false,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/register': ''
        }
      },
      // 获取code
      '/oauth/authorize' : {
        target :'http://xianchuang123-holli-iam-login-xianchuang123-default.xcgfcloud.com.cn/oauth/authorize',
        ws: false,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/oauth/authorize': ''
        }
      },
      // 获取token
      '/oauth/token' : {
        target :'http://xianchuang123-holli-iam-login-xianchuang123-default.xcgfcloud.com.cn/oauth/token',
        ws: false,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/oauth/token': ''
        }
      },
      // 退出
      '/logout' :{
        target :'http://xianchuang123-holli-iam-login-xianchuang123-default.xcgfcloud.com.cn/sso/logout',
        ws: false,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/logout': ''
        }
      },


      '/currentUserInfo' : {
        target :'http://xianchuang123-holli-iam-iam-xianchuang123-default.xcgfcloud.com.cn/user/user/currentUserInfo',
        ws: false,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/currentUserInfo': ''
        }
      },
      '/getTreeNode': {
        target: 'https://model-xianchuang123-xcyw.xcgfcloud.com.cn/model/opcua/queryTreeNode/depth/Project_XCGLDSJFX?queryTypeDefinition=true',//拿到令牌后查询树节点
        ws: false,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/getTreeNode': ''
        }
      },
      //连接websocket代理
      '/webSocket': {
        target: 'https://model-xianchuang123-xcyw.xcgfcloud.com.cn',
        ws: false, //如果要代理websockets
        secure: false, // 使用的是http协议则设置为false，https协议则设置为true
        changeOrigin: true, //将选项changeOrigin设置true为基于名称的虚拟托管站点。
        pathRewrite: {  //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/webSocket': ''
        }
      },
      //事件库查询
      '/getEvents': {
        target: 'https://eventdb-xianchuang123-xcyw.xcgfcloud.com.cn',
        ws: false, //如果要代理websockets
        secure: false, // 使用的是http协议则设置为false，https协议则设置为true
        changeOrigin: true, //将选项changeOrigin设置true为基于名称的虚拟托管站点。
        pathRewrite: {  //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/getEvents': ''
        }
      },
      //确认报警
      '/getAcknowledge': {
        target: 'https://eventdb-xianchuang123-xcyw.xcgfcloud.com.cn',
        ws: false, //如果要代理websockets
        secure: false, // 使用的是http协议则设置为false，https协议则设置为true
        changeOrigin: true, //将选项changeOrigin设置true为基于名称的虚拟托管站点。
        pathRewrite: {  //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/getAcknowledge': ''
        }
      },
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },


  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
