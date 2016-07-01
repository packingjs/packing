export default {
  // 文件路径
  path: {
    src: 'src',
    dist: 'prd',
    assets: 'static',
    entries: 'src/entries',
    templates: 'src/templates/jade'
  },

  // webserver端口
  port: {
    dev: 3001,
    dist: 8080,
  },

  rewriteRules: {
    '^/api/(.*)': 'require!/mock/api/$1.js',
    // '^/hello': 'http://localhost:3001/123/4.html',
  },

  router: {
    '/': 'index.html',
    '/list': 'list.html'
  }
};
