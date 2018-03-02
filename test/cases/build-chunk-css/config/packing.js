export default (packing) => {
  const p = packing;
  p.path.entries = {
    entry: './entry.js'
  };
  return p;
};
