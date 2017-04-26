/**
 * 这个文件可以修改packing配置文件的默认设置
 * 配置文件的位置在 `node_modules/packing/config/packing.js`
 *
 * @param object packing 默认配置对象
 */
export default (packing) => {
  const p = packing;

  p.commonChunks = {
    vendor: [
      './src/a',
      './src/b',
      // 'antd/lib'
      // './src/lib ^\.\/.*$'
      // './src/lib/*.js'
    ],
  };

  return p;
};
