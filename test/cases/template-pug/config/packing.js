export default (packing) => {
  const p = packing;

  p.path.entries = {
    a: './a.js',
    'c/d': './c/d.js'
  };
  p.path.src.root = '.';
  // p.path.src.templates.layout = 'templates/';
  p.path.tmpDll = '../dll/.tmp/dll';
  p.template.options.master = 'templates/pages/default.pug';
  p.runtimeChunk.enabled = true;
  // p.visualizer.enabled = false;

  p.commonChunks = {
    vendor: ['./v']
  };

  p.rewriteRules = {
    '^/test$': '/a'
  };

  return p;
};
