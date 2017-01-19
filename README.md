#酱印网后台使用说明
<!--
create time: 2016-08-04 10:03:48
Author: <TODO: 刘恬>

edit time: 2016-08-04 14:30:00
edit time: 2016-08-31 16:00:00
-->

###传送门：
1. 新后台采用前端MVVM框架：[vue.js](http://cn.vuejs.org/)
2. 采用单页应用模式，路由规则：[vue-router](http://router.vuejs.org/zh-cn/index.html)
3. 组件化开发采用：[vue-loader](http://vuejs.github.io/vue-loader/)
4. Ajax请求并处理响应采用插件：[vue-resource](https://github.com/vuejs/vue-resource)
5. 模块打包通过：[webpack](http://webpack.github.io/)
6. 部分使用ES2015新语法：[babel](http://babeljs.io/docs/learn-es2015/)
7. chrome开发者工具：[vue-devtools](https://github.com/vuejs/vue-devtools)
8. 页面UI采用定制化的bootstrap主题：[Bootswatch-Flatly](http://bootswatch.com/flatly/#navbar)
9. 状态管理vuex：[vuex](http://vuex.vuejs.org/zh-cn/index.html)

###项目目录
    app 管理后台
     |- index.html         登录入口（每次打开网站先登录，不希望保存密码）
     |- main.html          主文件（欢迎页面）
     |- readme.md          项目说明文档（**必读）
     |- package.json       Node npm包管理 项目配置文件
     |- webpack.config.js  Webpack 构建配置文件
     |- src                项目源文件目录
     | |- main.js          项目入口文件
     | |- router.js        单页路由注册文件
     | |- components       组件文件（包括标题头、侧边栏、可复用组件）
     | |- views            内容页（所有右侧显示的内容）
     | |- filters          用于Vue的过滤文件
     | |- store            存储等功能文件
     | |- vuex             所有组件都可访问的数据存储的地方
     |- static             打包出口文件
     | |- bundle.js        打包后在HTML中引入
     | |- common.js        第三方库打包生成的文件
     | |- chunks           按需加载文件打包片段
     | |- styles           CSS文件打包

###下载查看

代码克隆到本地，可以看到以上目录文件，但是没有`static`文件夹

###运行修改

#####1.首先使用`node`的管理包工具`npm`下载所有依赖组件

    $ cd [your path]
    $ sudo npm install
    //需要管理员权限，在前面加sudo
    
可以在目录中看到新生成`node_modules`文件夹

#####2.然后在终端运行`webpack`命令

    $ cd [your path]
    $ webpack

会在目录下生成`static`文件夹，然后代码就可以在浏览器运行了，但不能在本地运行，只能在服务器端环境下运行，如`localhost:8080`，同理当修改文件后在浏览器刷新不会起作用，需要进行`webpack`打包

###组件模块列表

一些组件可以直接复用，避免重复造轮子，放在`components`文件夹中

    selectRegion.vue       //区域单选框，用于获取不同省市区列表
    sidebar.vue            //侧边栏

页面内组件，只在当前页面中使用，就不用写到`components`文件夹了，写在每个页面内的`comp`文件夹中

    order/comp/showDetail.vue       //显示商品详情的弹出框
    order/comp/editDetail.vue       //编辑商品信息弹出框
    order/comp/consigneeItem.vue    //收货人信息组件
    order/comp/invoiceComponent.vue //发票信息组件
    
###组件开发思路
1. 每个功能一个组件，写在一个`.vue`文件中，包括所有的HTML，CSS，js，写在views文件夹中，相关页面可统一放在一个文件夹下。
2. 然后在`router.js`里注册路由，并引入该组件的路径，就可以新建一个组件
3. 公共组件抽离出一个单独的`.vue`文件，在需要用到的文件中通过`import`引入，根据`vue`中父子组件进行数据通信，放在`components`文件夹中
4. 前后端完全分离，只通过`ajax`传递`json`来进行通信。
5. 使用MVVM框架的解放DOM操作，转变为数据操作，这样更加简单快速