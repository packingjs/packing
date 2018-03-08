export default (packing) => {
  const p = packing;

  p.path.entries = {
    a: './a.js',
    b: './b.js'
  };

  p.path.dll = '../serve-dll-plugin/.tmp/dll';

  p.commonChunks = {
    vendor: [
      './v'
    ]
  };

  return p;
};
