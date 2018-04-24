import { isFunction, isString } from 'util';

export default (entries) => {
  if (isFunction(entries)) {
    return entries();
  } else if (isString(entries)) {
    return {
      main: entries
    };
  }
  return entries;
};
