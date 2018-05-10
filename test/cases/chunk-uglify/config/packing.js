export default (packing) => {
  const p = packing;

  p.path.src.root = '.';
  p.path.entries = './entry.js';

  p.template.enabled = false;

  return p;
};
