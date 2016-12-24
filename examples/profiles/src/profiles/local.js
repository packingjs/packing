import assign from 'object-assign-deep';

export default (profile) => {
  return assign({}, profile, {
    cdnRoot: '',
    lang: 'zh-cn',
    name: 'Joe',
  });
};
