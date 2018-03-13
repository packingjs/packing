export default (packing) => {
  const p = packing;

  p.path.entries = {
    a: './a.js',
    b: './b.js',
    'c/d': './c/d.js',
    __: './__.js'
  };

  p.path.dll = '../dll/.tmp/dll';

  p.commonChunks = {
    vendor: ['./v']
  };

  p.longTermCaching = false;

  return p;
};
