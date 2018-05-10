export default (packing) => {
  const p = packing;
  p.path.src.root = '.';
  p.path.entries = {
    a: './a.js'
  };
  p.eslint.enabled = false;
  p.stylelint.enabled = false;
  p.runtimeChunk.enabled = true;
  p.minimize.enabled = false;
  p.commonChunks = {
    vendor: [
      'ccc', 'sub/bbb', 'sub2/', './d', './useless'
    ]
  };
  p.template.options.autoGeneration = false;
  return p;
};
