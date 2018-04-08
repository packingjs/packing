export default (packing) => {
  const p = packing;
  p.stylelint = true;
  // p.stylelintOptions = {
  //   files: ['**/*.css']
  // };
  p.path.src.root = '.';
  p.path.entries = {
    entry: './entry.js'
  };
  p.longTermCaching = false;
  return p;
};
