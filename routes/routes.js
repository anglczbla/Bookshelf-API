const handler = require('../handlers/handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: handler.addBook
  },
  {
    method: 'GET',
    path: '/books',
    handler: handler.getBooks
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: handler.getBookById
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: handler.updateBook
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: handler.deleteBook
  }
];

module.exports = routes;
