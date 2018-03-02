export default (packing) => {
  const p = packing;

  p.path.entries = {
    c: './a.js',
    b: './b.js'
  };

  return p;
};
