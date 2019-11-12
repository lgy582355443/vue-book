
function mock(app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}
const mockBookHomeData = require('./src/mock/bookHome')
const mockBookList = require('./src/mock/bookList')
const mockBookFlatList = require('./src/mock/bookFlatList')
const mockBookShelfData = require('./src/mock/bookShelf')


module.exports = {
  publicPath: '/',
  devServer: {
    before(app) {
      mock(app, '/book/home', mockBookHomeData)
      mock(app, '/book/shelf', mockBookShelfData)
      mock(app, '/book/list', mockBookList)
      mock(app, '/book/flat-list', mockBookFlatList)
    }
  }
}