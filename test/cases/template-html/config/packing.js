export default (packing) => {
  const p = packing;

  p.path.src.root = '.';
  p.path.entries = {
    a: './a.js',
    b: './b.js',
    'c/d': './c/d.js',
    e: './e.js'
  };

  p.path.tmpDll = '../dll/.tmp/dll';
  p.path.src.templates = '.';
  p.path.dist.templates = 'templates';
  p.template.options.engine = 'html';
  p.template.options.extension = '.html';
  p.template.options.source = 'default.html';

  p.commonChunks = {
    vendor: ['./v']
  };

  p.longTermCaching.enabled = false;

  p.rewriteRules = {
    '^/zhong$': '/a'
  };

  return p;
};
