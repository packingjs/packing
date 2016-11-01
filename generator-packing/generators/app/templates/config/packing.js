/**
 * 这个文件可以修改packing配置文件的默认设置
 * 配置文件的位置在 `node_modules/packing/config/packing.js`
 *
 * @param object packing 默认配置对象
 */

import assign from 'object-assign-deep';

export default packing => assign({}, packing, {
  // 在这里自定义配置
  // port: {
  //   dev: 3000
  // }
});
