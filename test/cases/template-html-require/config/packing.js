export default (packing) => {
  const p = packing;

  p.path.src.root = '.';
  p.path.entries = {
    a: './a.js'
  };
  p.path.src.templates = '.';
  p.path.dist.templates = 'templates';
  p.template.options.engine = 'html';
  p.template.options.extension = '.html';

  return p;
};
