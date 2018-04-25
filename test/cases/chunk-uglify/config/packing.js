export default (packing) => {
  const p = packing;

  p.path.src.root = '.';
  p.path.entries = './entry.js';

  p.template.enable = false;

  // p.minimize = true;

  return p;
};
