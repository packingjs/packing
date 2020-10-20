export default (packing) => {
  const p = packing;

  p.path.entries = {
    a: './a.js',
    'c/d': './c/d.js'
  };
  p.path.src.root = '.';

  p.path.tmpDll = '../dll/.tmp/dll';
  p.template.options.master = 'master.html';
  p.path.src.templates = '.';
  p.path.dist.templates = 'templates';
  p.template.options.engine = 'html';
  p.template.options.extension = '.html';

  p.commonChunks = {
    vendor: ['./v']
  };

  p.longTermCaching.enabled = false;

  p.rewriteRules = {
    '^/zhong$': '/a'
  };

  return p;
};
