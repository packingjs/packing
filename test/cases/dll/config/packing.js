export default (packing) => {
  const p = packing;

  p.commonChunks = {
    vendor: [
      './v'
    ]
  };

  return p;
};
