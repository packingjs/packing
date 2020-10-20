export default (entries) => {
  if (typeof entries === 'function') {
    return entries();
  }
  if (entries !== null && typeof entries === 'object') {
    return entries;
  }
  return {
    main: entries
  };
};
