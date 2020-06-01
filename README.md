# vue-multiple-pages-demo

项目说明: [https://juejin.im/post/5e1301cb6fb9a048011b5036](https://juejin.im/post/5e1301cb6fb9a048011b5036)

### 分支 
`master` 多页面配置,externals和dllPlugin混合
`externals` 仅包含externals配置
`component-single` 将项目作为单个组件开发的启动项目,基于externals(引用vue)
`component-multiple` 将项目作为多组件开发的启动项目,基于externals(引用vue)

> 在components分支下,可以快速开发自用ui组件/lib,分别放在packages/和libs/下

### 配置文件
`vue.config.js` —— 配置webpack   
`config.title.js` —— 配置webpack中entry的title     
`webpack.dll.conf.js` —— 配置dllPlugin         
`config.dll.js` —— 配置dllPlugin中的entry        

## 作为多组件开发项目

### 创建组件
参考`vant`的`createNamespace`函数创建组件


### 打包方案
#### 打包单个组件
官方有两种打包方案,均适用于打包单个组件:

- 打包lib
将一些通用的utils/formatters打包成独立的lib
[Web Components 组件](https://cli.vuejs.org/zh/guide/build-targets.html#web-components-%E7%BB%84%E4%BB%B6)
```shell script
vue-cli-service build --target lib --name myLib [entry]
```
运行`yarn run component-single`, 生成
```shell script
  File                               Size                Gzipped

  lib/index.umd.min.js    15.35 KiB           5.75 KiB
  lib/index.umd.js        50.87 KiB           12.42 KiB
  lib/index.common.js     50.49 KiB           12.32 KiB
  lib/index.css           0.09 KiB            0.09

```
修改`package.json`
```json
{
  "main": "lib/index.umd.min.js"
}
```
引入组件
```js
  // dev 
 import { ComponentJsx, ComponentSfc } from '@/components'
  // use from local lib
  import { ComponentJsx, ComponentSfc } from './../../lib/index.umd'
  // use from node_modules
  import { ComponentJsx, ComponentSfc } from 'component-single'

  Vue.use(ComponentSfc)
  Vue.use(ComponentJsx)
```
在项目根目录下运行`yarn link`可关联项目,关联后即可在本地`node_modules`下看到项目文件,在正式发布前,可通过此方法调试

```shell script
$ yarn link                   
yarn link v1.22.4
success Registered "component-single".
info You can now run `yarn link "component-single"` in the projects where you want to use this package and it will be used instead.
✨  Done in 0.05s.
```

- 打包Web Componennt
```shell script
vue-cli-service build --target wc --name my-element [entry]
```

需要配合[@vue/web-component-wrapper](https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-web-component-wrapper/README.md) 使用

[vue-cli 3.x 开发插件并发布到 npm](https://www.cnblogs.com/wisewrong/p/10186611.html)

#### 打包多个组件
如果没有按需引入的要求,用上文中单个打包方案即可.
因为我想要开发可以按需引入的组件,所以需要通过`babel-plugin-import`插件,实现原理:
```
```
可看到这个插件实际上是在项目编译时通过别名引入对应的文件,所以我们的项目要符合其对应的格式,即
```
MyComponents/component-a/xx.js
MyComponents/component-a/xx.css
MyComponents/component-b/xx.js
MyComponents/component-b/xx.css
```
这种格式结合多entry配置,也很好实现

### 配置按需引入
babel-plugin-import
修改`babel.config.js`

> 再次修改因为缓存会失效, 务必删除babel缓存!
>Caching
 cache-loader is enabled by default and cache is stored in <projectRoot>/node_modules/.cache/babel-loader.

### 单元测试
通过`jest`进行单元测试


