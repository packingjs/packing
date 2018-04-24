import { isFunction, isObject } from 'util';

export default (entries) => {
  if (isFunction(entries)) {
    return entries();
  } else if (isObject(entries)) {
    return entries;
  }
  return {
    main: entries
  };
};
