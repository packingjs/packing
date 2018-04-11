export default (packing) => {
  const p = packing;
  p.path.src.root = '.';
  p.path.entries = {
    a: './a.js'
  };
  p.commonChunks = {
    vendor: [
      'ccc', 'sub/bbb', './d'
    ]
  };
  p.template.autoGeneration = false;
  p.minimize = false;
  return p;
};
