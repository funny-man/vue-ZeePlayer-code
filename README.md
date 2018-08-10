# zee-music(vue2.0)

> 基于vue全家桶做的一款音乐webapp
> 仓库地址：https://github.com/funny-man/vue-myMusic-code

## 效果预览
![Image text](https://raw.githubusercontent.com/funny-man/vue-myMusic-code/master/img-folder/PNG%20%E5%9B%BE%E5%83%8F-024ACCC59CF1-1.png)

## 文件目录架构

**文件夹**

  ---build  //webpack相关配置
  ---config //webpack相关配置
  ---dist   //打包后的项目资源文件（用于上线）
  ---node_modules   //一些开发依赖包
  ---src    //存放项目源码
      |
      |---api //一些数据请求的方法
      |---base //通用组件（如scroll song-list）
      |---common //一些通用静态的资源
            |---fonts //字体icon文件
            |---image //图片
            |---js //通用js文件（通用方法）
            |---stylus //基本样式文件
      |---components//组件
      |---router//路由相关文件 
      |---store//存放vuex相关
      app.vue
      main.js //入口文件
      |
  ---static  //存放第三方静态资源默认里面有个.gitkeep（.gitkeep文件的作用是就算static是空的也会向git提交这个文件夹）


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
