export default (packing) => {
  const p = packing;

  p.path.entries = {
    a: './a.js',
    __: './__.js'
  };

  return p;
};
