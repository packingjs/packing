export default (packing) => {
  const p = packing;
  p.path.entries = './entry.js';
  p.commonChunks = {
    vendor: [
      './a'
    ]
  };
  return p;
};
