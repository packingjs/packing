export default (packing) => {
  const p = packing;

  p.commonChunks = {
    vendor: [
      './a'
    ]
  };

  return p;
};
