/**
 * 这个文件可以修改packing配置文件的默认设置
 * 默认配置请看 `node_modules/packing/config/packing.js`
 *
 * @param object packing 默认配置对象
 */

export default (packing) => {
  const p = packing;
  p.graphqlMockServer = true;
  // p.path.src = 'test/src';
  // p.entries = 'index.js';

  return p;
};
