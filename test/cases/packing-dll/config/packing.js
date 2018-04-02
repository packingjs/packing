export default (packing) => {
  const p = packing;
  p.path.src.root = '.';
  p.path.entries = {
    c: 'c'
  };
  p.commonChunks = {
    vendor: ['a', 'b']
  };
  return p;
};
