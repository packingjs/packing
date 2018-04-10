import { resolve } from 'path';
import { getContext } from '../../../../src';

export default (packing) => {
  const p = packing;

  p.stylelint.enable = true;
  p.stylelint.options = {
    ...p.stylelint.options,
    ...{
      context: resolve(getContext())
    }
  };
  // p.stylelintOptions = {
  //   files: ['**/*.css']
  // };
  p.path.src.root = '.';
  p.path.entries = {
    entry: './entry.js'
  };
  p.longTermCaching.enable = false;

  return p;
};
