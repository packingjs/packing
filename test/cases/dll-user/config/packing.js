export default (packing) => {
  const p = packing;

  p.path.src.root = '.';
  p.path.entries = {
    a: './a.js',
    b: './b.js'
  };

  p.template.options.autoGeneration = false;

  p.path.tmpDll = '../dll/.tmp/dll';

  p.commonChunks = {
    vendor: [
      './v'
    ]
  };

  return p;
};
