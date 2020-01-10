const titles = require("./title.js");
const glob = require("glob");
const pages = {};
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const report = process.env.npm_config_report;
const webpack = require("webpack");
const isProduction = process.env.NODE_ENV === "production";
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const path = require("path");

const cdn = {
  css: [],
  js: [
    "https://cdn.bootcss.com/vue/2.6.10/vue.min.js"
    // "https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js",
    // "https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js"
  ]
};

glob.sync("./src/pages/**/main.js").forEach(path => {
  const chunk = path.split("./src/pages/")[1].split("/main.js")[0];
  pages[chunk] = {
    entry: path,
    template: "public/index.html",
    title: titles[chunk],
    chunks: ["chunk-vendors", "chunk-common", chunk]
  };
});
module.exports = {
  pages,
  chainWebpack: config => {
    config.plugins.delete("named-chunks");
    if (isProduction) {
      // 生产环境注入cdn + 多页面
      glob.sync("./src/pages/**/main.js").forEach(path => {
        const chunk = path.split("./src/pages/")[1].split("/main.js")[0];
        config.plugin("html-" + chunk).tap(args => {
          args[0].cdn = cdn;
          return args;
        });
      });
    }
  },

  configureWebpack: config => {
    if (report) {
      config.plugins.push(new BundleAnalyzerPlugin());
    }
    if (isProduction) {
      config.externals = {
        vue: "Vue"
        // vuex: "Vuex",
        // "vue-router": "VueRouter"
        // 'alias-name': 'ObjName'
        // 写法: 中划线: 上驼峰
      };
    }
    config.plugins.push(
      ...["core"].map(name => {
        return new webpack.DllReferencePlugin({
          context: process.cwd(),
          manifest: require(`./public/vendor/${name}-manifest.json`)
        });
      }),
      // 将 dll 注入到 生成的 html 模板中
      new AddAssetHtmlPlugin({
        // dll文件位置
        filepath: path.resolve(__dirname, "./public/vendor/*.js"),
        // dll 引用路径
        publicPath: "./vendor",
        // dll最终输出的目录
        outputPath: "./vendor"
      })
    );
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        pathRewrite: { "^/api": "" }
      }
    }
  }
};
