export default {
  // 文件路径
  path: {
    src: 'src',
    assets: 'static',
    entries: 'src/entries',
    templates: 'src/templates/jade',
    templatesPages: 'src/templates/jade/pages',
    dist: 'prd',
    assetsDist: 'prd/assets',
    templatesDist: 'prd/templates',
    templatesPagesDist: 'prd/templates/pages'
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
