export default (packing) => {
  const p = packing;

  p.path.entries = {
    a: './a.js'
  };

  return p;
};
