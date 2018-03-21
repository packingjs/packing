export default (packing) => {
  const p = packing;

  p.path.entries = {
    a: './a.js'
  };
  p.path.templatesPagesDist = 'prd/templates';

  return p;
};
