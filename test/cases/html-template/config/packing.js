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
  p.path.src.templatesPages = '.';
  p.path.dist.templatesPages = 'templates';

  p.commonChunks = {
    vendor: ['./v']
  };

  p.longTermCaching = false;

  p.rewriteRules = {
    '^/zhong$': '/a'
  };

  return p;
};
