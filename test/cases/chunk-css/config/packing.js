export default (packing) => {
  const p = packing;
  p.path.src.root = '.';
  p.path.entries = {
    entry: './entry.js'
  };
  p.longTermCaching = false;
  return p;
};
