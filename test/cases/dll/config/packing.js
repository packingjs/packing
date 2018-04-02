export default (packing) => {
  const p = packing;

  p.path.src.root = '.';
  p.commonChunks = {
    vendor: [
      './v'
    ]
  };

  return p;
};
