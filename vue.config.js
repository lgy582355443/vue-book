// const CompressionWebpackPlugin = require('compression-webpack-plugin') //生成gzip
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // 代码分析工具

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

const cdn = {
  dev: {
    css: [],
    js: []
  },
  build: {
    css: [],
    js: [
      "https://cdn.bootcss.com/vue/2.6.11/vue.min.js",
      "https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js",
      "https://cdn.bootcss.com/vuex/3.1.2/vuex.min.js",
      "https://cdn.bootcss.com/axios/0.19.2/axios.min.js",
    ]
  }
};

module.exports = {
  //打包路径
  publicPath: './',

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  css: {
    // 提取css代码到文件
    // extract: true
    // css预设器配置项
    loaderOptions: {
      scss: {
        //引入全局样式
        // data：`@import "~@/assets/variable.scss";` v7之前使用 的是data，现在改成了prependData
        prependData: `@import "~@/assets/styles/global.scss";`
      }
    }
  },

  // devServer: {
  // before(app) {
  //   本地数据mock
  //   mock(app, '/book/home', mockBookHomeData)
  //   mock(app, '/book/shelf', mockBookShelfData)
  //   mock(app, '/book/list', mockBookList)
  //   mock(app, '/book/flat-list', mockBookFlatList)
  // }

  // proxy: {
  //拦截所有以'/api'开始的请求
  //   '^/api': { 
  //     target: process.env.VUE_APP_BASE_URL,
  //     changeOrigin: true,
  //     pathRewrite: {
  //     }
  //   },
  // }, 
  // },

  chainWebpack: config => {
    // // 移除 prefetch 插件
    // config.plugins.delete('prefetch');
    // // 移除 preload 插件
    // config.plugins.delete('preload');

    // // 压缩代码
    // config.optimization.minimize(true);
    // // 分割代码
    // config.optimization.splitChunks({
    //   chunks: 'all'
    // })

    //文件路径名替换
    config.resolve.alias
      .set('@', path.resolve(__dirname, './src'))
      .set('cps', path.resolve(__dirname, './src/components'))

    // if (process.env.NODE_ENV === "production") {
    //   // 项目文件大小分析
    //   config.plugin('webpack-bundle-analyzer')
    //     .use(new BundleAnalyzerPlugin({
    //       openAnalyzer: true, // 是否打开默认浏览器
    //       analyzerPort: 8777
    //     }));
    // }

    // // 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
    // config.plugin("html").tap(args => {
    //   if (process.env.NODE_ENV === "production") {
    //     args[0].cdn = cdn.build;
    //   }
    //   if (process.env.NODE_ENV === "development") {
    //     args[0].cdn = cdn.dev;
    //   }
    //   return args;
    // });
  },

  configureWebpack: config => {
    if (process.env.NODE_ENV === "development") {
      config.devtool = "cheap-module-eval-source-map";
    } else {
      //打包的大小限制的警告
      config.performance = {
        hints: 'warning',
        maxAssetSize: 524288 * 10,
        maxEntrypointSize: 524288 * 10
      };

      // // 忽略生产环境打包的文件
      // config.externals = {
      //   vue: "Vue",
      //   "vue-router": "VueRouter",
      //   vuex: "Vuex",
      //   axios: "axios",
      // };

      config.optimization = {
        minimizer: [
          new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true, // Must be set to true if using source-maps in production
            terserOptions: {
              compress: {
                warnings: false,
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ["console.log"]
              }
            }
          })
        ]
      };

      // if (process.env.NODE_ENV === 'production') {
      //   config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      //   config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      //   config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      //   config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
      // }
      // 生成gzip压缩文件
      //   const productionGzipExtensions = ['html', 'js', 'css']
      //   config.plugins.push(
      //     new CompressionWebpackPlugin({
      //       filename: '[path].gz[query]',
      //       algorithm: 'gzip',
      //       test: new RegExp(
      //         '\\.(' + productionGzipExtensions.join('|') + ')$'
      //       ),
      //       threshold: 10240, // 只有大小大于该值的资源会被处理 10k
      //       minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
      //       deleteOriginalAssets: false // 是否删除原文件
      //     })
      //   )
    }
  }

}