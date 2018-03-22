export default (packing) => {
  const p = packing;

  p.path.entries = {
    a: './a.js',
    b: './b.js',
    'c/d': './c/d.js'
  };
  p.path.templates = 'templates';
  p.path.templatesPages = 'templates/pages';
  p.path.dll = '../dll/.tmp/dll';

  p.commonChunks = {
    vendor: ['./v']
  };

  p.longTermCaching = false;

  p.templateEngine = 'pug';
  p.templateExtension = '.pug';

  p.rewriteRules = {
    '^/test$': '/a'
  };

  return p;
};
