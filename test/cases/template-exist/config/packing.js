export default (packing) => {
  const p = packing;

  p.template.autoGeneration = false;
  p.template.inject = false;
  p.template.attrs = ['img:src', 'link:href', 'img:data-src', '*:test'];

  return p;
};
