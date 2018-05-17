export default (packing) => {
  const p = packing;
  p.path.entries = './src/lib.js';
  p.commonChunks = {};
  p.visualizer.enabled = false;
  p.template.enabled = false;
  return p;
};
