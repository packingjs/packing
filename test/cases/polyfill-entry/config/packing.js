export default (packing) => {
  const p = packing;

  p.path.entries = {
    entry: ['./polyfill.js', './entry.js']
  };
  p.path.src.root = '.';
  p.template.options.master = 'templates/pages/default.pug';
  p.visualizer.enabled = false;

  return p;
};
