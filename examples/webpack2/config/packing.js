/**
 * 这个文件可以修改packing配置文件的默认设置
 * 配置文件的位置在 `node_modules/packing/config/packing.js`
 *
 * @param object packing 默认配置对象
 */
import assign from 'object-assign-deep';

export default (packing) => {

  return assign({}, packing, {
    commonChunks: {
      vendor: [
        // 里面包含react和react-dom
        // 但不包含antd组件所需要的css
        // 'antd/lib',
        // antd的css导入机制还没有深入了解
        // 显式声明antd.css
        // 'antd/dist/antd.less',
        './src/a',
        './src/b',
        // './src/lib ^\.\/.*$'
        // './src/lib/*.js'
      ],
    },
  });
};
