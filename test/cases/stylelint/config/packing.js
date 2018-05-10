import { resolve } from 'path';
import { getContext } from '../../../../src';

export default (packing) => {
  const p = packing;

  p.stylelint.options = {
    ...p.stylelint.options,
    ...{
      context: resolve(getContext())
    }
  };

  p.path.src.root = '.';
  p.path.entries = {
    entry: './entry.js'
  };
  p.longTermCaching.enabled = false;

  return p;
};
