export default (packing) => {
  const p = packing;

  p.path.src.root = '.';
  p.path.entries = {
    a: './a.js'
  };
  p.path.src.templates = '.';
  p.path.src.templatesPages = '.';
  p.path.dist.templatesPages = 'templates';

  return p;
};
