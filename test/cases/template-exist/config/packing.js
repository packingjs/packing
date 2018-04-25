export default (packing) => {
  const p = packing;

  p.template.options.autoGeneration = false;
  p.template.options.inject = false;
  p.template.options.attrs = ['img:src', 'link:href', 'img:data-src', '*:test'];

  return p;
};
