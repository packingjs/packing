export default (packing) => {
  const p = packing;

  p.path.src.root = '.';
  p.path.entries = {
    a: './a.js'
  };
  p.path.src.templates = '.';
  p.path.dist.templates = 'templates';
  p.template.engine = 'html';
  p.template.extension = '.html';

  return p;
};
