# zee-music(vue2.0)
![](https://img.shields.io/badge/language-{vue2.0}-{green}.svg)  ![](https://img.shields.io/badge/vue--router-v3.0.1-ff69b4.svg)  ![](https://img.shields.io/badge/vuex-v2.3.1-blue.svg)



> 基于vue全家桶做的一款音乐webapp
> 所以数据的获取都是通过qq音乐表示感谢
> 关于设计稿由于我是设计专业的之前也是做设计所以基本是边做边修改所以没有完整的设计稿

项目包括
- essence>歌单列表、轮播、歌单详情
- singer>歌手列表、歌手详情
- ranking>排行榜、排行榜详情
- search>搜索框、热门搜索、
- player核心页面
- 搜藏歌曲、播放记录、搜索历史---（通过本地储存）
- 确认弹出框 loading ... 等等

希望能给你原生般的顺滑体验
如果你觉得不错，对你有帮助，欢迎点个star，也可以帮忙分享给你更多的朋友 ，

## 技术栈

这个项目基于vue2.0
用到
- vue-cli --脚手架搭建项目 
- vue-router --做前端路由
- vuex --做状态管理
- js使用的es6规范
- css预编译选择用的sass
- axios+jsonp --实现数据请求和跨域
- 用到一些组件better-scroll（scroll库类似iscroll）+vue-Lazyload（懒加载）-create-keyframe-animation（动效）+js-base64（编码解码）+lyric-parser（歌词解析）+good-storage（本地储存）

## 文件目录架构

**文件夹**

``` bash
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
```

## DOME预览地址

>项目预览：https://funny-man.github.io/vue-myMusic-preview/#/essence


## 效果预览
![Image text](https://raw.githubusercontent.com/funny-man/vue-myMusic-code/master/img-folder/%E9%A6%96%E9%A1%B5%402x.png)
![Image text](https://raw.githubusercontent.com/funny-man/vue-myMusic-code/master/img-folder/%E6%AD%8C%E5%8D%95%402x.png)
![Image text](https://raw.githubusercontent.com/funny-man/vue-myMusic-code/master/img-folder/player%402x.png)


## Build Setup
> 仓库地址：https://github.com/funny-man/vue-myMusic-code

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```


## 更新问题修复

- 修复qq音乐接口无法播放要获取songkey

- 首页轮播获取数据图片出错导致布局问题--当图片出错用默认图片代替

- 微信浏览器进入第二个页面下面会出现底部栏导致的scroll问题--利用vue的生命周期钩子'activated'

- 解决移动端首次播放 --使用了一个空白的很小mp3文件在进入webapp时候就注册一个全局点击事件触发播放然后把时间删除并且把播放器暂停数据重置

- 部分接口跨域问题

- cd的转动停止（移动端不支持animation-play-state: paused;）--只能通过每次暂停设置cd的transform
