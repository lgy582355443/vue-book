
//本地数据mock
// function mock(app, url, data) {
//   app.get(url, (request, response) => {
//     response.json(data)
//   })
// }
// const mockBookHomeData = require('./src/mock/bookHome')
// const mockBookList = require('./src/mock/bookList')
// const mockBookFlatList = require('./src/mock/bookFlatList')
// const mockBookShelfData = require('./src/mock/bookShelf')

// const isProduction = process.env.NODE_ENV === 'production';

const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  publicPath: './',

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  css: {
    //提取css代码到文件
    extract: true
    // css预设器配置项
    // loaderOptions: {
    //   sass: {
    //     // 引入全局变量样式,@使我们设置的别名,执行src目录
    //     data: `
    //     @import "@/assets/styles/global.scss";
    //         `
    //   }
    // },
  },

  devServer: {
    // before(app) {
    //   本地数据mock
    //   mock(app, '/book/home', mockBookHomeData)
    //   mock(app, '/book/shelf', mockBookShelfData)
    //   mock(app, '/book/list', mockBookList)
    //   mock(app, '/book/flat-list', mockBookFlatList)
    // }
    // proxy: {
    //   '^/api': { //拦截所有以'/api'开始的请求
    //     target: process.env.VUE_APP_BASE_URL,
    //     changeOrigin: true,
    //     pathRewrite: {
    //     }
    //   },
    // }, 
  },

  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload');

    // 压缩代码
    config.optimization.minimize(true);
    // 分割代码
    config.optimization.splitChunks({
      chunks: 'all'
    })
  },

  configureWebpack: config => {
    //打包的大小限制
    config.performance = {
      hints: 'warning',
      maxAssetSize: 524288 * 10,
      maxEntrypointSize: 524288 * 10
    };

    // gzip压缩
    const productionGzipExtensions = ['html', 'js', 'css']
    config.plugins.push(
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' + productionGzipExtensions.join('|') + ')$'
        ),
        threshold: 10240, // 只有大小大于该值的资源会被处理 10k
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        deleteOriginalAssets: false // 删除原文件
      })
    )
  }

}