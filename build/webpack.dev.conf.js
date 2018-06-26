'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

//  下面是后端代理请求设置绕过host及refrere begin的引用
//  剩下的后端发送请求配置在下面的devServer里面写
const express = require('express')
const axios = require('axios')
const app = express()
let apiRoutes = express.Router()
app.use('/api', apiRoutes)
// 上面是后端代理请求设置绕过host及refrere begin的引用

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    //  下面是请求代理前端的请求在这里接收；然后向qq音乐发送请求把数据在传给前端
    before(app) {
      app.get('/api/getHotList', function (req, res) {
        //  设置路由
        //  前端请求/getHotList转到这里
        //  这里通过axios请求'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'这个地址
        //  并且请求里设置参数referer:'https://c.y.qq.com/',host:'c.y.qq.com'
        //  传入req是前端请求传入参数
        //  res是响应给前端的数据
        let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          // 获取歌单发送ajax请求所需要的请求头响应头
          // 这两个参数就是骗过qq的关键
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query  // 通过前端传入的req获取到请求参数
        }).then((response) => {// 这个response是最终获取的数据，透传给res再通过res响应给rc/api/essence.js（前端）
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })

      // app.get('/api/lyric', function (req, res) {
      //   let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
      //   axios.get(url, {
      //     headers: {
      //       referer: 'https://c.y.qq.com/',
      //       host: 'c.y.qq.com'
      //     },
      //     params: req.query
      //   }).then((response) => {
      //     var ret = response.data
      //     if (typeof ret === 'string') {
      //       var reg = /^\w+\(({[^()]+})\)$/
      //       var matches = ret.match(reg)
      //       if (matches) {
      //         ret = JSON.parse(matches[1])
      //       }
      //     }
      //     res.json(ret)
      //   }).catch((e) => {
      //     console.log(e)
      //   })
      // })
    },
    //  上面是请求代理谁前端的请求在这里接收3；然后想qq音乐发送请求把数据在传给前端
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
