
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


module.exports = {
  publicPath: './',
  devServer: {

    //本地数据mock
    // before(app) {
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
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxAssetSize: 524288 * 10,
      maxEntrypointSize: 524288 * 10
    }
  }
}