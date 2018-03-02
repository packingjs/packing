export default (packing) => {
  const p = packing;

  p.path.entries = {
    b: './b.js'
  };

  p.path.dll = '../dll-plugin/.tmp/dll';

  p.commonChunks = {
    vendor: [
      './a'
    ]
  };

  return p;
};
