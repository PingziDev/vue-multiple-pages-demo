const titles = require("./title.js");
const glob = require("glob");
const pages = {};
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const report = process.env.npm_config_report;

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
  chainWebpack: config => config.plugins.delete("named-chunks"),
  configureWebpack: config => {
    if (report) {
      config.plugins.push(new BundleAnalyzerPlugin());
    }
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
