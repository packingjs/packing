export default (key, value) => {
  if (Array.isArray(value)) {
    return value.find(item => item.indexOf(key) > -1);
  }
  return value;
};
